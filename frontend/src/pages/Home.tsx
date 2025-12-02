import { Link } from 'react-router-dom';
import { 
    Wallet, TrendingUp, PieChart, Shield, Sparkles, 
    ArrowRight, CheckCircle, DollarSign, Target, BarChart3 
} from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Hero Section */}
            <section className="px-4 py-12 md:py-20">
                <div className="w-full">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium">
                                <Sparkles size={20} />
                                <span>Smart Budget Management</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                Take Control of Your
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> Financial Future</span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Track expenses, manage income, and achieve your savings goals with our intelligent budget tracking system. 
                                Start your journey to financial freedom today!
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link 
                                    to="/signup"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Get Started Free
                                    <ArrowRight size={20} />
                                </Link>
                                <Link 
                                    to="/login"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold text-lg transition-all border-2 border-gray-200"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                        
                        {/* Right Content - Dashboard Preview */}
                        <div className="relative">
                            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="bg-white rounded-2xl p-8 transform -rotate-3">
                                    {/* Dashboard Preview */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <Wallet className="text-blue-600" size={32} />
                                                <h3 className="text-2xl font-bold text-gray-900">Dashboard</h3>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                                                <TrendingUp className="text-green-600 mb-2" size={24} />
                                                <p className="text-sm text-gray-600">Income</p>
                                                <p className="text-2xl font-bold text-gray-900">₹50,000</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                                                <DollarSign className="text-purple-600 mb-2" size={24} />
                                                <p className="text-sm text-gray-600">Expenses</p>
                                                <p className="text-2xl font-bold text-gray-900">₹35,000</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                                            <BarChart3 className="text-blue-600 mb-2" size={24} />
                                            <p className="text-sm text-gray-600">Savings</p>
                                            <p className="text-2xl font-bold text-gray-900">₹15,000</p>
                                            <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full w-3/4"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Cards */}
                            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                                <Target className="text-orange-600" size={32} />
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                                <PieChart className="text-pink-600" size={32} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-4 py-12 bg-white">
                <div className="w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Everything You Need to Manage Your Money
                        </h2>
                        <p className="text-xl text-gray-600">
                            Powerful features designed to help you achieve financial success
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl hover:shadow-xl transition-all">
                            <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <DollarSign className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Expenses</h3>
                            <p className="text-gray-600">
                                Record and categorize all your expenses with ease. Know exactly where your money goes.
                            </p>
                        </div>
                        
                        {/* Feature 2 */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-xl transition-all">
                            <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <TrendingUp className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Income Management</h3>
                            <p className="text-gray-600">
                                Track multiple income sources and get a complete picture of your earnings.
                            </p>
                        </div>
                        
                        {/* Feature 3 */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-xl transition-all">
                            <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <Target className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Savings Goals</h3>
                            <p className="text-gray-600">
                                Set financial goals and track your progress towards achieving them.
                            </p>
                        </div>
                        
                        {/* Feature 4 */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl hover:shadow-xl transition-all">
                            <div className="bg-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <PieChart className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Visual Analytics</h3>
                            <p className="text-gray-600">
                                Beautiful dashboard with insights into your spending patterns and trends.
                            </p>
                        </div>
                        
                        {/* Feature 5 */}
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl hover:shadow-xl transition-all">
                            <div className="bg-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <BarChart3 className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Reports</h3>
                            <p className="text-gray-600">
                                Generate detailed reports and analyze your financial health over time.
                            </p>
                        </div>
                        
                        {/* Feature 6 */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition-all">
                            <div className="bg-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Private</h3>
                            <p className="text-gray-600">
                                Your financial data is encrypted and secured with industry-standard protocols.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                <div className="w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Getting Started is Easy
                        </h2>
                        <p className="text-xl text-gray-600">
                            Start managing your finances in just three simple steps
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                                1
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Account</h3>
                            <p className="text-gray-600">
                                Sign up for free in seconds. Choose between User or Admin roles.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-green-600 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                                2
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Set Your Goals</h3>
                            <p className="text-gray-600">
                                Define your monthly income, savings goals, and expense targets.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                                3
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Track & Grow</h3>
                            <p className="text-gray-600">
                                Add transactions and watch your financial health improve over time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="px-4 py-12 bg-white">
                <div className="w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Why Choose Our Budget Tracker?
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-1">100% Free to Use</h4>
                                        <p className="text-gray-600">No hidden fees, no subscriptions. Completely free forever.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-1">Easy to Use</h4>
                                        <p className="text-gray-600">Intuitive interface designed for everyone, no learning curve.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-1">Real-time Updates</h4>
                                        <p className="text-gray-600">See your financial status update instantly as you add transactions.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-1">Comprehensive Categories</h4>
                                        <p className="text-gray-600">Track expenses across multiple categories for better insights.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8">
                                <div className="bg-white rounded-2xl p-6 shadow-xl">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                                    <TrendingUp className="text-white" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Salary</p>
                                                    <p className="text-sm text-gray-600">Income</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-green-600">+₹50,000</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                                    <DollarSign className="text-white" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Rent</p>
                                                    <p className="text-sm text-gray-600">Expense</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-red-600">-₹15,000</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                                    <DollarSign className="text-white" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Groceries</p>
                                                    <p className="text-sm text-gray-600">Expense</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-red-600">-₹5,000</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 py-12 bg-gradient-to-r from-blue-600 to-cyan-500">
                <div className="w-full text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Take Control of Your Finances?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of users who are already managing their money smarter.
                    </p>
                    <Link 
                        to="/signup"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Start Your Journey Today
                        <ArrowRight size={24} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
