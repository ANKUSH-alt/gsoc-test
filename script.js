// Sample Products Data
const products = [
    {
        id: 1,
        title: "Apple iPhone 15 Pro Max (256 GB) - Natural Titanium",
        image: "https://via.placeholder.com/250x250/ffffff/2874f0?text=iPhone+15",
        price: 134900,
        originalPrice: 149900,
        rating: 4.5,
        ratingCount: 12450
    },
    {
        id: 2,
        title: "Samsung Galaxy S24 Ultra (512 GB) - Titanium Black",
        image: "https://via.placeholder.com/250x250/ffffff/2874f0?text=Galaxy+S24",
        price: 124999,
        originalPrice: 139999,
        rating: 4.6,
        ratingCount: 8920
    },
    {
        id: 3,
        title: "Sony WH-1000XM5 Wireless Headphones with Noise Cancellation",
        image: "https://via.placeholder.com/250x250/ffffff/2874f0?text=Sony+Headphones",
        price: 27990,
        originalPrice: 34990,
        rating: 4.7,
        ratingCount: 15630
    },
    {
        id: 4,
        title: "MacBook Pro 16-inch M3 Pro (1TB SSD, 36GB RAM)",
        image: "https://via.placeholder.com/250x250/ffffff/2874f0?text=MacBook+Pro",
        price: 289900,
        originalPrice: 319900,
        rating: 4.8,
        ratingCount: 5230
    },
    {
        id: 5,
        title: "Samsung 55-inch QLED 4K Smart TV (QA55Q80C)",
        image: "https://via.placeholder.com/250x250/ffffff/2874f0?text=Samsung+TV",
        price: 89990,
        originalPrice: 119990,
        rating: 4.4,
        ratingCount: 7820
    },
    {
        id: 6,
        title: "Dell XPS 15 Laptop (Intel i7, 16GB RAM, 512GB SSD)",
        image: "https://via.placeholder.com/250x250/ffffff/2874f0?text=Dell+XPS",
        price: 149990,
        originalPrice: 179990,
        rating: 4.5,
        ratingCount: 3450
    },
    {
        id: 7,
        title: "AirPods Pro (2nd Generation) with MagSafe Case",
        image: "https://via.placeholder.com/250x250/ffffff/2874f0?text=AirPods+Pro",
        price: 24900,
        originalPrice: 29900,
        rating: 4.6,
        ratingCount: 18200
    },
    {
        id: 8,
        title: "Canon EOS R5 Mirrorless Camera (45MP, 4K Video)",
        image: "https://via.placeholder.com/250x250/ffffff/2874f0?text=Canon+EOS",
        price: 389990,
        originalPrice: 449990,
        rating: 4.7,
        ratingCount: 1250
    }
];

// Cart Management
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartCount();
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Cart modal functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'block';
        renderCart();
    });
    
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
});

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-title">${product.title}</div>
        <div class="product-rating">
            <span class="rating-stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
            <span class="rating-count">(${product.ratingCount})</span>
        </div>
        <div class="product-price">
            <span class="current-price">₹${product.price.toLocaleString('en-IN')}</span>
            <span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
            <span class="discount">${discount}% off</span>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
            Add to Cart
        </button>
    `;
    
    return card;
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        updateCartCount();
        showNotification(`${product.title.substring(0, 30)}... added to cart!`);
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
    showNotification('Item removed from cart');
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Render Cart
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')} x ${item.quantity}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toLocaleString('en-IN');
}

// Search Functionality
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderProducts();
        return;
    }
    
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #878787;">No products found matching your search.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Checkout
document.querySelector('.checkout-btn')?.addEventListener('click', function() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    showNotification('Checkout functionality coming soon!');
});

// Login Button
document.querySelector('.login-btn')?.addEventListener('click', function() {
    showNotification('Login functionality coming soon!');
});

