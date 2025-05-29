const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const session = require('express-session');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Session configuration
app.use(session({
    secret: 'your-secret-key', // Change this to a secure random string
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cupicsart@gmail.com',
        pass: 'your-app-specific-password' // You'll need to generate this from Google Account settings
    }
});

// Data file paths
const DATA_FILE = path.join(__dirname, 'visitor-stats.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

// Create backup directory if it doesn't exist
async function ensureBackupDir() {
    try {
        await fs.access(BACKUP_DIR);
    } catch {
        await fs.mkdir(BACKUP_DIR);
    }
}

// Load visitor data from file
async function loadVisitorData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid, return default structure
        return {
            totalVisits: 0,
            pageVisits: {},
            lastNotification: null,
            dailyStats: {}
        };
    }
}

// Save visitor data to file
async function saveVisitorData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Create backup of visitor data
async function createBackup() {
    try {
        await ensureBackupDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(BACKUP_DIR, `visitor-stats-${timestamp}.json`);
        const data = await loadVisitorData();
        await fs.writeFile(backupFile, JSON.stringify(data, null, 2));
        console.log(`Backup created: ${backupFile}`);
    } catch (error) {
        console.error('Error creating backup:', error);
    }
}

// List available backups
async function listBackups() {
    try {
        await ensureBackupDir();
        const files = await fs.readdir(BACKUP_DIR);
        return files
            .filter(file => file.startsWith('visitor-stats-') && file.endsWith('.json'))
            .map(file => ({
                filename: file,
                timestamp: file.replace('visitor-stats-', '').replace('.json', '')
            }))
            .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    } catch (error) {
        console.error('Error listing backups:', error);
        return [];
    }
}

// Restore from backup
async function restoreFromBackup(filename) {
    try {
        const backupFile = path.join(BACKUP_DIR, filename);
        const data = await fs.readFile(backupFile, 'utf8');
        await saveVisitorData(JSON.parse(data));
        console.log(`Restored from backup: ${filename}`);
        return true;
    } catch (error) {
        console.error('Error restoring backup:', error);
        return false;
    }
}

// Initialize visitor data
let visitorStats = null;

// Rate limiting (one notification per 5 minutes)
const RATE_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Replace these with your actual credentials
    if (username === 'admin' && password === 'your-secure-password') {
        req.session.authenticated = true;
        res.redirect('/dashboard');
    } else {
        res.redirect('/login?error=1');
    }
});

// Logout endpoint
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Visitor tracking endpoint
app.post('/track-visitor', async (req, res) => {
    const { page, userAgent, referrer, timestamp, screenSize, language, timezone, deviceInfo, initialMetrics, seoData } = req.body;
    
    // Ensure visitorStats is loaded
    if (!visitorStats) {
        visitorStats = await loadVisitorData();
    }
    
    // Update statistics
    visitorStats.totalVisits++;
    visitorStats.pageVisits[page] = (visitorStats.pageVisits[page] || 0) + 1;

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    const hour = new Date(timestamp).getHours();
    
    if (!visitorStats.dailyStats[today]) {
        visitorStats.dailyStats[today] = {
            visits: 0,
            pages: {},
            devices: {},
            referrers: {},
            visits: {}, // Hourly visits
            browsers: {},
            os: {},
            seo: {
                searchEngines: {},
                searchQueries: {},
                pageTitles: {},
                metaDescriptions: {},
                h1Tags: {},
                h2Tags: {},
                images: {
                    total: 0,
                    withAlt: 0,
                    withTitle: 0
                },
                structuredData: {
                    total: 0,
                    types: {}
                }
            },
            engagement: {
                scrollDepth: {},
                interactions: {},
                activeTime: {},
                mouseMovements: {}
            }
        };
    }
    
    visitorStats.dailyStats[today].visits++;
    visitorStats.dailyStats[today].pages[page] = (visitorStats.dailyStats[today].pages[page] || 0) + 1;
    
    // Track hourly visits
    visitorStats.dailyStats[today].visits[hour] = (visitorStats.dailyStats[today].visits[hour] || 0) + 1;
    
    // Track device types
    const deviceType = deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop';
    visitorStats.dailyStats[today].devices[deviceType] = (visitorStats.dailyStats[today].devices[deviceType] || 0) + 1;
    
    // Track browsers
    visitorStats.dailyStats[today].browsers[deviceInfo.browser] = (visitorStats.dailyStats[today].browsers[deviceInfo.browser] || 0) + 1;
    
    // Track OS
    visitorStats.dailyStats[today].os[deviceInfo.os] = (visitorStats.dailyStats[today].os[deviceInfo.os] || 0) + 1;
    
    // Track referrers
    const ref = referrer || 'Direct';
    visitorStats.dailyStats[today].referrers[ref] = (visitorStats.dailyStats[today].referrers[ref] || 0) + 1;

    // Track initial engagement metrics
    if (initialMetrics) {
        const { maxScroll, scrollPoints, interactionCount, mouseMovements } = initialMetrics;
        
        // Track scroll depth
        scrollPoints.forEach(point => {
            visitorStats.dailyStats[today].engagement.scrollDepth[point] = 
                (visitorStats.dailyStats[today].engagement.scrollDepth[point] || 0) + 1;
        });
        
        // Track interactions
        visitorStats.dailyStats[today].engagement.interactions[interactionCount] = 
            (visitorStats.dailyStats[today].engagement.interactions[interactionCount] || 0) + 1;
        
        // Track mouse movements
        visitorStats.dailyStats[today].engagement.mouseMovements[mouseMovements] = 
            (visitorStats.dailyStats[today].engagement.mouseMovements[mouseMovements] || 0) + 1;
    }

    // Track SEO metrics
    if (seoData) {
        const seo = visitorStats.dailyStats[today].seo;
        
        // Track search engine
        if (seoData.searchEngine) {
            seo.searchEngines[seoData.searchEngine] = (seo.searchEngines[seoData.searchEngine] || 0) + 1;
        }
        
        // Track search queries
        if (seoData.searchQuery) {
            seo.searchQueries[seoData.searchQuery] = (seo.searchQueries[seoData.searchQuery] || 0) + 1;
        }
        
        // Track page titles
        if (seoData.title) {
            seo.pageTitles[seoData.title] = (seo.pageTitles[seoData.title] || 0) + 1;
        }
        
        // Track meta descriptions
        if (seoData.metaDescription) {
            seo.metaDescriptions[seoData.metaDescription] = (seo.metaDescriptions[seoData.metaDescription] || 0) + 1;
        }
        
        // Track H1 tags
        seoData.h1Tags.forEach(tag => {
            seo.h1Tags[tag] = (seo.h1Tags[tag] || 0) + 1;
        });
        
        // Track H2 tags
        seoData.h2Tags.forEach(tag => {
            seo.h2Tags[tag] = (seo.h2Tags[tag] || 0) + 1;
        });
        
        // Track image data
        seoData.images.forEach(img => {
            seo.images.total++;
            if (img.alt) seo.images.withAlt++;
            if (img.title) seo.images.withTitle++;
        });
        
        // Track structured data
        seoData.structuredData.forEach(data => {
            seo.structuredData.total++;
            const type = data['@type'] || 'unknown';
            seo.structuredData.types[type] = (seo.structuredData.types[type] || 0) + 1;
        });
    }

    // Save updated stats
    await saveVisitorData(visitorStats);

    // Create daily backup
    if (new Date().getHours() === 0) { // Backup at midnight
        await createBackup();
    }

    // Check rate limiting
    const now = Date.now();
    if (!visitorStats.lastNotification || (now - visitorStats.lastNotification) > RATE_LIMIT) {
        // Send email notification
        const mailOptions = {
            from: 'cupicsart@gmail.com',
            to: 'cupicsart@gmail.com',
            subject: 'Website Visitor Notification',
            html: `
                <h2>New Website Visitor</h2>
                <p><strong>Page:</strong> ${page}</p>
                <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
                <p><strong>Device:</strong> ${deviceType}</p>
                <p><strong>Browser:</strong> ${deviceInfo.browser}</p>
                <p><strong>OS:</strong> ${deviceInfo.os}</p>
                <p><strong>Screen Size:</strong> ${screenSize}</p>
                <p><strong>Language:</strong> ${language}</p>
                <p><strong>Timezone:</strong> ${timezone}</p>
                <p><strong>Referrer:</strong> ${ref}</p>
                ${seoData.searchEngine ? `<p><strong>Search Engine:</strong> ${seoData.searchEngine}</p>` : ''}
                ${seoData.searchQuery ? `<p><strong>Search Query:</strong> ${seoData.searchQuery}</p>` : ''}
                <hr>
                <h3>SEO Information</h3>
                <p><strong>Page Title:</strong> ${seoData.title}</p>
                <p><strong>Meta Description:</strong> ${seoData.metaDescription}</p>
                <p><strong>H1 Tags:</strong> ${seoData.h1Tags.join(', ')}</p>
                <p><strong>Images:</strong> ${seoData.images.length} (${seoData.images.filter(img => img.alt).length} with alt text)</p>
                <p><strong>Structured Data:</strong> ${seoData.structuredData.length} items</p>
                <hr>
                <h3>Today's Statistics</h3>
                <p><strong>Total Visits:</strong> ${visitorStats.totalVisits}</p>
                <p><strong>Today's Visits:</strong> ${visitorStats.dailyStats[today].visits}</p>
                <p><strong>Page Visits:</strong></p>
                <ul>
                    ${Object.entries(visitorStats.pageVisits)
                        .map(([page, count]) => `<li>${page}: ${count}</li>`)
                        .join('')}
                </ul>
                <h3>Device Distribution</h3>
                <ul>
                    ${Object.entries(visitorStats.dailyStats[today].devices)
                        .map(([device, count]) => `<li>${device}: ${count}</li>`)
                        .join('')}
                </ul>
                <h3>Browser Distribution</h3>
                <ul>
                    ${Object.entries(visitorStats.dailyStats[today].browsers)
                        .map(([browser, count]) => `<li>${browser}: ${count}</li>`)
                        .join('')}
                </ul>
                <h3>OS Distribution</h3>
                <ul>
                    ${Object.entries(visitorStats.dailyStats[today].os)
                        .map(([os, count]) => `<li>${os}: ${count}</li>`)
                        .join('')}
                </ul>
                <h3>Search Engine Distribution</h3>
                <ul>
                    ${Object.entries(visitorStats.dailyStats[today].seo.searchEngines)
                        .map(([engine, count]) => `<li>${engine}: ${count}</li>`)
                        .join('')}
                </ul>
                <h3>Hourly Distribution</h3>
                <ul>
                    ${Object.entries(visitorStats.dailyStats[today].visits)
                        .map(([hour, count]) => `<li>${hour}:00 - ${count} visits</li>`)
                        .join('')}
                </ul>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            visitorStats.lastNotification = now;
            await saveVisitorData(visitorStats);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    res.json({ success: true });
});

// Track engagement endpoint
app.post('/track-engagement', async (req, res) => {
    const { page, duration, activeTime, maxScroll, scrollPoints, interactionCount, mouseMovements, isActive } = req.body;
    
    if (!visitorStats) {
        visitorStats = await loadVisitorData();
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    if (!visitorStats.dailyStats[today].engagement) {
        visitorStats.dailyStats[today].engagement = {
            scrollDepth: {},
            interactions: {},
            activeTime: {},
            mouseMovements: {},
            durations: {}
        };
    }
    
    // Track duration
    visitorStats.dailyStats[today].engagement.durations[duration] = 
        (visitorStats.dailyStats[today].engagement.durations[duration] || 0) + 1;
    
    // Track active time
    visitorStats.dailyStats[today].engagement.activeTime[activeTime] = 
        (visitorStats.dailyStats[today].engagement.activeTime[activeTime] || 0) + 1;
    
    // Track scroll depth
    scrollPoints.forEach(point => {
        visitorStats.dailyStats[today].engagement.scrollDepth[point] = 
            (visitorStats.dailyStats[today].engagement.scrollDepth[point] || 0) + 1;
    });
    
    // Track interactions
    visitorStats.dailyStats[today].engagement.interactions[interactionCount] = 
        (visitorStats.dailyStats[today].engagement.interactions[interactionCount] || 0) + 1;
    
    // Track mouse movements
    visitorStats.dailyStats[today].engagement.mouseMovements[mouseMovements] = 
        (visitorStats.dailyStats[today].engagement.mouseMovements[mouseMovements] || 0) + 1;
    
    await saveVisitorData(visitorStats);
    res.json({ success: true });
});

// Dashboard endpoint (protected)
app.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Dashboard data endpoint (protected)
app.get('/dashboard-data', requireAuth, async (req, res) => {
    if (!visitorStats) {
        visitorStats = await loadVisitorData();
    }
    res.json(visitorStats);
});

// Backup management endpoints (protected)
app.get('/backups', requireAuth, async (req, res) => {
    const backups = await listBackups();
    res.json(backups);
});

app.post('/backups/create', requireAuth, async (req, res) => {
    await createBackup();
    res.json({ success: true });
});

app.post('/backups/restore/:filename', requireAuth, async (req, res) => {
    const success = await restoreFromBackup(req.params.filename);
    if (success) {
        visitorStats = await loadVisitorData(); // Reload stats after restore
    }
    res.json({ success });
});

app.delete('/backups/:filename', requireAuth, async (req, res) => {
    try {
        const backupFile = path.join(BACKUP_DIR, req.params.filename);
        await fs.unlink(backupFile);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting backup:', error);
        res.status(500).json({ success: false, error: 'Failed to delete backup' });
    }
});

// SEO tracking endpoint
app.post('/track-seo', async (req, res) => {
    const {
        page,
        title,
        metaDescription,
        metaKeywords,
        h1Tags,
        h2Tags,
        images,
        structuredData,
        searchEngine,
        searchQuery,
        canonicalUrl,
        robotsMeta,
        contentPerformance,
        technicalSEO
    } = req.body;

    const today = new Date().toISOString().split('T')[0];
    
    // Initialize SEO data structure if it doesn't exist
    if (!visitorStats.dailyStats[today].seo) {
        visitorStats.dailyStats[today].seo = {
            searchEngines: {},
            searchQueries: {},
            pageTitles: {},
            metaDescriptions: {},
            h1Tags: {},
            h2Tags: {},
            images: {
                total: 0,
                withAlt: 0,
                withTitle: 0
            },
            structuredData: {
                total: 0,
                types: {}
            },
            contentPerformance: {
                timeOnPage: [],
                bounceRate: 0,
                scrollDepth: {},
                contentEngagement: {
                    clicks: 0,
                    hovers: 0,
                    interactions: 0
                },
                internalLinks: {
                    total: 0,
                    follow: 0,
                    nofollow: 0
                },
                contentUpdates: {
                    total: 0,
                    lastWeek: 0,
                    lastMonth: 0
                }
            },
            technicalSEO: {
                coreWebVitals: {
                    lcp: [],
                    fid: [],
                    cls: []
                },
                mobileResponsiveness: {
                    mobile: 0,
                    tablet: 0,
                    desktop: 0
                },
                siteSpeed: {
                    dnsLookup: [],
                    tcpConnection: [],
                    serverResponse: [],
                    domLoad: [],
                    pageLoad: []
                },
                crawlability: {
                    isCrawlable: 0,
                    hasCanonical: 0,
                    hasSitemap: 0
                }
            }
        };
    }

    // Track existing SEO metrics
    if (searchEngine) {
        visitorStats.dailyStats[today].seo.searchEngines[searchEngine] = 
            (visitorStats.dailyStats[today].seo.searchEngines[searchEngine] || 0) + 1;
    }
    if (searchQuery) {
        visitorStats.dailyStats[today].seo.searchQueries[searchQuery] = 
            (visitorStats.dailyStats[today].seo.searchQueries[searchQuery] || 0) + 1;
    }

    if (title) {
        visitorStats.dailyStats[today].seo.pageTitles[title] = 
            (visitorStats.dailyStats[today].seo.pageTitles[title] || 0) + 1;
    }
    if (metaDescription) {
        visitorStats.dailyStats[today].seo.metaDescriptions[metaDescription] = 
            (visitorStats.dailyStats[today].seo.metaDescriptions[metaDescription] || 0) + 1;
    }

    if (h1Tags && h1Tags.length > 0) {
        h1Tags.forEach(tag => {
            visitorStats.dailyStats[today].seo.h1Tags[tag] = 
                (visitorStats.dailyStats[today].seo.h1Tags[tag] || 0) + 1;
        });
    }
    if (h2Tags && h2Tags.length > 0) {
        h2Tags.forEach(tag => {
            visitorStats.dailyStats[today].seo.h2Tags[tag] = 
                (visitorStats.dailyStats[today].seo.h2Tags[tag] || 0) + 1;
        });
    }

    if (images && images.length > 0) {
        visitorStats.dailyStats[today].seo.images.total += images.length;
        images.forEach(img => {
            if (img.alt) visitorStats.dailyStats[today].seo.images.withAlt++;
            if (img.title) visitorStats.dailyStats[today].seo.images.withTitle++;
        });
    }

    if (structuredData && structuredData.length > 0) {
        visitorStats.dailyStats[today].seo.structuredData.total += structuredData.length;
        structuredData.forEach(data => {
            const type = data['@type'];
            if (type) {
                visitorStats.dailyStats[today].seo.structuredData.types[type] = 
                    (visitorStats.dailyStats[today].seo.structuredData.types[type] || 0) + 1;
            }
        });
    }

    // Track content performance metrics
    if (contentPerformance) {
        const seo = visitorStats.dailyStats[today].seo.contentPerformance;
        
        // Track time on page
        seo.timeOnPage.push(contentPerformance.timeOnPage);
        
        // Track bounce rate
        seo.bounceRate = contentPerformance.bounceRate;
        
        // Track scroll depth
        if (contentPerformance.scrollDepth) {
            seo.scrollDepth[contentPerformance.scrollDepth] = 
                (seo.scrollDepth[contentPerformance.scrollDepth] || 0) + 1;
        }
        
        // Track content engagement
        seo.contentEngagement.clicks += contentPerformance.contentEngagement.clicks;
        seo.contentEngagement.hovers += contentPerformance.contentEngagement.hovers;
        seo.contentEngagement.interactions += contentPerformance.contentEngagement.interactions;
        
        // Track internal links
        if (contentPerformance.internalLinks) {
            seo.internalLinks.total += contentPerformance.internalLinks.length;
            seo.internalLinks.follow += contentPerformance.internalLinks.filter(link => link.isFollow).length;
            seo.internalLinks.nofollow += contentPerformance.internalLinks.filter(link => !link.isFollow).length;
        }
        
        // Track content updates
        if (contentPerformance.contentUpdates) {
            seo.contentUpdates.total++;
            const updateDate = new Date(contentPerformance.contentUpdates.lastModified);
            const now = new Date();
            const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
            
            if (updateDate > weekAgo) seo.contentUpdates.lastWeek++;
            if (updateDate > monthAgo) seo.contentUpdates.lastMonth++;
        }
    }

    // Track technical SEO metrics
    if (technicalSEO) {
        const seo = visitorStats.dailyStats[today].seo.technicalSEO;
        
        // Track Core Web Vitals
        if (technicalSEO.coreWebVitals) {
            seo.coreWebVitals.lcp.push(technicalSEO.coreWebVitals.lcp);
            seo.coreWebVitals.fid.push(technicalSEO.coreWebVitals.fid);
            seo.coreWebVitals.cls.push(technicalSEO.coreWebVitals.cls);
        }
        
        // Track mobile responsiveness
        if (technicalSEO.mobileResponsiveness) {
            const { mediaQueries } = technicalSEO.mobileResponsiveness;
            if (mediaQueries.mobile) seo.mobileResponsiveness.mobile++;
            if (mediaQueries.tablet) seo.mobileResponsiveness.tablet++;
            if (mediaQueries.desktop) seo.mobileResponsiveness.desktop++;
        }
        
        // Track site speed
        if (technicalSEO.siteSpeed) {
            seo.siteSpeed.dnsLookup.push(technicalSEO.siteSpeed.dnsLookup);
            seo.siteSpeed.tcpConnection.push(technicalSEO.siteSpeed.tcpConnection);
            seo.siteSpeed.serverResponse.push(technicalSEO.siteSpeed.serverResponse);
            seo.siteSpeed.domLoad.push(technicalSEO.siteSpeed.domLoad);
            seo.siteSpeed.pageLoad.push(technicalSEO.siteSpeed.pageLoad);
        }
        
        // Track crawlability
        if (technicalSEO.crawlability) {
            if (technicalSEO.crawlability.isCrawlable) seo.crawlability.isCrawlable++;
            if (technicalSEO.crawlability.hasCanonical) seo.crawlability.hasCanonical++;
            if (technicalSEO.crawlability.hasSitemap) seo.crawlability.hasSitemap++;
        }
    }

    await saveVisitorData(visitorStats);
    res.json({ success: true });
});

// SEO analysis endpoint
app.get('/seo-analysis', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const seoData = visitorStats.dailyStats[today]?.seo || {};

    // Calculate keyword performance
    const keywords = Object.entries(seoData.keywords || {})
        .map(([keyword, data]) => ({
            keyword,
            impressions: data.impressions,
            clicks: data.clicks,
            position: data.position,
            ctr: data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0
        }))
        .sort((a, b) => b.impressions - a.impressions);

    // Calculate content quality scores
    const contentQuality = {
        avgLength: seoData.contentQuality?.avgLength || 0,
        readabilityScore: seoData.contentQuality?.readabilityScore || 0,
        keywordDensity: seoData.contentQuality?.keywordDensity || 0,
        internalLinks: seoData.contentQuality?.internalLinks || 0,
        externalLinks: seoData.contentQuality?.externalLinks || 0,
        lastUpdated: seoData.contentQuality?.lastUpdated
    };

    // Calculate technical SEO scores
    const technical = {
        pageLoadSpeed: seoData.technical?.pageLoadSpeed || 0,
        mobileFriendly: seoData.technical?.mobileFriendly || false,
        sslStatus: seoData.technical?.sslStatus || false,
        metaTags: seoData.technical?.metaTags || 0,
        structuredData: seoData.technical?.structuredData || 0
    };

    // Calculate image optimization scores
    const images = seoData.images || {};
    const imageOptimization = {
        total: images.total || 0,
        withAlt: images.withAlt || 0,
        withTitle: images.withTitle || 0,
        altPercentage: images.total > 0 ? (images.withAlt / images.total) * 100 : 0,
        titlePercentage: images.total > 0 ? (images.withTitle / images.total) * 100 : 0
    };

    res.json({
        keywords,
        contentQuality,
        technical,
        imageOptimization,
        searchEngines: seoData.searchEngines || {},
        searchQueries: seoData.searchQueries || {},
        structuredData: seoData.structuredData || {}
    });
});

// Initialize server
async function startServer() {
    await ensureBackupDir();
    visitorStats = await loadVisitorData();
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer(); 