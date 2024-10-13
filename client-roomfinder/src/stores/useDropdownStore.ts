import { create } from 'zustand';

interface DropdownStore {
  isOpen: boolean;
  toggleDropdown: () => void;
  closeDropdown: () => void;
}

const useDropdownStore = create<DropdownStore>((set) => ({
  isOpen: false,
  toggleDropdown: () => set((state) => ({ isOpen: !state.isOpen })),
  closeDropdown: () => set({ isOpen: false }),
}));

export default useDropdownStore;