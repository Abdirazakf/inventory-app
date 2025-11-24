import { useNavigate, useParams } from "react-router-dom"
import { useGameStore } from "../states/useGameStore"
import { useEffect } from "react"
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react"

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

    const handleDelete = async () => {
        await deleteGame(currentGame.id)
        navigate('/')
    }

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

            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">Edit Game</h2>

                    <form onSubmit={(e) => {
                        e.preventDefault()
                        updateGame(currentGame.id)
                    }}
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
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, genre_name: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, developer_name: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, release_year: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, rating: e.target.value})}
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
    )
}