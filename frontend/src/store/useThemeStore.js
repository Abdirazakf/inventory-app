import {create} from "zustand"

export const useThemeStore = create((set) => ({
    currentTheme: localStorage.getItem("preferred-theme") || "forest",
    setTheme: (currentTheme) => {
        localStorage.setItem('preferred-theme', currentTheme)
        set({currentTheme})
    }
}))