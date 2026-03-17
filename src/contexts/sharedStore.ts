// store.ts
import { SharedDataModelTypes } from '@/types/SharedDataModelTypes';
import { create } from 'zustand';

interface useStore {
  sharedData: SharedDataModelTypes | any;
  updateSharedData: (key: keyof SharedDataModelTypes, value: any) => void;
  resetSharedData: () => void;
}

const useStore = create<useStore>((set) => ({
  sharedData: null,

  updateSharedData: (key: keyof SharedDataModelTypes, value: any) =>
    set((state) => ({
      sharedData: { ...state.sharedData, [key ]: value },
    })),

  resetSharedData: () => set({ sharedData: null }),
}));

export default useStore;
