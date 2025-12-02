import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { UserPlus, Wallet, Shield, User, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
    const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; general?: string }>({});
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePassword = (password: string) => {
        // At least 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{6,}$/;
        return re.test(password);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: { username?: string; email?: string; password?: string } = {};

        if (!username.trim()) newErrors.username = 'Username is required';
        else if (username.length < 3 || username.length > 20) newErrors.username = 'Username must be between 3 and 20 characters';

        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!validateEmail(email)) newErrors.email = 'Invalid email format';

        if (!password) newErrors.password = 'Password is required';
        else if (!validatePassword(password)) newErrors.password = 'Password must be at least 6 characters, with uppercase, lowercase, number & special char';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await registerUser({ username, email, password, role });
            alert('Registered successfully! Please log in.');
            navigate('/login');
        } catch (err: any) {
            const msg = err.response?.data || 'Error registering user!';
            setErrors({ general: typeof msg === 'string' ? msg : 'Registration failed' });
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Wallet className="text-blue-600" size={40} />
                        {/* FIX: Added 'pb-1' to prevent text clipping on descenders like 'g' */}
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent pb-1">
                            Budget Tracker
                        </h1>
                    </div>
                    <p className="text-gray-600">Create your account to start tracking your finances.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>
                    <form onSubmit={handleRegister} className="space-y-6" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (errors.username) setErrors({ ...errors, username: undefined });
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.username ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.username && (
                                <p className="text-sm text-red-600 mt-1">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: undefined });
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({ ...errors, password: undefined });
                                    }}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('USER')}
                                    className={`p-4 rounded-lg font-medium transition-all border-2 ${role === 'USER'
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                                        }`}
                                >
                                    <User className="mx-auto mb-2" size={24} />
                                    User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('ADMIN')}
                                    className={`p-4 rounded-lg font-medium transition-all border-2 ${role === 'ADMIN'
                                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                                        }`}
                                >
                                    <Shield className="mx-auto mb-2" size={24} />
                                    Admin
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            <UserPlus size={20} />
                            Sign Up
                        </button>
                        {errors.general && (
                            <p className="text-center text-sm text-red-600 mt-3" role="alert">{errors.general}</p>
                        )}
                    </form>

                    <p className="text-center text-gray-600 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;