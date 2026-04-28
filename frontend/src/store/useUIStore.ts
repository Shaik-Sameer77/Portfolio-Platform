import { create } from "zustand";

type UIState = {
  drawerOpen: boolean;
  megaOpen: boolean;
  setDrawer: (v: boolean) => void;
  setMega: (v: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  drawerOpen: false,
  megaOpen: false,
  setDrawer: (v) => set({ drawerOpen: v }),
  setMega: (v) => set({ megaOpen: v }),
}));
