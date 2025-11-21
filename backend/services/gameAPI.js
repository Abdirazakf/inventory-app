require('dotenv').config()
const base_url = 'https://api.gamebrain.co/v1/games'
const key = process.env.API_KEY

async function searchGame(query) {
    try {
        const encodedQuery = encodeURIComponent(query)
        const url = `${base_url}?query=${encodedQuery}&api-key=${key}`
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        })
        
        if (!response.ok) {
            throw new Error(`Network Error: ${response.status}`)
        }
        
        const data = await response.json()

        return data.results[0].id || null
    } catch(err) {
        console.error('Error searching api:', err)
        return null
    }
}

async function getGameDetails(id) {
    if (!id) {
        console.error('No game ID provided')
        return null
    }
    
    try {
        const url = `${base_url}/${id}?api-key=${key}`
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`Network Error: ${response.status}`)
        }
        
        const data = await response.json()

        return data
    } catch(err) {
        console.error('Error fetching details:', err)
        return null
    }
}

function formatGameData(game) {
    if (!game) {
        throw new Error('No game data to format')
    }
    
    const getPrice = (offers) => {
        if (!offers || !Array.isArray(offers) || offers.length === 0) {
            return null
        }
        for (const offer of offers) {
            if (offer?.price?.value) {
                return parseFloat(offer.price.value)
            }
        }
        return null
    }
    
    const getRating = (rating) => {
        if (!rating || typeof rating.mean !== 'number') {
            return null
        }
        return parseFloat((rating.mean * 10).toFixed(2))
    }
    
    const getYear = (date) => {
        if (!date || typeof date !== 'string') {
            return null
        }
        const year = parseInt(date.slice(0, 4))
        return isNaN(year) ? null : year
    }
    
    const getPlatforms = (platforms) => {
        if (!platforms || !Array.isArray(platforms)) {
            return []
        }
        return platforms
            .filter(p => p && p.name)
            .map(p => p.name)
    }
    
    return {
        title: game.name || 'Unknown Title',
        price: getPrice(game.offers),
        rating: getRating(game.rating),
        release_year: getYear(game.release_date),
        image_url: game.image || null,
        genre_name: game.genre || 'Unknown',
        developer_name: game.developer || 'Unknown',
        platforms: getPlatforms(game.platforms)
    }
}

async function searchAndFormatGame(query) {
    const gameId = await searchGame(query)
    
    if (!gameId) {
        return null
    }
    
    const details = await getGameDetails(gameId)
    
    if (!details) {
        return null
    }
    
    return formatGameData(details)
}

module.exports = {
    searchGame,
    getGameDetails,
    formatGameData,
    searchAndFormatGame
}