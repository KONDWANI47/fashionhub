// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navContainer = document.querySelector('.nav-container');
const cartCountElement = document.querySelector('.cart-count');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navContainer.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navContainer.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navContainer.classList.remove('active');
            }
        }
    });
});

// Newsletter Form Submission
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    // Here you would typically send this to your backend
    alert(`Thank you for subscribing with ${email}!`);
    this.reset();
});

// Navbar Background Change on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Add animation to category cards on scroll
const categoryCards = document.querySelectorAll('.category-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

categoryCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
}); 
// Add animation to product cards on scroll
const productCards = document.querySelectorAll('.product-card');
const productObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {


        }
    });
}, {
    threshold: 0.1
});

// handle product card animation
productCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    productObserver.observe(card);
});
// handle about section animation
const aboutSection = document.querySelector('.about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {


        }
    });
}, {
    threshold: 0.1
});

// Product Categories
const productCategories = {
    casual: [
        {
            id: 'casual-1',
            name: 'Summer Breeze Dress',
            price: 49.99,
            image: 'casual-dress-1.jpg',
            description: 'Light and flowy summer dress perfect for casual outings',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['Blue', 'White', 'Pink'],
            category: 'Dresses',
            season: 'Summer',
            rating: 4.5
        },
        {
            id: 'casual-2',
            name: 'Denim Jacket',
            price: 69.99,
            image: 'denim-jacket.jpg',
            description: 'Classic denim jacket with modern styling',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Blue', 'Black'],
            category: 'Outerwear',
            season: 'All Seasons',
            rating: 4.8
        },
        {
            id: 'casual-3',
            name: 'Cotton T-Shirt',
            price: 24.99,
            image: 'tshirt.jpg',
            description: 'Comfortable cotton t-shirt for everyday wear',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['White', 'Black', 'Gray', 'Navy'],
            category: 'Tops',
            season: 'All Seasons',
            rating: 4.3
        },
        {
            id: 'casual-4',
            name: 'Oversized Sweater',
            price: 59.99,
            image: 'sweater.jpg',
            description: 'Cozy oversized sweater perfect for casual days',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Beige', 'Gray', 'Black'],
            category: 'Sweaters',
            season: 'Winter',
            rating: 4.6
        },
        {
            id: 'casual-5',
            name: 'High-Waisted Jeans',
            price: 79.99,
            image: 'jeans.jpg',
            description: 'Classic high-waisted jeans with perfect fit',
            sizes: ['26', '28', '30', '32'],
            colors: ['Blue', 'Black', 'White'],
            category: 'Bottoms',
            season: 'All Seasons',
            rating: 4.7
        }
    ],
    footwear: [
        {
            id: 'footwear-1',
            name: 'Leather Sneakers',
            price: 89.99,
            image: 'sneakers.jpg',
            description: 'Premium leather sneakers with cushioned insoles',
            sizes: ['7', '8', '9', '10', '11'],
            colors: ['White', 'Black', 'Brown'],
            category: 'Sneakers',
            season: 'All Seasons',
            rating: 4.7
        },
        {
            id: 'footwear-2',
            name: 'Summer Sandals',
            price: 39.99,
            image: 'sandals.jpg',
            description: 'Comfortable summer sandals with adjustable straps',
            sizes: ['6', '7', '8', '9'],
            colors: ['Brown', 'Black', 'White'],
            category: 'Sandals',
            season: 'Summer',
            rating: 4.4
        },
        {
            id: 'footwear-3',
            name: 'Formal Loafers',
            price: 79.99,
            image: 'loafers.jpg',
            description: 'Classic leather loafers for formal occasions',
            sizes: ['8', '9', '10', '11'],
            colors: ['Black', 'Brown'],
            category: 'Formal',
            season: 'All Seasons',
            rating: 4.6
        },
        {
            id: 'footwear-4',
            name: 'Ankle Boots',
            price: 99.99,
            image: 'boots.jpg',
            description: 'Stylish ankle boots with block heel',
            sizes: ['6', '7', '8', '9', '10'],
            colors: ['Black', 'Brown', 'Tan'],
            category: 'Boots',
            season: 'Fall',
            rating: 4.8
        },
        {
            id: 'footwear-5',
            name: 'Running Shoes',
            price: 89.99,
            image: 'running-shoes.jpg',
            description: 'Lightweight running shoes with cushioned soles',
            sizes: ['7', '8', '9', '10', '11'],
            colors: ['White', 'Black', 'Blue'],
            category: 'Athletic',
            season: 'All Seasons',
            rating: 4.9
        }
    ],
    formal: [
        {
            id: 'formal-1',
            name: 'Business Suit',
            price: 199.99,
            image: 'suit.jpg',
            description: 'Professional business suit with modern cut',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Navy', 'Black', 'Gray'],
            category: 'Suits',
            season: 'All Seasons',
            rating: 4.9
        },
        {
            id: 'formal-2',
            name: 'Silk Blouse',
            price: 59.99,
            image: 'blouse.jpg',
            description: 'Elegant silk blouse for formal occasions',
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['White', 'Black', 'Cream'],
            category: 'Tops',
            season: 'All Seasons',
            rating: 4.7
        },
        {
            id: 'formal-3',
            name: 'Pencil Skirt',
            price: 49.99,
            image: 'skirt.jpg',
            description: 'Classic pencil skirt for professional wear',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['Black', 'Navy', 'Gray'],
            category: 'Skirts',
            season: 'All Seasons',
            rating: 4.5
        },
        {
            id: 'formal-4',
            name: 'Tailored Blazer',
            price: 149.99,
            image: 'blazer.jpg',
            description: 'Classic tailored blazer for professional look',
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Navy', 'Black', 'Gray'],
            category: 'Outerwear',
            season: 'All Seasons',
            rating: 4.8
        },
        {
            id: 'formal-5',
            name: 'Silk Dress',
            price: 129.99,
            image: 'silk-dress.jpg',
            description: 'Elegant silk dress for special occasions',
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Black', 'Red', 'Navy'],
            category: 'Dresses',
            season: 'All Seasons',
            rating: 4.9
        }
    ],
    accessories: [
        {
            id: 'accessory-1',
            name: 'Leather Belt',
            price: 29.99,
            image: 'belt.jpg',
            description: 'Genuine leather belt with classic buckle',
            sizes: ['S', 'M', 'L'],
            colors: ['Black', 'Brown'],
            category: 'Belts',
            season: 'All Seasons',
            rating: 4.4
        },
        {
            id: 'accessory-2',
            name: 'Silk Scarf',
            price: 34.99,
            image: 'scarf.jpg',
            description: 'Luxurious silk scarf with elegant pattern',
            colors: ['Red', 'Blue', 'Green'],
            category: 'Scarves',
            season: 'All Seasons',
            rating: 4.6
        },
        {
            id: 'accessory-3',
            name: 'Leather Wallet',
            price: 44.99,
            image: 'wallet.jpg',
            description: 'Premium leather wallet with multiple card slots',
            colors: ['Black', 'Brown'],
            category: 'Wallets',
            season: 'All Seasons',
            rating: 4.8
        },
        {
            id: 'accessory-4',
            name: 'Designer Handbag',
            price: 199.99,
            image: 'handbag.jpg',
            description: 'Luxurious designer handbag with gold hardware',
            colors: ['Black', 'Brown', 'Beige'],
            category: 'Bags',
            season: 'All Seasons',
            rating: 4.9
        },
        {
            id: 'accessory-5',
            name: 'Statement Necklace',
            price: 49.99,
            image: 'necklace.jpg',
            description: 'Bold statement necklace for special occasions',
            colors: ['Gold', 'Silver'],
            category: 'Jewelry',
            season: 'All Seasons',
            rating: 4.7
        }
    ],
    activewear: [
        {
            id: 'active-1',
            name: 'Yoga Leggings',
            price: 69.99,
            image: 'yoga-leggings.jpg',
            description: 'High-waisted yoga leggings with four-way stretch',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['Black', 'Gray', 'Purple'],
            category: 'Bottoms',
            season: 'All Seasons',
            rating: 4.8
        },
        {
            id: 'active-2',
            name: 'Sports Bra',
            price: 39.99,
            image: 'sports-bra.jpg',
            description: 'High-impact sports bra with moisture-wicking fabric',
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Black', 'White', 'Pink'],
            category: 'Tops',
            season: 'All Seasons',
            rating: 4.7
        }
    ],
    swimwear: [
        {
            id: 'swim-1',
            name: 'One-Piece Swimsuit',
            price: 49.99,
            image: 'swimsuit.jpg',
            description: 'Classic one-piece swimsuit with tummy control',
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Black', 'Blue', 'Red'],
            category: 'Swimwear',
            season: 'Summer',
            rating: 4.6
        },
        {
            id: 'swim-2',
            name: 'Bikini Set',
            price: 59.99,
            image: 'bikini.jpg',
            description: 'Stylish bikini set with adjustable straps',
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Black', 'Pink', 'Blue'],
            category: 'Swimwear',
            season: 'Summer',
            rating: 4.7
        }
    ]
};

// Enhanced filter options
const filterOptions = {
    priceRange: [
        { label: 'Under $25', min: 0, max: 25 },
        { label: '$25 - $50', min: 25, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $200', min: 100, max: 200 },
        { label: 'Over $200', min: 200, max: Infinity }
    ],
    categories: ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Suits', 'Skirts', 'Sweaters', 'Sneakers', 'Sandals', 'Boots', 'Formal', 'Belts', 'Scarves', 'Wallets', 'Bags', 'Jewelry', 'Swimwear'],
    seasons: ['All Seasons', 'Summer', 'Winter', 'Spring', 'Fall'],
    ratings: [4, 4.5, 4.8],
    colors: ['All', 'Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Brown', 'Gray', 'Beige', 'Navy', 'Tan']
};

// Function to create filter section
function createFilterSection() {
    const filterSection = document.createElement('div');
    filterSection.className = 'filter-section';
    
    // Price Range Filter
    const priceFilter = document.createElement('div');
    priceFilter.className = 'filter-group';
    priceFilter.innerHTML = `
        <h3>Price Range</h3>
        <div class="price-filters">
            ${filterOptions.priceRange.map(range => `
                <label class="price-filter">
                    <input type="radio" name="price" value="${range.min}-${range.max}">
                    ${range.label}
                </label>
            `).join('')}
        </div>
    `;
    
    // Category Filter
    const categoryFilter = document.createElement('div');
    categoryFilter.className = 'filter-group';
    categoryFilter.innerHTML = `
        <h3>Categories</h3>
        <div class="category-filters">
            ${filterOptions.categories.map(category => `
                <label class="category-filter">
                    <input type="checkbox" name="category" value="${category}">
                    ${category}
                </label>
            `).join('')}
        </div>
    `;
    
    // Season Filter
    const seasonFilter = document.createElement('div');
    seasonFilter.className = 'filter-group';
    seasonFilter.innerHTML = `
        <h3>Season</h3>
        <div class="season-filters">
            ${filterOptions.seasons.map(season => `
                <label class="season-filter">
                    <input type="checkbox" name="season" value="${season}">
                    ${season}
                </label>
            `).join('')}
        </div>
    `;
    
    // Rating Filter
    const ratingFilter = document.createElement('div');
    ratingFilter.className = 'filter-group';
    ratingFilter.innerHTML = `
        <h3>Rating</h3>
        <div class="rating-filters">
            ${filterOptions.ratings.map(rating => `
                <label class="rating-filter">
                    <input type="checkbox" name="rating" value="${rating}">
                    ${rating}+ Stars
                </label>
            `).join('')}
        </div>
    `;
    
    // Sort Options
    const sortOptions = document.createElement('div');
    sortOptions.className = 'sort-options';
    sortOptions.innerHTML = `
        <h3>Sort By</h3>
        <select id="sort-select">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="newest">Newest</option>
        </select>
    `;
    
    filterSection.appendChild(priceFilter);
    filterSection.appendChild(categoryFilter);
    filterSection.appendChild(seasonFilter);
    filterSection.appendChild(ratingFilter);
    filterSection.appendChild(sortOptions);
    
    return filterSection;
}

// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showNotification('Added to wishlist!', 'success');
    } else {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist!', 'info');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        btn.classList.toggle('active', wishlist.includes(productId));
    });
}

// Recently viewed items
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

function addToRecentlyViewed(productId) {
    const index = recentlyViewed.indexOf(productId);
    if (index !== -1) {
        recentlyViewed.splice(index, 1);
    }
    recentlyViewed.unshift(productId);
    if (recentlyViewed.length > 5) {
        recentlyViewed.pop();
    }
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    updateRecentlyViewedUI();
}

function updateRecentlyViewedUI() {
    const container = document.querySelector('.recently-viewed');
    if (!container) return;
    
    container.innerHTML = `
        <h3>Recently Viewed</h3>
        <div class="recently-viewed-grid">
            ${recentlyViewed.map(id => {
                const product = findProductById(id);
                if (!product) return '';
                return createProductCard(product, true);
            }).join('')}
        </div>
    `;
}

function findProductById(id) {
    for (const category in productCategories) {
        const product = productCategories[category].find(p => p.id === id);
        if (product) return product;
    }
    return null;
}

// Enhanced product card creation
function createProductCard(product, isCompact = false) {
    const card = document.createElement('div');
    card.className = `product-card ${isCompact ? 'compact' : ''}`;
    
    const isWishlisted = wishlist.includes(product.id);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-overlay">
                <div class="quick-actions">
                    <button class="quick-view-btn" onclick="showProductDetails('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" 
                            onclick="toggleWishlist('${product.id}')" 
                            data-product-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            ${product.rating ? `
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}</span>
                    <span class="rating-value">${product.rating}</span>
                </div>
            ` : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-colors">
                ${product.colors.map(color => `
                    <span class="color-dot" style="background-color: ${color.toLowerCase()}"></span>
                `).join('')}
            </div>
            ${!isCompact ? `
                <div class="product-sizes">
                    ${product.sizes ? product.sizes.map(size => `
                        <span class="size-option">${size}</span>
                    `).join('') : ''}
                </div>
                <button class="order-btn" onclick="showOrderPreview('${product.id}')">
                    Order Now
                </button>
            ` : ''}
        </div>
    `;
    
    // Add to recently viewed when card is created
    addToRecentlyViewed(product.id);
    
    return card;
}

// Function to load products with filters
function loadProducts(category, filters = {}) {
    const productsGrid = document.getElementById(`${category}-products`);
    if (!productsGrid) return;
    
    // Clear existing products
    productsGrid.innerHTML = '';
    
    // Get products for the category
    let products = productCategories[category] || [];
    
    // Apply filters
    if (filters.price) {
        const [min, max] = filters.price.split('-').map(Number);
        products = products.filter(p => p.price >= min && p.price <= max);
    }
    
    if (filters.categories && filters.categories.length) {
        products = products.filter(p => filters.categories.includes(p.category));
    }
    
    if (filters.seasons && filters.seasons.length) {
        products = products.filter(p => filters.seasons.includes(p.season));
    }
    
    if (filters.ratings && filters.ratings.length) {
        const minRating = Math.min(...filters.ratings);
        products = products.filter(p => p.rating >= minRating);
    }
    
    // Apply sorting
    if (filters.sort) {
        switch (filters.sort) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                products.sort((a, b) => b.id.localeCompare(a.id));
                break;
        }
    }
    
    // Create and append product cards
    products.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
}

// Initialize shop pages
function initializeShopPage() {
    const category = window.location.pathname.split('/').pop().replace('.html', '');
    const mainContent = document.querySelector('.category-page');
    
    // Add filter section
    const filterSection = createFilterSection();
    mainContent.insertBefore(filterSection, mainContent.firstChild);
    
    // Load initial products
    loadProducts(category);
    
    // Add event listeners for filters
    const filterInputs = document.querySelectorAll('.filter-section input, .filter-section select');
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            const filters = {
                price: document.querySelector('input[name="price"]:checked')?.value,
                categories: Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value),
                seasons: Array.from(document.querySelectorAll('input[name="season"]:checked')).map(cb => cb.value),
                ratings: Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(cb => Number(cb.value)),
                sort: document.getElementById('sort-select').value
            };
            loadProducts(category, filters);
        });
    });
}

// Call initialize function when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('casual-wear.html') ||
        window.location.pathname.includes('footwear.html') ||
        window.location.pathname.includes('formal-wear.html')) {
        initializeShopPage();
    }
});

// Shopping Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update the Shop Now button click handler
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const category = this.closest('.category-card').querySelector('h3').textContent;
        const categoryMap = {
            'Casual Wear': 'casual-wear.html',
            'Footwear': 'footwear.html',
            'Formal Wear': 'formal-wear.html'
        };
        window.location.href = categoryMap[category];
    });
});

function updateCartCount() {
    cartCountElement.textContent = cart.length;
}

function addToCart(product) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Item added to cart!');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Item removed from cart!');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load products on category pages
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    let category = '';
    
    if (currentPage === 'casual-wear.html') {
        category = 'casual';
    } else if (currentPage === 'footwear.html') {
        category = 'footwear';
    } else if (currentPage === 'formal-wear.html') {
        category = 'formal';
    }
    
    if (category) {
        const productsContainer = document.querySelector('.products-grid');
        const products = getProductsForCategory(category);
        productsContainer.innerHTML = products;
        
        // Add quantity control functionality
        document.querySelectorAll('.quantity-controls').forEach(control => {
            const input = control.querySelector('.quantity-input');
            const minusBtn = control.querySelector('.minus');
            const plusBtn = control.querySelector('.plus');
            
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                }
            });
            
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue < 10) {
                    input.value = currentValue + 1;
                }
            });
            
            input.addEventListener('change', () => {
                const value = parseInt(input.value);
                if (value < 1) input.value = 1;
                if (value > 10) input.value = 10;
            });
        });
        
        // Add event listeners to Order Now buttons
        document.querySelectorAll('.order-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-item');
                const size = productCard.querySelector('.size-selector select').value;
                const color = productCard.querySelector('.color-selector select').value;
                const quantity = productCard.querySelector('.quantity-input').value;
                
                // Validate selections
                if (!size || !color) {
                    showNotification('Please select both size and color', 'error');
                    return;
                }
                
                const product = {
                    name: productCard.querySelector('h3').textContent,
                    price: productCard.querySelector('.price').textContent,
                    image: productCard.querySelector('img').src,
                    size: size,
                    color: color,
                    quantity: quantity
                };
                
                // Show preview modal
                showOrderPreview(product);
            });
        });
    }
    
    // Initialize cart count
    updateCartCount();
});

function showOrderPreview(product) {
    const modal = document.createElement('div');
    modal.className = 'order-preview-modal';
    
    const totalPrice = parseFloat(product.price.replace('$', '')) * parseInt(product.quantity);
    
    modal.innerHTML = `
        <div class="order-preview-content">
            <span class="close-modal">&times;</span>
            <h2>Order Preview</h2>
            <div class="preview-details">
                <div class="preview-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="preview-info">
                    <h3>${product.name}</h3>
                    <p class="preview-price">Price: ${product.price}</p>
                    <p>Size: ${product.size}</p>
                    <p>Color: ${product.color}</p>
                    <p>Quantity: ${product.quantity}</p>
                    <p class="preview-total">Total: $${totalPrice.toFixed(2)}</p>
                </div>
            </div>
            <div class="preview-message">
                <h4>Your message to the seller:</h4>
                <div class="message-preview">
                    Hi, I'm interested in ordering:

                    Product: ${product.name}
                    Price: ${product.price}
                    Size: ${product.size}
                    Color: ${product.color}
                    Quantity: ${product.quantity}
                    Total: $${totalPrice.toFixed(2)}

                    Thank you!
                </div>
            </div>
            <div class="preview-actions">
                <button class="edit-btn">Edit Order</button>
                <button class="send-btn">Send via WhatsApp</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking close button or outside modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Edit button functionality
    modal.querySelector('.edit-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    // Send button functionality
    modal.querySelector('.send-btn').addEventListener('click', () => {
        const message = `Hi, I'm interested in ordering:\n\n` +
            `Product: ${product.name}\n` +
            `Price: ${product.price}\n` +
            `Size: ${product.size}\n` +
            `Color: ${product.color}\n` +
            `Quantity: ${product.quantity}\n` +
            `Total: $${totalPrice.toFixed(2)}\n\n` +
            `Thank you!`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/26592260985?text=${encodedMessage}`, '_blank');
        modal.remove();
    });
}

// Cart icon click handler
document.querySelector('.cart-link').addEventListener('click', function(e) {
    e.preventDefault();
    showCartModal();
});

function showCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-modal-content">
            <span class="close-modal">&times;</span>
            <h2>Your Cart</h2>
            <div class="cart-items">
                ${cart.map((item, index) => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p>${item.price}</p>
                        </div>
                        <button class="remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-total">
                <h3>Total: $${calculateTotal()}</h3>
            </div>
            <button class="checkout-btn">Proceed to Checkout</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking close button or outside modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Remove item functionality
    modal.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeFromCart(index);
            modal.remove();
            showCartModal();
        });
    });
    
    // Checkout button functionality
    modal.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Here you would typically redirect to a checkout page
        alert('Proceeding to checkout...');
    });
}

function calculateTotal() {
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return total + price;
    }, 0).toFixed(2);
}
//