import {Routes, Route} from "react-router-dom"
import Navbar from "./components/Navbar"
import Games from "./pages/Games"
import Homepage from "./pages/Homepage"

export default function App() {
    return (
        <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme="coffee">
            <Navbar />
            <Routes>
                <Route path='/' element={<Homepage/>} />
                <Route path='/:id' element={<Games/>} />
            </Routes>
        </div>
    )
}