import {Routes, Route} from "react-router-dom"
import {Toaster} from "react-hot-toast"
import Navbar from "./components/Navbar"
import Games from "./pages/Games"
import Homepage from "./pages/Homepage"
import { useThemeStore } from "./states/useThemeStore"

export default function App() {
    const {currentTheme} = useThemeStore()

    return (
        <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={currentTheme}>
            <Navbar />
            <Routes>
                <Route path='/' element={<Homepage/>} />
                <Route path='/:id' element={<Games/>} />
            </Routes>

            <Toaster />
        </div>
    )
}