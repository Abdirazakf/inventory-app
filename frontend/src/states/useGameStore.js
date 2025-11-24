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
    currentGame : null,
    searchQuery: '',
    formData: {},

    setSearchQuery: (query) => set({searchQuery: query}),

    setFormData: (field, value) => set((state) => ({
        formData: {
            ...state.formData,
            [field]: value
        }
    })),

    clearCurrentGame: () => set({
        currentGame: null,
        formData: {},
        error: null
    }),

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

    getCurrentGame: async (id) => {
        set({loading: true})

        try {
            const response = await axios.get(`${BASE_URL}/${id}`)
            set({currentGame: response.data, error: null,
                formData: response.data
            })
        } catch(err) {
            console.log("Couldn't get game details:",err)
            toast.error("Couldn't Game Details")
        } finally {
            set({loading: false})
        }
    },
    
    updateGame: async (id) => {
        set({loading: true})
        
        try {
            const state = useGameStore.getState()
            const {formData} = state

            const updates = {}

            // Only include fields that have values
            if (formData.title.trim()) {
                updates.title = formData.title.trim()
            }
            if (formData.price !== '' && formData.price !== null) {
                updates.price = parseFloat(formData.price)
            }
            if (formData.genre_name.trim()) {
                updates.genre_name = formData.genre_name.trim()
            }
            if (formData.developer_name.trim()) {
                updates.developer_name = formData.developer_name.trim()
            }
            if (formData.release_year) {
                updates.release_year = parseInt(formData.release_year)
            }
            if (formData.rating != null && formData.rating !== '') {
                updates.rating = parseFloat(formData.rating)
            }

            if (Object.keys(updates).length === 0){
                toast.error('No changes to update')
                set({loading: false})
                return
            }

            const response = await axios.patch(`${BASE_URL}/${id}`, updates)
            const updatedGame = response.data.game
            
            set(() => ({
                currentGame: updatedGame,
                formData: updatedGame
            }))

            toast.success('Game updated successfully')
        } catch(err) {
            console.log('Failed to update game:', err)
        
            if (err.response.data.error) {
                toast.error(err.response.data.error)
            } else {
                toast.error('Failed to update game')
            }
            throw err
        } finally {
            set({loading: false})
        }
    },

    deleteGame: async (id) => {
        set({loading: true})

        try {
            await axios.delete(`${BASE_URL}/${id}`)
            set(prev => ({gameList: prev.gameList.filter(game => game.id !== id)}))
            toast.success('Game deleted successfully')
        } catch(err){
            console.log('Error delete game:',err)
            toast.error('Failed to delete game')
        } finally{
            set({loading: false})
        }
    }
}))