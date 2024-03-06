import { create } from "zustand";

interface SessionState {
    isLoggedIn: boolean;
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

interface User {
    id: number; // User ID (integer)
    type_user: string; // User type ("student" or other valid types)
    name: string; // User's first name
    last_name: string; // User's lasta name
    email: string; // User's email address (validated for correct format)
    password: string; // User's password (hashed and securely stored)
    birthday: string; // User's birthday is ISO 8601 format ("YYYY-MM-DDTHH:mm:ss.sssZ")
    status: "active" | "inactive"; // User's account status
    created_date: string; // Date and time the user account was created in ISO 8601 format
}

export const useSessionStore = create<SessionState>((set) => ({
    isLoggedIn: false,
    user: null,
    login: (user: User) => {
        // Manejo del estado
        set({ isLoggedIn: true, user });
    },
    logout: () => {
        set({ isLoggedIn: false, user: null });
    },
}));