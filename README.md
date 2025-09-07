# Mangalaya - Full-Stack Task Manager

A beautiful, modern task management application built with Next.js 15, featuring real-time updates, glassmorphic design, and comprehensive analytics.

## ✨ Features

### 🔐 Authentication
- **JWT-based authentication** with httpOnly cookies
- **Secure password hashing** using bcrypt
- **Protected routes** with middleware
- **User registration and login** with form validation

### 📋 Task Management
- **Full CRUD operations** for tasks
- **Task status tracking** (To Do, In Progress, Done)
- **Due date management** with overdue detection
- **Rich task descriptions** and metadata
- **User-specific task isolation**

### ⚡ Real-time Updates
- **Socket.IO integration** for live notifications
- **Real-time task updates** across all connected clients
- **Animated toast notifications** for all actions
- **Instant status changes** and task modifications

### 🎨 Beautiful UI/UX
- **Glassmorphic design** with backdrop blur effects
- **Framer Motion animations** for smooth interactions
- **Responsive design** for all device sizes
- **Gradient backgrounds** and modern aesthetics
- **Custom scrollbars** and hover effects

### 📊 Analytics & Charts
- **Task status distribution** (pie chart)
- **Task creation trends** (bar chart)
- **Completion rate tracking** (line chart)
- **Real-time statistics** and insights
- **Interactive charts** with Recharts

### 🛠️ Technical Features
- **Redux Toolkit** for state management
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Next.js 15** with App Router
- **TailwindCSS** for styling
- **Lucide React** for icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mangalaya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mangalaya
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key
   ```

4. **Start the development server**
```bash
npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── tasks/         # Task CRUD endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Charts/            # Analytics components
│   ├── Layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── models/                # MongoDB models
├── store/                 # Redux store and slices
└── types/                 # TypeScript type definitions
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## 🎯 Key Components

### Task Management
- **TaskItem**: Individual task card with status controls
- **TaskForm**: Modal form for creating/editing tasks
- **TaskAnalytics**: Charts and statistics dashboard

### UI Components
- **Button**: Animated button with multiple variants
- **Input/Textarea**: Form inputs with validation
- **Modal**: Glassmorphic modal with animations
- **Toast**: Real-time notification system

### Layout
- **Navbar**: Top navigation with user info
- **Sidebar**: Task filters and navigation
- **ReduxProvider**: State management provider
- **SocketProvider**: Real-time connection provider

## 🔒 Security Features

- **JWT tokens** stored in httpOnly cookies
- **Password hashing** with bcrypt
- **Input validation** on both client and server
- **Protected routes** with middleware
- **User isolation** for all data operations

## 📱 Responsive Design

- **Mobile-first** approach
- **Tablet optimization** for medium screens
- **Desktop enhancement** for large screens
- **Touch-friendly** interactions
- **Adaptive layouts** for all components

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables for production
3. Update JWT secrets and database URLs

### Build and Deploy
```bash
npm run build
npm start
```

### Recommended Platforms
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Framer Motion** for smooth animations
- **TailwindCSS** for utility-first styling
- **Recharts** for beautiful charts
- **Socket.IO** for real-time functionality

---

Built with ❤️ using Next.js 15, TypeScript, and modern web technologies.