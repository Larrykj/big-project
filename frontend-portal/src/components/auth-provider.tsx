import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
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

    // Check for saved session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("omni_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const account = DEMO_USERS[email];

        if (!account || account.password !== password) {
            throw new Error("Invalid credentials");
        }

        setUser(account.user);
        localStorage.setItem("omni_user", JSON.stringify(account.user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("omni_user");
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
