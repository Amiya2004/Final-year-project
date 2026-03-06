import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import '../user/Auth.css'; // Reusing auth styles

const AdminSetup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('Super Admin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Create Authentication User
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Update Profile Name
            await updateProfile(result.user, { displayName: name });

            // 3. Set Role in Database
            await set(ref(database, `users/${result.user.uid}`), {
                email,
                name,
                role: 'admin',
                createdAt: new Date().toISOString(),
                isSuperAdmin: true
            });

            alert('Admin account created successfully! Please login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <img src="/velmurgan-logo.png" alt="Nellai Velmurgan Store" className="auth-logo-img" style={{ width: '50px', height: '50px' }} />
                        <span className="logo-text">Admin<span className="logo-accent">Setup</span></span>
                    </div>
                    <h1>Create Admin Access</h1>
                    <p>Set up your primary administrator account</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleCreateAdmin} className="auth-form">
                    <div className="form-group">
                        <label>Admin Name</label>
                        <div className="input-wrapper">
                            <User size={20} />
                            <input
                                type="text"
                                placeholder="Enter admin name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={20} />
                            <input
                                type="email"
                                placeholder="admin@freshmart.com"
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
                                type="password"
                                placeholder="Create secure password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'Creating Access...' : 'Create Admin Account'}
                    </button>
                </form>
            </div>

            <div className="auth-decoration">
                <div className="deco-circle deco-1"></div>
                <div className="deco-circle deco-2"></div>
            </div>
        </div>
    );
};

export default AdminSetup;
