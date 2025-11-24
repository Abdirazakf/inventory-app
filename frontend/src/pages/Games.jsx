import { useNavigate, useParams } from "react-router-dom"
import {Toaster} from "react-hot-toast"
import { useGameStore } from "../states/useGameStore"
import { useEffect } from "react"
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react"

export default function Games(){
    const {
        currentGame,
        clearCurrentGame,
        formData,
        setFormData,
        loading,
        getCurrentGame,
        updateGame,
        deleteGame
    } = useGameStore()

    const navigate = useNavigate()
    const {id} = useParams()

    useEffect(() => {
        getCurrentGame(id)

        return () => {
            clearCurrentGame()
        }
    }, [id, getCurrentGame, clearCurrentGame])

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this game?")){
            await deleteGame(currentGame.id)
            navigate('/')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await updateGame(currentGame.id)
        } catch (err) {
            console.log('Failed to submit changes:', err)
        }
    }

    if (loading && !currentGame) {
        return(
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        )
    }

        // Game not found
    if (!currentGame) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
                <h2 className="text-2xl font-semibold">Game not found</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    <ArrowLeftIcon className="size-4 mr-2" />
                    Back to Homepage
                </button>
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
                <div className="rounded-lg overflow-hidden shadow-lg bg-base-100 w-full aspect-[2/3]">
                    <img 
                    src={currentGame.image_url} 
                    alt={currentGame.title}
                    className="w-full h-full object-cover"
                    /> 
                </div>
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-6">Edit Game</h2>
                        <form onSubmit={handleSubmit}
                        className="space-y-6"
                        >
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-medium">Game Title</span>
                                </label>
                                <input type="text"
                                placeholder="Enter game title"
                                className="input input-bordered w-full"
                                value={formData.title}
                                onChange={(e) => setFormData('title', e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-medium">Game Price</span>
                                </label>
                                <input type="text"
                                placeholder="Enter game price"
                                className="input input-bordered w-full"
                                value={formData.price}
                                onChange={(e) => setFormData('price', e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-medium">Genre</span>
                                </label>
                                <input type="text" 
                                placeholder="Enter game genre"
                                className="input input-bordered w-full"
                                value={formData.genre_name}
                                onChange={(e) => setFormData('genre_name', e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-medium">Developer</span>
                                </label>
                                <input type="text" 
                                placeholder="Enter game developer(s)"
                                className="input input-bordered w-full"
                                value={formData.developer_name}
                                onChange={(e) => setFormData('developer_name', e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-medium">Release Year</span>
                                </label>
                                <input type="text" 
                                placeholder="Enter game release year"
                                className="input input-bordered w-full"
                                value={formData.release_year}
                                onChange={(e) => setFormData('release_year', e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-medium">Rating</span>
                                </label>
                                <input type="text" 
                                placeholder="Enter game rating"
                                className="input input-bordered w-full"
                                value={formData.rating}
                                onChange={(e) => setFormData('rating', e.target.value)}
                                />
                            </div>

                            <div className="flex justify-between mt-8">
                                <button type="button" onClick={handleDelete} className="btn btn-error">
                                    <Trash2Icon className="size-4 mr-2" />
                                    Delete Game
                                </button>

                                <button type="submit" className="btn btn-primary"
                                disabled={loading || !formData}>
                                    {loading ? (
                                        <span className="loading loading-spinner loading-sm"/>
                                    ) : (
                                        <>
                                            <SaveIcon className="size-4 mr-2"/>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}