import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi } from "../services/api";

export type UserRole = "admin" | "manager" | "driver" | "customer";

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (roles: UserRole[]) => boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for fallback when backend is offline
const DEMO_USERS: Record<string, { password: string; user: User }> = {
    "admin@omnilogistics.ke": {
        password: "admin123",
        user: {
            id: "1",
            email: "admin@omnilogistics.ke",
            name: "Admin User",
            role: "admin",
        },
    },
    "manager@omnilogistics.ke": {
        password: "manager123",
        user: {
            id: "2",
            email: "manager@omnilogistics.ke",
            name: "Operations Manager",
            role: "manager",
        },
    },
    "driver@omnilogistics.ke": {
        password: "driver123",
        user: {
            id: "3",
            email: "driver@omnilogistics.ke",
            name: "John Kamau",
            role: "driver",
        },
    },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for saved session on mount
    useEffect(() => {
        const checkAuth = async () => {
            const savedUser = authApi.getStoredUser();
            if (savedUser) {
                try {
                    // Verify token with backend
                    const freshUser = await authApi.getCurrentUser();
                    setUser({
                        id: String(freshUser.id),
                        email: freshUser.email,
                        name: freshUser.name,
                        role: freshUser.role.toLowerCase() as UserRole,
                    });
                } catch {
                    // Token expired or invalid, use cached user for demo
                    setUser(savedUser);
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // Try real API first
            const response = await authApi.login(email, password);
            const userData = response.user;
            setUser({
                id: String(userData.id),
                email: userData.email,
                name: userData.name,
                role: userData.role.toLowerCase() as UserRole,
            });
        } catch (error) {
            // Fallback to demo users if backend is offline
            console.warn("Backend offline, using demo authentication");
            await new Promise((resolve) => setTimeout(resolve, 500));

            const account = DEMO_USERS[email];
            if (!account || account.password !== password) {
                throw new Error("Invalid credentials");
            }

            setUser(account.user);
            localStorage.setItem("omni_user", JSON.stringify(account.user));
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    const hasRole = (roles: UserRole[]) => {
        return user ? roles.includes(user.role) : false;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                hasRole,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
