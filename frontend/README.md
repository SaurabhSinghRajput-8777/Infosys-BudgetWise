# AI Budget Tracker - Frontend

A modern, responsive web application for tracking personal finances, built with React, TypeScript, and TailwindCSS.

## Features

### Authentication
- **Secure Login/Signup**: JWT-based authentication
- **Role-based Access**: User, Admin, and Owner dashboards
- **Show/Hide Password**: Toggle visibility for password fields

### Dashboard
- **Financial Overview**: Real-time summary of income, expenses, and savings
- **Visual Statistics**: Clear display of financial health
- **Recent Activity**: Quick view of latest transactions

### Transaction Management
- **Add/Edit/Delete**: Full control over income and expense records
- **Categorization**: Organize transactions by type (Food, Rent, Salary, etc.)
- **Filtering**: Search and filter transaction history

### User Management (Admin/Owner)
- **User List**: View all registered users
- **Ban/Unban**: Manage user access (Owner protected)
- **Role Management**: Admin approval workflow

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Setup & Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd AIBudgetTrackerFrontend
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/      # Reusable UI components (Navbar, Cards, etc.)
├── hooks/           # Custom React hooks (useAuth, etc.)
├── pages/           # Main page components (Login, Dashboard, etc.)
├── services/        # API integration services
├── types/           # TypeScript interface definitions
├── App.tsx          # Main application component
└── main.tsx         # Entry point
```

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
