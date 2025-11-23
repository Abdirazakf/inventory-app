import { useEffect } from "react"
import { useGameStore } from "../states/useGameStore"

export default function Homepage(){
    const {gameList, fetchGames} = useGameStore()

    useEffect(() => {
        fetchGames()
    }, [fetchGames])

    console.log(gameList)
    
    return(
        <div>Homepage</div>
    )
}