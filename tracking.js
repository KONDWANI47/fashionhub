// Track page visit
async function trackVisit() {
    const page = window.location.pathname;
    const userAgent = navigator.userAgent;
    const referrer = document.referrer;
    const timestamp = new Date().toISOString();
    const screenSize = `${window.innerWidth}x${window.innerHeight}`;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // SEO metrics
    const seoData = collectSEOData();
    
    // Additional metrics
    const deviceInfo = {
        isMobile: /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent),
        isTablet: /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent),
        isDesktop: !(/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)),
        browser: getBrowserInfo(userAgent),
        os: getOSInfo(userAgent)
    };

    // Track scroll depth
    let maxScroll = 0;
    let scrollPoints = new Set();
    
    function trackScroll() {
        const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
        maxScroll = Math.max(maxScroll, scrollPercent);
        scrollPoints.add(Math.floor(scrollPercent / 25) * 25); // Track in 25% increments
    }

    // Track user interactions
    let interactionCount = 0;
    let lastInteraction = Date.now();
    
    function trackInteraction() {
        interactionCount++;
        lastInteraction = Date.now();
    }

    // Track mouse movements
    let mouseMovements = 0;
    let lastMouseMove = Date.now();
    
    function trackMouseMove() {
        mouseMovements++;
        lastMouseMove = Date.now();
    }

    // Add event listeners
    window.addEventListener('scroll', trackScroll);
    window.addEventListener('click', trackInteraction);
    window.addEventListener('keydown', trackInteraction);
    window.addEventListener('mousemove', trackMouseMove);

    // Send visit data
    fetch('/track-visitor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            page,
            userAgent,
            referrer,
            timestamp,
            screenSize,
            language,
            timezone,
            deviceInfo,
            seoData,
            initialMetrics: {
                maxScroll,
                scrollPoints: Array.from(scrollPoints),
                interactionCount,
                mouseMovements
            }
        })
    });

    // Track visit duration and engagement
    let startTime = Date.now();
    let duration = 0;
    let isActive = true;
    let activeTime = 0;
    let lastActiveCheck = startTime;

    // Check if user is active
    function checkActivity() {
        const now = Date.now();
        const timeSinceLastInteraction = now - Math.max(lastInteraction, lastMouseMove);
        const wasActive = isActive;
        isActive = timeSinceLastInteraction < 30000; // Consider inactive after 30 seconds

        if (wasActive && isActive) {
            activeTime += now - lastActiveCheck;
        }
        lastActiveCheck = now;
    }

    // Update metrics every 10 seconds
    const metricsInterval = setInterval(() => {
        duration = Math.floor((Date.now() - startTime) / 1000);
        checkActivity();
        
        // Send periodic update
        fetch('/track-engagement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page,
                duration,
                activeTime: Math.floor(activeTime / 1000),
                maxScroll,
                scrollPoints: Array.from(scrollPoints),
                interactionCount,
                mouseMovements,
                isActive
            })
        });
    }, 10000);

    // Send final data when user leaves the page
    window.addEventListener('beforeunload', () => {
        clearInterval(metricsInterval);
        duration = Math.floor((Date.now() - startTime) / 1000);
        checkActivity();
        
        // Use sendBeacon for more reliable data sending when page is unloading
        const data = new Blob([JSON.stringify({
            page,
            duration,
            activeTime: Math.floor(activeTime / 1000),
            maxScroll,
            scrollPoints: Array.from(scrollPoints),
            interactionCount,
            mouseMovements,
            isActive
        })], { type: 'application/json' });
        
        navigator.sendBeacon('/track-engagement', data);
    });

    // Add SEO tracking
    try {
        await fetch('/track-seo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(seoData)
        });
    } catch (error) {
        console.error('Error tracking SEO data:', error);
    }
}

// Helper functions
function getBrowserInfo(userAgent) {
    const browsers = {
        chrome: /Chrome/.test(userAgent),
        firefox: /Firefox/.test(userAgent),
        safari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
        edge: /Edg/.test(userAgent),
        opera: /Opera|OPR/.test(userAgent),
        ie: /MSIE|Trident/.test(userAgent)
    };
    
    return Object.keys(browsers).find(browser => browsers[browser]) || 'unknown';
}

function getOSInfo(userAgent) {
    const os = {
        windows: /Windows/.test(userAgent),
        mac: /Mac/.test(userAgent),
        linux: /Linux/.test(userAgent),
        android: /Android/.test(userAgent),
        ios: /iPhone|iPad|iPod/.test(userAgent)
    };
    
    return Object.keys(os).find(platform => os[platform]) || 'unknown';
}

// SEO helper functions
function getMetaDescription() {
    const meta = document.querySelector('meta[name="description"]');
    return meta ? meta.getAttribute('content') : null;
}

function getMetaKeywords() {
    const meta = document.querySelector('meta[name="keywords"]');
    return meta ? meta.getAttribute('content') : null;
}

function getH1Tags() {
    return Array.from(document.getElementsByTagName('h1'))
        .map(h1 => h1.textContent.trim());
}

function getH2Tags() {
    return Array.from(document.getElementsByTagName('h2'))
        .map(h2 => h2.textContent.trim());
}

function getImageData() {
    return Array.from(document.getElementsByTagName('img')).map(img => ({
        src: img.src,
        alt: img.alt,
        title: img.title,
        width: img.width,
        height: img.height
    }));
}

function getSearchEngine() {
    const referrer = document.referrer.toLowerCase();
    if (referrer.includes('google')) return 'Google';
    if (referrer.includes('bing')) return 'Bing';
    if (referrer.includes('yahoo')) return 'Yahoo';
    if (referrer.includes('duckduckgo')) return 'DuckDuckGo';
    return null;
}

function getSearchQuery() {
    const referrer = document.referrer;
    if (!referrer) return null;

    try {
        const url = new URL(referrer);
        const searchParams = new URLSearchParams(url.search);
        
        // Check for common search query parameters
        const queryParams = ['q', 'query', 'search', 'p', 'wd'];
        for (const param of queryParams) {
            const query = searchParams.get(param);
            if (query) return decodeURIComponent(query);
        }
    } catch (e) {
        console.error('Error parsing referrer URL:', e);
    }
    
    return null;
}

function getCanonicalUrl() {
    const canonical = document.querySelector('link[rel="canonical"]');
    return canonical ? canonical.getAttribute('href') : null;
}

function getRobotsMeta() {
    const robots = document.querySelector('meta[name="robots"]');
    return robots ? robots.getAttribute('content') : null;
}

function getStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    return Array.from(scripts).map(script => {
        try {
            return JSON.parse(script.textContent);
        } catch (e) {
            return null;
        }
    }).filter(data => data !== null);
}

function collectSEOData() {
    const seoData = {
        // Basic SEO data
        title: document.title,
        metaDescription: getMetaDescription(),
        metaKeywords: getMetaKeywords(),
        h1Tags: getH1Tags(),
        h2Tags: getH2Tags(),
        images: getImageData(),
        searchEngine: getSearchEngine(),
        searchQuery: getSearchQuery(),
        canonicalUrl: getCanonicalUrl(),
        robotsMeta: getRobotsMeta(),
        structuredData: getStructuredData(),
        
        // Content performance metrics
        contentPerformance: {
            timeOnPage: 0,
            bounceRate: 0,
            scrollDepth: 0,
            contentEngagement: {
                clicks: 0,
                hovers: 0,
                interactions: 0
            },
            internalLinks: getInternalLinks(),
            contentUpdates: getContentUpdates()
        },
        
        // Technical SEO metrics
        technicalSEO: {
            coreWebVitals: getCoreWebVitals(),
            mobileResponsiveness: getMobileResponsiveness(),
            siteSpeed: getSiteSpeedMetrics(),
            crawlability: getCrawlabilityMetrics()
        }
    };
    
    return seoData;
}

// Content performance tracking
function getInternalLinks() {
    const links = Array.from(document.getElementsByTagName('a'));
    return links
        .filter(link => link.href.startsWith(window.location.origin))
        .map(link => ({
            url: link.href,
            text: link.textContent.trim(),
            isFollow: link.rel !== 'nofollow'
        }));
}

function getContentUpdates() {
    const lastModified = document.lastModified;
    const metaModified = document.querySelector('meta[property="article:modified_time"]')?.content;
    return {
        lastModified,
        metaModified,
        hasUpdates: metaModified && new Date(metaModified) > new Date(lastModified)
    };
}

// Technical SEO monitoring
function getCoreWebVitals() {
    const metrics = {
        lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0,
        fid: performance.getEntriesByType('first-input-delay')[0]?.duration || 0,
        cls: 0 // Requires more complex calculation
    };
    return metrics;
}

function getMobileResponsiveness() {
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    
    const mediaQueries = {
        mobile: window.matchMedia('(max-width: 767px)').matches,
        tablet: window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches,
        desktop: window.matchMedia('(min-width: 1024px)').matches
    };
    
    return {
        viewport,
        mediaQueries,
        isResponsive: Object.values(mediaQueries).some(match => match)
    };
}

function getSiteSpeedMetrics() {
    const timing = performance.timing;
    const metrics = {
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcpConnection: timing.connectEnd - timing.connectStart,
        serverResponse: timing.responseEnd - timing.requestStart,
        domLoad: timing.domComplete - timing.domLoading,
        pageLoad: timing.loadEventEnd - timing.navigationStart
    };
    
    return metrics;
}

function getCrawlabilityMetrics() {
    const robotsTxt = document.querySelector('meta[name="robots"]')?.content;
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    const sitemap = document.querySelector('link[rel="sitemap"]')?.href;
    
    return {
        robotsTxt,
        canonical,
        sitemap,
        isCrawlable: !robotsTxt?.includes('noindex'),
        hasCanonical: !!canonical,
        hasSitemap: !!sitemap
    };
}

// Start tracking when page loads
window.addEventListener('load', trackVisit); 