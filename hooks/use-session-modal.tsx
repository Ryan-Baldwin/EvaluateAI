import { create } from 'zustand';

interface useSessionModalSession {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSessionModal = create<useSessionModalSession>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));