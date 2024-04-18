import { create } from 'zustand';

interface NavbarState {
    navbarHeight: number;
    setNavbarHeight: (height: number) => void;
}

const useNavbarStore = create<NavbarState>((set) => ({
    navbarHeight: 73, // Altura inicial
    setNavbarHeight: (height: number) => set({ navbarHeight: height }),
}));

export default useNavbarStore;