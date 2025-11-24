import { useNavigate, useParams } from "react-router-dom"
import { useGameStore } from "../states/useGameStore"
import { useEffect } from "react"
import { ArrowLeftIcon } from "lucide-react"

export default function Games(){
    const {
        currentGame,
        formData,
        setFormData,
        loading,
        error,
        getCurrentGame,
        updateGame,
        deleteGame
    } = useGameStore()

    const navigate = useNavigate()
    const {id} = useParams()

    useEffect(() => {
        getCurrentGame(id)
    }, [getCurrentGame, id])

    if (loading) {
        return(
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        )
    }

    return(
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button className="btn btn-ghost mb-8" onClick={() => navigate("/")}>
                <ArrowLeftIcon className="size-4 mr-2" />
                Back to Homepage
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <img src={currentGame.image_url} alt={currentGame.title}
                className="size-full object-cover"/> 
            </div>
        </div>
    )
}