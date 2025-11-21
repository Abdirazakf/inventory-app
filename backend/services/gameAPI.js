require('dotenv').config({path: '../.env'})
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
    if (!game){
        throw new Error('No game data to format')
    }

    return {
        id: game.id,
        title: game.name,
        price: game.offers[0].price.value,
        rating: (game.rating.mean * 10).toFixed(2),
        release_year: parseInt(game.release_date.slice(0,4)),
        image_url: game.image,
        genre_name: game.genre,
        developer_name: game.developer,
        platforms: game.platforms.map(platform => platform.name) || []
    }
}

// API test

// async function main() {
//     const name = "elden ring"
    
//     console.log('Searching for:', name)
//     const gameId = await searchGame(name)
    
//     if (!gameId) {
//         console.error('No game found')
//         return
//     }

//     console.log('Found game ID:', gameId)
//     const details = await getGameDetails(gameId)
    
//     if (!details) {
//         console.error('Could not fetch game details')
//         return
//     }
    
//     const formatted = formatGameData(details)
//     console.log('Formatted game data:', formatted)
// }

// main()