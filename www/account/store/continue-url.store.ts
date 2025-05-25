import { create } from 'zustand';

interface ContinueState {
  continueUrl: string | null;
  setContinueUrl: (url: string | null) => void;
}

export const useContinueStore = create<ContinueState>()((set) => ({
  continueUrl: null,
  setContinueUrl: (url) => set({ continueUrl: url }),
}));