import { useState, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Async login — crosschecks against admin_credentials table via API
    const login = async (username, password) => {
        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                return { success: false, message: data.message || 'Invalid credentials.' };
            }
            setUser({ id: data.user.id, name: data.user.username });
            return { success: true };
        } catch {
            return { success: false, message: 'Cannot reach server. Is it running?' };
        }
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
