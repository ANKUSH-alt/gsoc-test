// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const USER_ID = 'default'; // In production, use actual user authentication

// Cart Management (local for quick updates)
let cart = [];
let products = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', async function () {
    await loadProducts();
    await loadCart();
    updateCartCount();

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Cart modal functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');

    cartIcon.addEventListener('click', async function () {
        cartModal.style.display = 'block';
        await loadCart();
        renderCart();
    });

    closeCart.addEventListener('click', function () {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
});

// ==================== API FUNCTIONS ====================

// Load Products from API
async function loadProducts() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (data.success) {
            products = data.products;
            renderProducts();
        } else {
            showError('Failed to load products');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Unable to connect to server. Please make sure the backend is running.');
    } finally {
        hideLoading();
    }
}

// Load Cart from API
async function loadCart() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart?user_id=${USER_ID}`);
        const data = await response.json();

        if (data.success) {
            cart = data.cart || [];
            updateCartCount();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        // Continue with local cart if API fails
    }
}

// Add to Cart via API
async function addToCart(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: USER_ID,
                product_id: productId,
                quantity: 1
            })
        });

        const data = await response.json();

        if (data.success) {
            const product = products.find(p => p.id === productId);
            if (product) {
                showNotification(`${product.title.substring(0, 30)}... added to cart!`);
            }
            await loadCart();
            updateCartCount();
        } else {
            showError(data.message || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Unable to add to cart. Please try again.');
    }
}

// Remove from Cart via API
async function removeFromCart(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/${productId}?user_id=${USER_ID}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Item removed from cart');
            await loadCart();
            renderCart();
            updateCartCount();
        } else {
            showError(data.message || 'Failed to remove from cart');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        showError('Unable to remove from cart. Please try again.');
    }
}

// Search Products via API
async function searchProducts(query) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.success) {
            products = data.results || [];
            renderProducts();
        } else {
            showError(data.message || 'Search failed');
        }
    } catch (error) {
        console.error('Error searching products:', error);
        showError('Unable to search products. Please try again.');
    } finally {
        hideLoading();
    }
}

// ==================== UI FUNCTIONS ====================

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #878787;">No products found.</p>';
        return;
    }

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
        <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='https://via.placeholder.com/250x250'">
        <div class="product-title">${product.title}</div>
        <div class="product-rating">
            <span class="rating-stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
            <span class="rating-count">(${product.ratingCount || 0})</span>
        </div>
        <div class="product-price">
            <span class="current-price">₹${product.price.toLocaleString('en-IN')}</span>
            <span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
            <span class="discount">${discount}% off</span>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
    `;

    return card;
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
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
        const product = item.product || item;
        const quantity = item.quantity || 1;
        const itemTotal = product.price * quantity;
        total += itemTotal;

        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80x80'">
            <div class="cart-item-details">
                <div class="cart-item-title">${product.title}</div>
                <div class="cart-item-price">₹${product.price.toLocaleString('en-IN')} x ${quantity}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${product.id})">Remove</button>
        `;

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toLocaleString('en-IN');
}

// Search Functionality
async function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        await loadProducts();
        return;
    }

    await searchProducts(searchTerm);
}

// Show Loading State
function showLoading() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #878787;">Loading products...</p>';
}

// Hide Loading State
function hideLoading() {
    // Loading state is cleared by renderProducts
}

// Show Error Message
function showError(message) {
    showNotification(message, 'error');
}

// Show Notification
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    const backgroundColor = type === 'error' ? '#f44336' : '#4caf50';

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${backgroundColor};
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;

    // Add animation if not already added
    if (!document.querySelector('#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
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
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Checkout
document.querySelector('.checkout-btn')?.addEventListener('click', function () {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    showNotification('Checkout functionality coming soon!');
});

// Login Button
document.querySelector('.login-btn')?.addEventListener('click', function () {
    showNotification('Login functionality coming soon!');
});

// Make functions globally accessible
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
