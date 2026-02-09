import { create } from "zustand";

type AuthState = {
  open: boolean;
  openAuth: () => void;
  closeAuth: () => void;
};

export const useAuthModal = create<AuthState>((set) => ({
  open: false,
  openAuth: () => set({ open: true }),
  closeAuth: () => set({ open: false }),
}));
