import { create } from "zustand";

interface UseStoreModalInterface {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const useStoreModalStore = create<UseStoreModalInterface>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
