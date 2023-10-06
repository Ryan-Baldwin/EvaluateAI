import { create } from 'zustand';

interface useActiveSessionInterface {
  id?: string;
  set: (id: string) => void;
  reset: () => void;
}

export const useActiveSession = create<useActiveSessionInterface>((set) => ({
  id: undefined,
  set: (id: string) => set({ id }),
  reset: () => set({ id: undefined }),
}));