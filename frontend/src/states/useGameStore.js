import { create } from "zustand";
import axios from 'axios';
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.PROD ? 
    '/games'
    : "http://localhost:3000/games"

export const useGameStore = create((set) => ({
    gameList: [],
    loading: false,
    error: null,
    searchQuery: '',

    setSearchQuery: (query) => set({searchQuery: query}),

    fetchGames: async() => {
        set({loading: true})

        try {
            const response = await axios.get(BASE_URL)
            set({gameList: response.data.results, error: null})
        } catch(err) {
            if (err.status == 429) {
                set({error: 'Rate limit exceeded', gameList: null})
            } else {
                set({error: 'Something went wrong'})
            }
            console.error('Failed to get games:', err)
            toast.error('Failed to get games')
        } finally {
            set({loading: false})
        }
    },
    
    searchGame: async (query) => {
        if (!query || query.trim() === '') {
            toast.error('Please enter a search term')
            return
        }

        set({loading: true})
        const encodedQuery = encodeURIComponent(query)

        try {
            const response = await axios.get(`${BASE_URL}/search?q=${encodedQuery}`)
            set({gameList: response.data.results, error: null})
            
            const count = response.data.count || response.data.results.length

            if (count > 0){
                toast.success(`Found ${count} game(s)`)
            } else {
                toast.error('No games found')
            }
        } catch(err){
            console.log('Failed to search game:', err)
            set({error: 'Failed to search game'})
            toast.error('Failed to Search Game')
        } finally {
            set({loading: false})
        }
    },

    deleteGame: async (id) => {
        set({loading: true})

        try {
            await axios.delete(`${BASE_URL}/${id}`)
            set(prev => ({gameList: prev.gameList.filter(game => game.id !== id)}))
            toast.success('Product deleted successfully')
        } catch(err){
            console.log('Error delete game:',err)
            toast.error('Failed to delete game')
        } finally{
            set({loading: false})
        }
    }
}))