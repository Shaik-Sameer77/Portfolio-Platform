import { create } from "zustand";
import { type AuthUser } from "@/services/comment-service";

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
  /** Internal: clears local state without calling backend logout. Used by interceptors. */
  _clearSession: () => void;
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
  initialize: async () => {
    if (typeof window === "undefined") return;
    
    // Step 1: Immediately load cached user data from localStorage for instant UI
    const cached = localStorage.getItem(USER_KEY);
    if (cached) {
      try {
        const parsedUser = JSON.parse(cached);
        set({ user: parsedUser, token: "cookie-based", isInitialized: true });
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    // Step 2: Verify session with backend (async, non-blocking for UI)
    try {
      const proxy = (await import("@/services/proxy")).default;
      const res = await proxy.get("/auth/status");
      if (res.data && res.data.user) {
        set({ user: res.data.user, isInitialized: true, token: "cookie-based" });
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      }
    } catch {
      // Session is invalid — clear everything
      localStorage.removeItem(USER_KEY);
      set({ token: null, user: null, isInitialized: true });
    }
  },
  login: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    set({ token, user, modalOpen: false });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_KEY);
    }
    set({ token: null, user: null });
    // Call backend to clear cookies
    import("@/services/proxy").then(({ default: proxy }) => {
      proxy.post('/auth/logout').catch(() => {});
    });
  },
  _clearSession: () => {
    // Used by interceptors when auth fails — clears local state WITHOUT calling backend logout
    // This prevents the cascade: interceptor → logout() → POST /auth/logout → 401 → interceptor loop
    if (typeof window !== "undefined") {
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
