import { create } from "zustand";
import axios from 'axios'

const BASE_URL = "http://localhost:3000/games"

export const useGameStore = create((set) => ({
    gameList: [],
    loading: false,
    error: null,

    fetchGames: async() => {
        set({loading: true})

        try {
            const response = await axios.get(BASE_URL)
            set({gameList: response.data.results, error: null})
        } catch(err) {
            if (err.status == 429) {
                set({error: 'Rate limit exceeded'})
            } else {
                set({error: 'Something went wrong'})
            }
            console.error('Failed to get games:', err)
        } finally {
            set({loading: false})
        }
    }
}))