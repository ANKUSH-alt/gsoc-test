#!/usr/bin/env python3
"""
Flipkart Backend API Server
Flask-based REST API for product management, cart, and search functionality
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# In-memory data storage (in production, use a database)
products_db = []
cart_db = {}
users_db = []

# Initialize with sample products
def init_sample_products():
    """Initialize with sample products"""
    global products_db
    products_db = [
        {
            "id": 1,
            "title": "Apple iPhone 15 Pro Max (256 GB) - Natural Titanium",
            "image": "https://via.placeholder.com/250x250/ffffff/2874f0?text=iPhone+15",
            "price": 134900,
            "originalPrice": 149900,
            "rating": 4.5,
            "ratingCount": 12450,
            "category": "Mobiles",
            "description": "Latest iPhone with A17 Pro chip and titanium design",
            "inStock": True,
            "stockCount": 50
        },
        {
            "id": 2,
            "title": "Samsung Galaxy S24 Ultra (512 GB) - Titanium Black",
            "image": "https://via.placeholder.com/250x250/ffffff/2874f0?text=Galaxy+S24",
            "price": 124999,
            "originalPrice": 139999,
            "rating": 4.6,
            "ratingCount": 8920,
            "category": "Mobiles",
            "description": "Premium Android flagship with S Pen",
            "inStock": True,
            "stockCount": 30
        },
        {
            "id": 3,
            "title": "Sony WH-1000XM5 Wireless Headphones with Noise Cancellation",
            "image": "https://via.placeholder.com/250x250/ffffff/2874f0?text=Sony+Headphones",
            "price": 27990,
            "originalPrice": 34990,
            "rating": 4.7,
            "ratingCount": 15630,
            "category": "Electronics",
            "description": "Premium noise-cancelling wireless headphones",
            "inStock": True,
            "stockCount": 100
        },
        {
            "id": 4,
            "title": "MacBook Pro 16-inch M3 Pro (1TB SSD, 36GB RAM)",
            "image": "https://via.placeholder.com/250x250/ffffff/2874f0?text=MacBook+Pro",
            "price": 289900,
            "originalPrice": 319900,
            "rating": 4.8,
            "ratingCount": 5230,
            "category": "Electronics",
            "description": "Powerful laptop for professionals and creators",
            "inStock": True,
            "stockCount": 25
        },
        {
            "id": 5,
            "title": "Samsung 55-inch QLED 4K Smart TV (QA55Q80C)",
            "image": "https://via.placeholder.com/250x250/ffffff/2874f0?text=Samsung+TV",
            "price": 89990,
            "originalPrice": 119990,
            "rating": 4.4,
            "ratingCount": 7820,
            "category": "Appliances",
            "description": "Premium QLED TV with 4K resolution",
            "inStock": True,
            "stockCount": 40
        },
        {
            "id": 6,
            "title": "Dell XPS 15 Laptop (Intel i7, 16GB RAM, 512GB SSD)",
            "image": "https://via.placeholder.com/250x250/ffffff/2874f0?text=Dell+XPS",
            "price": 149990,
            "originalPrice": 179990,
            "rating": 4.5,
            "ratingCount": 3450,
            "category": "Electronics",
            "description": "High-performance laptop for business and creative work",
            "inStock": True,
            "stockCount": 35
        },
        {
            "id": 7,
            "title": "AirPods Pro (2nd Generation) with MagSafe Case",
            "image": "https://via.placeholder.com/250x250/ffffff/2874f0?text=AirPods+Pro",
            "price": 24900,
            "originalPrice": 29900,
            "rating": 4.6,
            "ratingCount": 18200,
            "category": "Electronics",
            "description": "Premium wireless earbuds with active noise cancellation",
            "inStock": True,
            "stockCount": 150
        },
        {
            "id": 8,
            "title": "Canon EOS R5 Mirrorless Camera (45MP, 4K Video)",
            "image": "https://via.placeholder.com/250x250/ffffff/2874f0?text=Canon+EOS",
            "price": 389990,
            "originalPrice": 449990,
            "rating": 4.7,
            "ratingCount": 1250,
            "category": "Electronics",
            "description": "Professional mirrorless camera for photography and videography",
            "inStock": True,
            "stockCount": 15
        }
    ]


# Initialize data
init_sample_products()

# ==================== PRODUCTS ENDPOINTS ====================

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    category = request.args.get('category')
    min_price = request.args.get('min_price', type=int)
    max_price = request.args.get('max_price', type=int)
    search = request.args.get('search', '').lower()
    
    filtered_products = products_db.copy()
    
    # Filter by category
    if category:
        filtered_products = [p for p in filtered_products if p.get('category', '').lower() == category.lower()]
    
    # Filter by price range
    if min_price is not None:
        filtered_products = [p for p in filtered_products if p['price'] >= min_price]
    if max_price is not None:
        filtered_products = [p for p in filtered_products if p['price'] <= max_price]
    
    # Search by title
    if search:
        filtered_products = [p for p in filtered_products if search in p['title'].lower()]
    
    return jsonify({
        "success": True,
        "count": len(filtered_products),
        "products": filtered_products
    })


@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID"""
    product = next((p for p in products_db if p['id'] == product_id), None)
    
    if not product:
        return jsonify({
            "success": False,
            "message": "Product not found"
        }), 404
    
    return jsonify({
        "success": True,
        "product": product
    })


@app.route('/api/products', methods=['POST'])
def create_product():
    """Create a new product (Admin only in production)"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'price', 'originalPrice', 'category']
    if not all(field in data for field in required_fields):
        return jsonify({
            "success": False,
            "message": "Missing required fields"
        }), 400
    
    # Generate new ID
    new_id = max([p['id'] for p in products_db], default=0) + 1
    
    new_product = {
        "id": new_id,
        "title": data['title'],
        "image": data.get('image', 'https://via.placeholder.com/250x250'),
        "price": data['price'],
        "originalPrice": data['originalPrice'],
        "rating": data.get('rating', 0.0),
        "ratingCount": data.get('ratingCount', 0),
        "category": data['category'],
        "description": data.get('description', ''),
        "inStock": data.get('inStock', True),
        "stockCount": data.get('stockCount', 0)
    }
    
    products_db.append(new_product)
    
    return jsonify({
        "success": True,
        "message": "Product created successfully",
        "product": new_product
    }), 201


@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product (Admin only in production)"""
    product = next((p for p in products_db if p['id'] == product_id), None)
    
    if not product:
        return jsonify({
            "success": False,
            "message": "Product not found"
        }), 404
    
    data = request.get_json()
    
    # Update fields
    for key, value in data.items():
        if key != 'id':  # Don't allow ID changes
            product[key] = value
    
    return jsonify({
        "success": True,
        "message": "Product updated successfully",
        "product": product
    })


@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product (Admin only in production)"""
    global products_db
    product = next((p for p in products_db if p['id'] == product_id), None)
    
    if not product:
        return jsonify({
            "success": False,
            "message": "Product not found"
        }), 404
    
    products_db = [p for p in products_db if p['id'] != product_id]
    
    return jsonify({
        "success": True,
        "message": "Product deleted successfully"
    })


# ==================== CART ENDPOINTS ====================

@app.route('/api/cart', methods=['GET'])
def get_cart():
    """Get cart for a user (using session_id or user_id)"""
    user_id = request.args.get('user_id', 'default')
    
    if user_id not in cart_db:
        cart_db[user_id] = []
    
    cart_items = cart_db[user_id]
    
    # Enrich cart items with full product data
    enriched_cart = []
    total = 0
    
    for item in cart_items:
        product = next((p for p in products_db if p['id'] == item['productId']), None)
        if product:
            enriched_item = {
                **item,
                "product": product
            }
            enriched_cart.append(enriched_item)
            total += product['price'] * item['quantity']
    
    return jsonify({
        "success": True,
        "cart": enriched_cart,
        "total": total,
        "count": len(enriched_cart)
    })


@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    """Add item to cart"""
    data = request.get_json()
    user_id = data.get('user_id', 'default')
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not product_id:
        return jsonify({
            "success": False,
            "message": "product_id is required"
        }), 400
    
    # Check if product exists
    product = next((p for p in products_db if p['id'] == product_id), None)
    if not product:
        return jsonify({
            "success": False,
            "message": "Product not found"
        }), 404
    
    # Initialize cart if doesn't exist
    if user_id not in cart_db:
        cart_db[user_id] = []
    
    # Check if item already in cart
    existing_item = next((item for item in cart_db[user_id] if item['productId'] == product_id), None)
    
    if existing_item:
        existing_item['quantity'] += quantity
    else:
        cart_db[user_id].append({
            "productId": product_id,
            "quantity": quantity,
            "addedAt": datetime.now().isoformat()
        })
    
    return jsonify({
        "success": True,
        "message": "Item added to cart",
        "cart": cart_db[user_id]
    })


@app.route('/api/cart/<int:product_id>', methods=['DELETE'])
def remove_from_cart(product_id):
    """Remove item from cart"""
    user_id = request.args.get('user_id', 'default')
    
    if user_id not in cart_db:
        return jsonify({
            "success": False,
            "message": "Cart not found"
        }), 404
    
    cart_db[user_id] = [item for item in cart_db[user_id] if item['productId'] != product_id]
    
    return jsonify({
        "success": True,
        "message": "Item removed from cart",
        "cart": cart_db[user_id]
    })


@app.route('/api/cart', methods=['DELETE'])
def clear_cart():
    """Clear entire cart"""
    user_id = request.args.get('user_id', 'default')
    
    if user_id in cart_db:
        cart_db[user_id] = []
    
    return jsonify({
        "success": True,
        "message": "Cart cleared"
    })


@app.route('/api/cart/update', methods=['PUT'])
def update_cart_item():
    """Update cart item quantity"""
    data = request.get_json()
    user_id = data.get('user_id', 'default')
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    
    if not product_id or quantity is None:
        return jsonify({
            "success": False,
            "message": "product_id and quantity are required"
        }), 400
    
    if user_id not in cart_db:
        return jsonify({
            "success": False,
            "message": "Cart not found"
        }), 404
    
    item = next((item for item in cart_db[user_id] if item['productId'] == product_id), None)
    
    if not item:
        return jsonify({
            "success": False,
            "message": "Item not found in cart"
        }), 404
    
    if quantity <= 0:
        cart_db[user_id] = [i for i in cart_db[user_id] if i['productId'] != product_id]
    else:
        item['quantity'] = quantity
    
    return jsonify({
        "success": True,
        "message": "Cart updated",
        "cart": cart_db[user_id]
    })


# ==================== SEARCH ENDPOINTS ====================

@app.route('/api/search', methods=['GET'])
def search_products():
    """Search products by keyword"""
    query = request.args.get('q', '').lower()
    
    if not query:
        return jsonify({
            "success": False,
            "message": "Search query is required"
        }), 400
    
    results = []
    for product in products_db:
        if (query in product['title'].lower() or 
            query in product.get('description', '').lower() or
            query in product.get('category', '').lower()):
            results.append(product)
    
    return jsonify({
        "success": True,
        "query": query,
        "count": len(results),
        "results": results
    })


# ==================== CATEGORIES ENDPOINT ====================

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    categories = list(set([p.get('category', 'Other') for p in products_db]))
    
    return jsonify({
        "success": True,
        "categories": sorted(categories)
    })


# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "success": True,
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "products_count": len(products_db),
        "active_carts": len(cart_db)
    })


# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "Endpoint not found"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "message": "Internal server error"
    }), 500


if __name__ == '__main__':
    print("🚀 Starting Flipkart Backend API Server...")
    print("📦 Products loaded:", len(products_db))
    print("🌐 Server running on http://localhost:5000")
    print("📚 API Documentation:")
    print("   - GET    /api/products")
    print("   - GET    /api/products/<id>")
    print("   - POST   /api/products")
    print("   - GET    /api/cart?user_id=<id>")
    print("   - POST   /api/cart")
    print("   - DELETE /api/cart/<product_id>")
    print("   - GET    /api/search?q=<query>")
    print("   - GET    /api/categories")
    print("   - GET    /api/health")
    
    app.run(debug=True, host='0.0.0.0', port=5000)

