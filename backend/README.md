# E-commerce Backend API

A robust Node.js/Express.js backend API for an e-commerce platform with user authentication, product management, order processing, and admin functionality.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Product Management**: CRUD operations for products with image upload
- **Category Management**: Organize products by categories
- **Order Processing**: Complete order lifecycle management
- **Admin Panel**: Administrative functions for managing users, products, and orders
- **File Upload**: Multer-based image upload for products and categories
- **Data Validation**: Joi schema validation for request data
- **MongoDB Integration**: Mongoose ODM for database operations

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Validation**: Joi
- **CORS**: Cross-origin resource sharing enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MERN_task/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection configuration
├── controllers/
│   ├── adminController.js  # Admin operations
│   ├── authController.js   # Authentication operations
│   ├── categoryController.js # Category management
│   ├── orderController.js  # Order processing
│   ├── productController.js # Product management
│   └── userController.js   # User operations
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   └── validation.js      # Request validation middleware
├── models/
│   ├── Category.js        # Category data model
│   ├── Order.js          # Order data model
│   ├── Product.js        # Product data model
│   └── User.js           # User data model
├── routes/
│   ├── admin.js          # Admin routes
│   ├── auth.js           # Authentication routes
│   └── user.js           # User routes
├── services/
│   ├── authService.js    # Authentication business logic
│   ├── productService.js # Product business logic
│   └── userService.js    # User business logic
├── public/
│   └── uploads/          # Uploaded images storage
├── server.js             # Main server file
└── package.json          # Dependencies and scripts
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)

### Admin Routes (`/api/admin`)
- `GET /users` - Get all users (admin only)
- `GET /products` - Get all products (admin only)
- `POST /products` - Create new product (admin only)
- `PUT /products/:id` - Update product (admin only)
- `DELETE /products/:id` - Delete product (admin only)
- `GET /orders` - Get all orders (admin only)
- `GET /categories` - Get all categories (admin only)
- `POST /categories` - Create new category (admin only)

### User Routes (`/api/users`)
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /categories` - Get all categories
- `POST /orders` - Create new order
- `GET /orders` - Get user orders

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📤 File Upload

The API supports image uploads for products and categories using Multer. Uploaded files are stored in the `public/uploads/` directory and are accessible via `/uploads/filename` endpoint.

## 🗄️ Database Models

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (default: 'user', enum: ['user', 'admin'])
- `createdAt`: Date

### Product Model
- `name`: String (required)
- `description`: String
- `price`: Number (required)
- `category`: ObjectId (ref: Category)
- `image`: String (file path)
- `stock`: Number (default: 0)
- `createdAt`: Date

### Category Model
- `name`: String (required)
- `image`: String (file path)
- `createdAt`: Date

### Order Model
- `user`: ObjectId (ref: User)
- `products`: Array of product objects
- `totalAmount`: Number
- `status`: String (enum: ['pending', 'processing', 'shipped', 'delivered'])
- `createdAt`: Date

## 🚀 Deployment

1. **Set up environment variables** for production
2. **Configure MongoDB** connection string
3. **Set up file storage** for uploads (consider using cloud storage)
4. **Configure CORS** for your frontend domain
5. **Deploy to your preferred platform** (Heroku, AWS, DigitalOcean, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team. 