// store.ts
import create from 'zustand';

type State = {
  filePath: string | null;
  setFilePath: (path: string | null) => void;
};

export const useStore = create<State>((set) => ({
  filePath: null,
  setFilePath: (path) => set({ filePath: path }),
}));
