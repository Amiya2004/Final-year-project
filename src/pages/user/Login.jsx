import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ref, get } from 'firebase/database';
import { database } from '../../config/firebase';
import './Auth.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const checkRoleAndNavigate = async (uid) => {
        try {
            const userRef = ref(database, `users/${uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.role === 'admin') {
                    navigate('/admin');
                    return;
                }
            }
            navigate('/');
        } catch (error) {
            console.error('Error checking role:', error);
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const result = await login(email, password);
                await checkRoleAndNavigate(result.user.uid);
            } else {
                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                const result = await signup(email, password, name);
                // Signup usually creates a customer, but let's be consistent
                await checkRoleAndNavigate(result.user.uid);
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await loginWithGoogle();
            await checkRoleAndNavigate(result.user.uid);
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <span className="logo-icon">🛒</span>
                        <span className="logo-text">Fresh<span className="logo-accent">Mart</span></span>
                    </Link>
                    <h1>{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
                    <p>{isLogin ? 'Sign in to continue shopping' : 'Join us for fresh groceries'}</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={20} />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {isLogin && (
                        <div className="form-footer">
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <button
                    className="google-btn"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    <Chrome size={20} />
                    Google
                </button>

                <p className="auth-switch">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </motion.div>

            <div className="auth-decoration">
                <div className="deco-circle deco-1"></div>
                <div className="deco-circle deco-2"></div>
                <div className="deco-circle deco-3"></div>
            </div>
        </div>
    );
};

export default Login;
