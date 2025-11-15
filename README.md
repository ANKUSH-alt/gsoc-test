# Flipkart Clone - Full Stack E-commerce Application

A complete e-commerce application with Flipkart-style frontend and Flask backend API.

## Features

### Frontend
- 🎨 Modern Flipkart-inspired UI design
- 📱 Fully responsive layout
- 🔍 Product search functionality
- 🛒 Shopping cart management
- ⭐ Product ratings and reviews
- 💰 Price display with discounts
- 🎯 Category-based browsing

### Backend API
- 🔌 RESTful API endpoints
- 📦 Product management (CRUD operations)
- 🛒 Cart management (Add, Remove, Update)
- 🔍 Product search
- 📊 Categories listing
- 💾 In-memory data storage (can be easily replaced with database)

## Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

### Backend
- Python 3
- Flask (Web framework)
- Flask-CORS (Cross-origin resource sharing)

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Backend Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Run the Flask server:**
```bash
python app.py
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. **Open `index.html` in a web browser**, or

2. **Use a local HTTP server:**
```bash
# Python 3
python3 -m http.server 8000

# Or Node.js (if installed)
npx http-server -p 8000
```

3. **Open in browser:**
```
http://localhost:8000/index.html
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
  - Query params: `category`, `min_price`, `max_price`, `search`
- `GET /api/products/<id>` - Get single product
- `POST /api/products` - Create product (requires JSON body)
- `PUT /api/products/<id>` - Update product
- `DELETE /api/products/<id>` - Delete product

### Cart

- `GET /api/cart?user_id=<id>` - Get user's cart
- `POST /api/cart` - Add item to cart
  - Body: `{"user_id": "default", "product_id": 1, "quantity": 1}`
- `DELETE /api/cart/<product_id>?user_id=<id>` - Remove item from cart
- `DELETE /api/cart?user_id=<id>` - Clear entire cart
- `PUT /api/cart/update` - Update cart item quantity

### Search

- `GET /api/search?q=<query>` - Search products

### Categories

- `GET /api/categories` - Get all categories

### Health Check

- `GET /api/health` - Server health status

## Usage

### Starting the Application

1. **Start the backend server:**
```bash
python app.py
```

2. **Open the frontend:**
   - Open `index.html` in your browser, or
   - Use a local server on port 8000

3. **Make sure CORS is enabled** (already configured in `app.py`)

### Testing the API

You can test the API using curl:

```bash
# Get all products
curl http://localhost:5000/api/products

# Search products
curl "http://localhost:5000/api/search?q=iPhone"

# Add to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"user_id": "default", "product_id": 1, "quantity": 1}'

# Get cart
curl "http://localhost:5000/api/cart?user_id=default"
```

## Project Structure

```
gsoc-test/
├── index.html          # Frontend HTML
├── style.css           # Frontend CSS styling
├── script.js           # Frontend JavaScript (API integration)
├── app.py              # Flask backend server
├── requirements.txt    # Python dependencies
└── README.md           # This file
```

## Future Enhancements

- [ ] Database integration (PostgreSQL/MySQL)
- [ ] User authentication and authorization
- [ ] Product image upload
- [ ] Order management
- [ ] Payment gateway integration
- [ ] Admin panel
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Recommendation engine
- [ ] Email notifications

## License

This project is for educational purposes.

## Author

Created as part of GSoC test project.

