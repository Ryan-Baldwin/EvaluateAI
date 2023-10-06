// store.ts
import create from 'zustand';

type State = {
  text: string,
  categories: string[],
  rawResults: { [key: string]: string[] },
  cleanedResults: { [key: string]: string[] },
  viewResults: 'raw' | 'cleaned',
  setText: (text: string) => void,
  setCategories: (categories: string[]) => void,
  setRawResults: (results: { [key: string]: string[] }) => void,
  setCleanedResults: (results: { [key: string]: string[] }) => void,
  setRawView: () => void,
  setCleanedView: () => void
};

export const useStore = create<State>((set) => ({
  text: '',
  categories: [],
  rawResults: {},
  cleanedResults: {},
  viewResults: 'raw',
  setText: (text) => set({ text }),
  setCategories: (categories) => set({ categories }),
  setRawResults: (results) => set({ rawResults: results }),
  setCleanedResults: (results) => set({ cleanedResults: results }),
  setRawView: () => set({ viewResults: 'raw' }),
  setCleanedView: () => set({ viewResults: 'cleaned' })
}));
