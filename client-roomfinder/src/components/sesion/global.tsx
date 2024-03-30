import { create } from "zustand";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import axios from "axios";

interface SessionState {
    isLoggedIn: boolean;
    user: User | null;
    login: (user: Partial<User>) => Promise<void>;
    logout: () => void;
}

export interface User {
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
    login: async (user: Partial<User>) => {
        console.log(user)
        try {
            const id = user.id;
            const response = await axios.get(`/api/users/${id}`);
            console.log(response.data)
            const fullUser = response.data as User;
            set({ isLoggedIn: true, user: fullUser });
        } catch (error) {
            console.log("error", error);
        }
    },
    logout: () => {
        set({ isLoggedIn: false, user: null });
    },
}));

export const checkToken = async () => {
    const token = Cookies.get("login");
    if (token) {
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);
            const user = decoded as Partial<User>;
            useSessionStore.getState().login(user);
        } catch (error) {
            console.log("error")
        }
    }
}