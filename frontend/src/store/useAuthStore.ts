import { create } from "zustand";
import { type AuthUser } from "@/services/comment-service";

const TOKEN_KEY = "portfolio_user_token";
const USER_KEY = "portfolio_user_data";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  modalOpen: boolean;
  modalTab: "login" | "register";
  isInitialized: boolean;
  initialize: () => void;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  openModal: (tab?: "login" | "register") => void;
  closeModal: () => void;
  setModalTab: (tab: "login" | "register") => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  modalOpen: false,
  modalTab: "login",
  isInitialized: false,
  initialize: () => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t && u) {
      try {
        set({ token: t, user: JSON.parse(u), isInitialized: true });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        set({ token: null, user: null, isInitialized: true });
      }
    } else {
      set({ isInitialized: true });
    }
  },
  login: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    set({ token, user, modalOpen: false });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    set({ token: null, user: null });
  },
  openModal: (tab = "login") => {
    set({ modalOpen: true, modalTab: tab });
  },
  closeModal: () => {
    set({ modalOpen: false });
  },
  setModalTab: (tab) => {
    set({ modalTab: tab });
  },
}));
