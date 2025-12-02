import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    Wallet, User, LogOut, Home, TrendingUp, PieChart,
    Download, MessageCircle, PiggyBank, BarChart3, Shield, Users
} from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const [role, setRole] = React.useState<string | null>(null);
    const location = useLocation(); // 1. Get current route location

    const brandLink = isAuthenticated ? '/dashboard' : '/';

    React.useEffect(() => {
        if (!isAuthenticated) {
            setRole(null);
            return;
        }
        // fetch profile to obtain role
        import('../services/api').then(mod => {
            const token = localStorage.getItem('token') || '';
            mod.getProfile(token).then(res => setRole(res.data?.role)).catch(() => setRole(null));
        });
    }, [isAuthenticated]);

    // 2. Helper to generate class names based on active state
    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        return `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${isActive
                ? 'bg-blue-50 text-blue-600' // Active State
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' // Inactive State
            }`;
    };

    // Special helper for Owner link to maintain yellow theme
    const getOwnerLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        return `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${isActive
                ? 'bg-yellow-50 text-yellow-600'
                : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
            }`;
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="w-full px-0">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to={brandLink} className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            <Wallet className="text-blue-600" size={32} />
                            Budget Tracker
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            (role === 'ADMIN' || role === 'OWNER') ? (
                                <>
                                    {role === 'OWNER' && (
                                        <>
                                            <Link to="/admin/admins" className={getOwnerLinkClass('/admin/admins')}>
                                                <Shield size={20} />
                                                <span className="font-medium">Manage Admins</span>
                                            </Link>
                                            <Link to="/admin/users" className={getOwnerLinkClass('/admin/users')}>
                                                <Users size={20} />
                                                <span className="font-medium">Manage Users</span>
                                            </Link>
                                        </>
                                    )}
                                    {role === 'ADMIN' && (
                                        <Link to="/admin/users" className={getLinkClass('/admin/users')}>
                                            <Users size={20} />
                                            <span className="font-medium">Manage Users</span>
                                        </Link>
                                    )}
                                    <Link to="/forum" className={getLinkClass('/forum')}>
                                        <MessageCircle size={20} />
                                        <span className="font-medium">Forum</span>
                                    </Link>
                                    <Link to="/export" className={getLinkClass('/export')}>
                                        <Download size={20} />
                                        <span className="font-medium">Export</span>
                                    </Link>
                                    <Link to="/profile" className={getLinkClass('/profile')}>
                                        <User size={20} />
                                        <span className="font-medium">Profile</span>
                                    </Link>
                                    <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium">
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                                        <Home size={20} />
                                        <span className="font-medium">Dashboard</span>
                                    </Link>
                                    <Link to="/transactions" className={getLinkClass('/transactions')}>
                                        <TrendingUp size={20} />
                                        <span className="font-medium">Transactions</span>
                                    </Link>
                                    {/* --- NEW ANALYTICS LINK --- */}
                                    <Link to="/analytics" className={getLinkClass('/analytics')}>
                                        <BarChart3 size={20} />
                                        <span className="font-medium">Analytics</span>
                                    </Link>
                                    <Link to="/budget" className={getLinkClass('/budget')}>
                                        <PieChart size={20} />
                                        <span className="font-medium">Budget</span>
                                    </Link>
                                    <Link to="/savings" className={getLinkClass('/savings')}>
                                        <PiggyBank size={20} />
                                        <span className="font-medium">Savings</span>
                                    </Link>
                                    <Link to="/export" className={getLinkClass('/export')}>
                                        <Download size={20} />
                                        <span className="font-medium">Export</span>
                                    </Link>
                                    <Link to="/forum" className={getLinkClass('/forum')}>
                                        <MessageCircle size={20} />
                                        <span className="font-medium">Forum</span>
                                    </Link>
                                    <Link to="/profile" className={getLinkClass('/profile')}>
                                        <User size={20} />
                                        <span className="font-medium">Profile</span>
                                    </Link>
                                    <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium">
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </>
                            )
                        ) : (
                            <>
                                <Link to="/login" className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;