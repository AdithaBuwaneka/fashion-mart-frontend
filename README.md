# 🛍️ Fashion Mart Frontend

## Smart Fashion Management System - Frontend Application

A comprehensive, role-based e-commerce platform built with Next.js 15, React 19, and modern web technologies. This application provides a complete fashion retail solution with multi-role support, real-time updates, and advanced analytics.

## 🌟 Features Overview

### 🏗️ **Architecture & Technology Stack**
- **Framework**: Next.js 15.3.4 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Clerk with JWT tokens
- **State Management**: TanStack Query + React Context
- **Charts**: Recharts + Chart.js
- **Payments**: Stripe integration
- **Real-time**: Socket.io for live updates
- **File Upload**: React Dropzone with validation

### 👥 **Multi-Role Support (5 User Types)**

#### 🔑 **Admin Dashboard**
- **Analytics**: Real-time business intelligence and KPIs
- **User Management**: Complete CRUD operations for all users
- **Payment Management**: Full payment oversight and refund processing
- **AI Bill Processing**: Google Vision API for automated bill scanning
- **Reports**: Automated monthly report generation
- **System Health**: Monitoring and performance metrics

#### 🛒 **Customer Portal**
- **Product Discovery**: Advanced search with filters and sorting
- **Shopping Cart**: Persistent cart with real-time updates
- **Checkout**: Seamless Stripe payment integration
- **Order Tracking**: Real-time order status updates
- **Profile Management**: Complete account and address management
- **Returns**: Streamlined return request system

#### 🎨 **Designer Workspace**
- **Design Portfolio**: Complete design management system
- **Upload Studio**: Multi-file design uploads with preview
- **Approval Workflow**: Structured review and approval process
- **Analytics**: Design performance and sales metrics
- **Collaboration**: Team collaboration and communication tools

#### 👔 **Staff Operations**
- **Order Processing**: Efficient order fulfillment dashboard
- **Customer Support**: Integrated support ticket system
- **Quality Control**: Quality assurance and inspection tools
- **Performance Metrics**: Staff performance tracking and analytics

#### 📦 **Inventory Management**
- **Stock Control**: Real-time inventory management
- **Design Approval**: Product approval and review system
- **Alert System**: Automated low stock alerts
- **Purchase Orders**: Procurement and supplier management
- **Analytics**: Comprehensive inventory reports

## 🚀 **Advanced Features**

### 📊 **Analytics & Reporting**
- Real-time dashboard statistics
- Revenue and sales trend analysis
- Order analytics with export capabilities (CSV, PDF, Excel)
- Customer behavior insights
- Product performance metrics
- Inventory forecasting

### 💳 **Payment Management**
- Complete payment overview dashboard
- Stripe payment processing
- Refund management system
- Payment analytics and statistics
- Date range filtering and reporting
- Transaction monitoring

### 🤖 **AI-Powered Features**
- **Bill Processing**: Google Cloud Vision API integration
- Automated data extraction from bills and receipts
- Invoice parsing and categorization
- OCR text recognition with confidence scoring

### 🔔 **Real-Time Features**
- Live order status updates
- Real-time notifications
- Stock level alerts
- WebSocket integration
- Push notifications for mobile

### 📱 **Responsive Design**
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities
- Touch-optimized interfaces
- Offline functionality support

## 🛠️ **Installation & Setup**

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or yarn package manager
- Git

### 1. Clone the Repository
```bash
git clone [repository-url]
cd fashion-mart-frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Optional: App Configuration
NEXT_PUBLIC_APP_NAME="Fashion Mart"
NEXT_PUBLIC_APP_VERSION="2.0.0"
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 **Project Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes group
│   │   ├── sign-in/             # Clerk sign-in
│   │   └── sign-up/             # Clerk sign-up
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── admin/               # Admin role routes
│   │   │   ├── analytics/       # Business analytics
│   │   │   ├── bill-scanner/    # AI bill processing
│   │   │   ├── payments/        # Payment management
│   │   │   ├── reports/         # Report generation
│   │   │   └── users/           # User management
│   │   ├── customer/            # Customer role routes
│   │   │   ├── cart/            # Shopping cart
│   │   │   ├── checkout/        # Payment checkout
│   │   │   ├── orders/          # Order management
│   │   │   ├── profile/         # Profile management
│   │   │   └── returns/         # Return requests
│   │   ├── designer/            # Designer role routes
│   │   │   ├── analytics/       # Design analytics
│   │   │   ├── designs/         # Design portfolio
│   │   │   ├── upload/          # Design upload
│   │   │   └── collaborations/  # Team collaboration
│   │   ├── inventory/           # Inventory manager routes
│   │   │   ├── designs/         # Design approvals
│   │   │   ├── stock/           # Stock management
│   │   │   ├── alerts/          # Low stock alerts
│   │   │   └── reports/         # Inventory reports
│   │   └── staff/               # Staff role routes
│   │       ├── orders/          # Order processing
│   │       ├── customers/       # Customer support
│   │       ├── quality/         # Quality control
│   │       └── support/         # Support tickets
│   └── api/webhooks/            # API webhook handlers
├── components/                  # React components
│   ├── admin/                   # Admin-specific components
│   │   ├── dashboard-stats.tsx  # Dashboard statistics
│   │   ├── payment-management.tsx # Payment oversight
│   │   ├── order-analytics.tsx  # Order analytics
│   │   └── bill-scanner.tsx     # AI bill processing
│   ├── customer/                # Customer components
│   ├── designer/                # Designer components
│   ├── inventory/               # Inventory components
│   ├── staff/                   # Staff components
│   ├── forms/                   # Form components
│   ├── layout/                  # Layout components
│   ├── shared/                  # Shared components
│   └── ui/                      # shadcn/ui base components
├── lib/                         # Core application logic
│   ├── api/                     # API service layer
│   │   ├── admin.ts             # Admin API services
│   │   ├── auth.ts              # Authentication APIs
│   │   ├── orders.ts            # Order management APIs
│   │   ├── payments.ts          # Payment processing APIs
│   │   ├── products.ts          # Product APIs
│   │   ├── users.ts             # User management APIs
│   │   └── reports.ts           # Reporting APIs
│   ├── context/                 # React contexts
│   │   ├── auth-context.tsx     # Authentication context
│   │   ├── cart-context.tsx     # Shopping cart state
│   │   ├── notification-context.tsx # Notifications
│   │   └── socket-context.tsx   # WebSocket connection
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript definitions
│   ├── utils/                   # Utility functions
│   ├── guards/                  # Route protection
│   └── permissions/             # Role-based permissions
└── styles/                      # CSS and styling
```

## 🔧 **Available Scripts**

```bash
# Development
npm run dev              # Start development server
npm run build            # Create production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run type-check       # TypeScript type checking

# Analysis
npm run analyze          # Bundle size analysis
npm run clean            # Clean build artifacts
```

## 🌐 **API Integration**

### **Backend Endpoints Integration (50+ endpoints)**

#### **Authentication & Session**
- `GET /api/health` - Health check
- `POST /api/auth/sync` - User synchronization
- `GET /api/auth/session` - Session validation
- `GET /api/auth/profile` - User profile
- `PATCH /api/auth/user/{id}/role` - Role management

#### **Product Management**
- `GET /api/products` - Product catalog with filters
- `GET /api/products/featured` - Featured products
- `GET /api/products/{id}` - Product details
- `GET /api/products/{id}/availability` - Stock check
- `GET /api/products/{id}/related` - Related products

#### **Order Processing**
- `POST /api/customer/orders` - Create orders
- `GET /api/customer/orders` - Order history
- `POST /api/orders/{id}/payment-intent` - Payment processing
- `PUT /api/orders/{id}/status` - Status updates
- `GET /api/orders/analytics` - Order analytics
- `GET /api/orders/export` - Data export

#### **Payment Management**
- `GET /api/payments` - Payment overview
- `GET /api/payments/range` - Date range reports
- `POST /api/payments/{id}/refund` - Refund processing

#### **Admin Operations**
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `POST /api/admin/bills/process` - AI bill processing
- `GET /api/admin/reports` - Report management
- `POST /api/admin/reports/monthly` - Report generation

### **Real-Time Features**
- WebSocket connection for live updates
- Order status notifications
- Stock level alerts
- Payment confirmations
- System notifications

## 🎨 **UI/UX Features**

### **Design System**
- **shadcn/ui**: Modern, accessible component library
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching support
- **Animations**: Framer Motion for smooth transitions

### **User Experience**
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: Comprehensive error boundaries
- **Form Validation**: Real-time validation with feedback
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized rendering and caching

## 🔒 **Security Features**

### **Authentication & Authorization**
- Clerk authentication with JWT tokens
- Role-based access control (RBAC)
- Protected routes with middleware
- Session management and refresh
- Secure token storage

### **Data Protection**
- Input sanitization and XSS protection
- CSRF protection
- Secure API communication
- File upload validation
- Content Security Policy (CSP)

## 📊 **Performance Optimizations**

### **Frontend Optimizations**
- Code splitting and lazy loading
- Image optimization and lazy loading
- Query caching with TanStack Query
- Optimistic updates for better UX
- Bundle size optimization

### **Caching Strategy**
- API response caching
- Static asset caching
- Browser caching headers
- Service worker for offline support

## 🧪 **Testing**

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
npm run start
```

### **Environment Variables for Production**
Ensure all required environment variables are set:
- API endpoints
- Authentication keys
- Payment provider keys
- Analytics configuration

### **Deployment Platforms**
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 📈 **Monitoring & Analytics**

### **Performance Monitoring**
- Core Web Vitals tracking
- Error boundary reporting
- API response time monitoring
- User interaction analytics

### **Business Analytics**
- Sales and revenue tracking
- User behavior analysis
- Product performance metrics
- Conversion rate optimization

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Submit a pull request
5. Code review and approval

### **Code Standards**
- TypeScript strict mode
- ESLint and Prettier configuration
- Consistent naming conventions
- Comprehensive documentation
- Test coverage requirements

## 📚 **Documentation**

### **Additional Resources**
- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)

## 🆘 **Support & Troubleshooting**

### **Common Issues**
1. **Build Errors**: Check TypeScript types and imports
2. **Authentication Issues**: Verify Clerk configuration
3. **API Connection**: Check backend server status
4. **Payment Issues**: Validate Stripe configuration

### **Getting Help**
- Check the troubleshooting guide
- Review error logs and browser console
- Verify environment variables
- Test API endpoints independently

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 **Acknowledgments**

- Next.js team for the excellent framework
- Clerk for authentication services
- Stripe for payment processing
- shadcn/ui for the component library
- Vercel for hosting and deployment

---

**Fashion Mart Frontend v2.0** - A complete, production-ready e-commerce platform with comprehensive role-based functionality, real-time updates, and advanced analytics capabilities.

Built with ❤️ using modern web technologies and best practices.