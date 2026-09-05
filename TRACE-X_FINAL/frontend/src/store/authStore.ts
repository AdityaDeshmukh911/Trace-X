import { create } from "zustand";
import { AuthUser } from "../types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("tracex_token"),
  user:  JSON.parse(localStorage.getItem("tracex_user") || "null"),

  login: (token, user) => {
    localStorage.setItem("tracex_token", token);
    localStorage.setItem("tracex_user", JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem("tracex_token");
    localStorage.removeItem("tracex_user");
    set({ token: null, user: null });
  },
}));
