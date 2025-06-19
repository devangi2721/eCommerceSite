# E-commerce Frontend

A modern, responsive e-commerce frontend built with Next.js, React, and Redux Toolkit. Features a beautiful UI with user authentication, product browsing, shopping cart functionality, and admin panel.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **User Authentication**: Login/Register with JWT token management
- **Product Catalog**: Browse products by categories with search functionality
- **Shopping Cart**: Add/remove items with persistent cart state
- **User Profile**: Manage personal information and view order history
- **Admin Panel**: Complete admin interface for managing products, categories, users, and orders
- **Image Upload**: Support for product and category image uploads
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Redux Toolkit for global state management
- **Protected Routes**: Role-based access control for admin features

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit
- **Authentication**: JWT tokens with context API
- **HTTP Client**: Built-in fetch API
- **Build Tool**: Turbopack (Next.js built-in)
- **Linting**: ESLint with Next.js configuration

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MERN_task/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── banner1.jpg
│   ├── bannerImage.jpg
│   └── ...
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── admin/         # Admin panel pages
│   │   │   ├── categories/
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── profile/
│   │   │   └── users/
│   │   ├── cart/          # Shopping cart page
│   │   ├── login/         # Login page
│   │   ├── products/      # Product listing page
│   │   ├── profile/       # User profile page
│   │   ├── register/      # Registration page
│   │   ├── constants/     # Application constants
│   │   ├── globals.css    # Global styles
│   │   ├── layout.js      # Root layout
│   │   ├── page.js        # Home page
│   │   └── providers.js   # Context providers
│   ├── components/        # Reusable components
│   │   ├── Header.js      # Navigation header
│   │   ├── LoginForm.js   # Login form component
│   │   ├── Providers.js   # Provider wrapper
│   │   └── TokenSyncProvider.js # Token synchronization
│   ├── context/           # React Context
│   │   └── AuthContext.js # Authentication context
│   └── redux/             # Redux store and slices
│       ├── slices/
│       │   ├── authSlice.js
│       │   └── cartSlice.js
│       └── store.js
├── package.json           # Dependencies and scripts
└── next.config.mjs        # Next.js configuration
```

## 🎯 Key Features Explained

### Authentication System
- JWT token-based authentication
- Automatic token refresh
- Protected routes for admin access
- Persistent login state

### Shopping Cart
- Add/remove products
- Quantity management
- Persistent cart state using Redux
- Real-time total calculation

### Admin Panel
- **Dashboard**: Overview of sales, users, and products
- **Products**: CRUD operations for product management
- **Categories**: Manage product categories
- **Orders**: View and manage customer orders
- **Users**: User management and role assignment
- **Profile**: Admin profile management

### User Features
- **Product Browsing**: View products by category
- **Product Details**: Detailed product information
- **Shopping Cart**: Add items and manage quantities
- **Order History**: View past orders
- **Profile Management**: Update personal information

## 🎨 UI Components

### Header Component
- Navigation menu
- User authentication status
- Shopping cart icon with item count
- Admin panel access for authorized users

### Product Cards
- Product image display
- Product information (name, price, description)
- Add to cart functionality
- Category labels

### Admin Forms
- Product creation/editing forms
- Category management forms
- User management interface
- Order status updates

## 🔐 Authentication Flow

1. **Login/Register**: Users authenticate through forms
2. **Token Storage**: JWT tokens stored in localStorage
3. **Auto-refresh**: Tokens automatically refreshed before expiry
4. **Protected Routes**: Admin routes require valid admin token
5. **Logout**: Clear tokens and redirect to home

## 🛒 Shopping Cart Implementation

- **Redux State**: Cart items stored in Redux store
- **Persistence**: Cart state persists across sessions
- **Real-time Updates**: Cart updates immediately on add/remove
- **Quantity Management**: Users can adjust item quantities

## 📱 Responsive Design

- **Mobile-first**: Designed for mobile devices first
- **Tailwind CSS**: Utility-first CSS framework
- **Breakpoints**: Responsive design for all screen sizes
- **Touch-friendly**: Optimized for touch interactions

## 🚀 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🔧 Configuration

### Next.js Configuration
The project uses Next.js 15 with Turbopack for faster development builds.

### Tailwind CSS
Tailwind CSS 4 is configured for styling with custom utilities and responsive design.

### Redux Store
Redux Toolkit is used for state management with slices for authentication and cart functionality.

## 🌐 API Integration

The frontend communicates with the backend API through:
- **Base URL**: Configurable via environment variables
- **Authentication**: JWT tokens in request headers
- **Error Handling**: Centralized error handling for API responses
- **Loading States**: Loading indicators for better UX

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables** for production
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
   ```

3. **Deploy to your preferred platform**:
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify
   - Custom server

## 🧪 Testing

The project includes ESLint configuration for code quality:
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

## 🔗 Related Links

- [Backend API Documentation](../backend/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
