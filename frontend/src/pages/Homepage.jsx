import { useEffect } from "react"
import { useGameStore } from "../states/useGameStore"
import {PlusCircleIcon, RefreshCwIcon} from "lucide-react"
import GameCard from '../components/GameCard'

export default function Homepage(){
    const {gameList, loading, error, fetchGames} = useGameStore()

    useEffect(() => {
        fetchGames()
    }, [fetchGames])

    console.log(gameList)
    
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