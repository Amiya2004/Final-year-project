import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = async (email, password, name) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await set(ref(database, `users/${result.user.uid}`), {
            email,
            name,
            role: 'customer',
            createdAt: new Date().toISOString()
        });
        return result;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const userRef = ref(database, `users/${result.user.uid}`);
        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
            await set(userRef, {
                email: result.user.email,
                name: result.user.displayName,
                role: 'customer',
                createdAt: new Date().toISOString()
            });
        }
        return result;
    };

    const logout = () => {
        return signOut(auth);
    };

    const getUserRole = async (uid) => {
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            return snapshot.val().role;
        }
        return 'customer';
    };

    // One-time admin initialization
    useEffect(() => {
        const initAdmin = async () => {
            const ADMIN_EMAIL = 'velmurgan1623@gmail.com';
            try {
                const result = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, 'Amiya2004$');
                const userRef = ref(database, `users/${result.user.uid}`);
                const snapshot = await get(userRef);
                if (!snapshot.exists() || snapshot.val().role !== 'admin') {
                    await set(userRef, {
                        email: ADMIN_EMAIL,
                        name: result.user.displayName || 'Admin',
                        role: 'admin',
                        createdAt: new Date().toISOString(),
                        isSuperAdmin: true
                    });
                    console.log('Admin role set successfully!');
                } else {
                    console.log('Admin already configured.');
                }
                await signOut(auth);
            } catch (err) {
                if (err.code === 'auth/user-not-found') {
                    try {
                        const result = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, 'Amiya2004$');
                        await updateProfile(result.user, { displayName: 'Admin' });
                        await set(ref(database, `users/${result.user.uid}`), {
                            email: ADMIN_EMAIL,
                            name: 'Admin',
                            role: 'admin',
                            createdAt: new Date().toISOString(),
                            isSuperAdmin: true
                        });
                        console.log('Admin account created successfully!');
                        await signOut(auth);
                    } catch (createErr) {
                        console.error('Failed to create admin:', createErr.message);
                    }
                } else {
                    console.error('Admin init error:', err.message);
                }
            }
        };
        initAdmin();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const role = await getUserRole(user.uid);
                setUserRole(role);
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        isAdmin: userRole === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
