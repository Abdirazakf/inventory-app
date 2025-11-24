import { useEffect } from "react"
import { useGameStore } from "../states/useGameStore"
import {PackageIcon, PlusCircleIcon, RefreshCwIcon} from "lucide-react"
import GameCard from '../components/GameCard'

export default function Homepage(){
    const {gameList, loading, error, fetchGames} = useGameStore()

    useEffect(() => {
        fetchGames()
    }, [fetchGames])
    
    return(
        <main className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <button className="btn btn-primary">
                    <PlusCircleIcon className="size-5 mr-2" />
                    Add Game
                </button>
                <button className="btn btn-ghost btn-circle" onClick={fetchGames}>
                    <RefreshCwIcon className="size-5"/>
                </button>
            </div>

            {error && <div className="alert alert-error mb-8">{error}</div>}

            {gameList.length === 0 && !loading && (
                <div className="flex flex-col justify-center items-center h-96 space-y-4">
                    <div className="bg-base-100 rounded-full p-6">
                        <PackageIcon className="size-12" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-semibold">No games found</h3>
                        <p className="text-gray-500 max-w-sm">
                            Get started by adding your first game to the inventory
                        </p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loading loading-spinner loading-lg"/>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gameList.map(game => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            )}
        </main>
    )
}