import {create} from "zustand"

export const useThemeStore = create((set) => ({
    currentTheme: "forest",
    setTheme: (currentTheme) => set({currentTheme})
}))