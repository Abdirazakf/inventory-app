const db = require('../db/queries')
const gameAPI = require('../services/gameAPI')
const {body, param, query, validationResult} = require('express-validator')

const lengthErr = 'Search must be between 1 and 255 characters'
const idErr = 'Valid game ID is required'
const priceErr = 'Price must be positive number'
const ratingErr = 'Rating must be between 0 and 10'
const yearErr = 'Release year must be valid'
const imageErr = 'Image URL must be valid'

const validateSearch = [
    query('q').trim()
    .isLength({min: 1, max: 255})
    .withMessage(lengthErr)
]

const validateId = [
    param('id').isInt({min: 1})
    .withMessage(idErr)
]

const validateUpdate = [
    param('id').isInt({min: 1})
    .withMessage(idErr),
    body('price').optional().isFloat({min: 0})
    .withMessage(priceErr),
    body('rating').optional().isFloat({min: 0})
    .withMessage(ratingErr),
    body('release_year').optional()
    .isInt({max: new Date().getFullYear() + 2}) // current year plus 2
    .withMessage(yearErr),
    body('image_url').optional()
    .isURL()
    .withMessage(imageErr)
]

exports.gameListGet =  async (req, res) => {
    const games = {
        results: await db.getAllGames()
    }
    res.send(games)
}

exports.gameSearchGet = [
    validateSearch,
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).send({
                errors: errors.array()
            })
        }

        const searchedGame = req.query.q || ""

        if (!searchedGame) {
            return res.send('No Search Entered')
        }

        try {
            let result = await db.getSearchedGame((searchedGame))

            if (result.length === 0) {
                console.log(`${searchedGame} not found in database`)

                const newGame = await gameAPI.searchAndFormatGame(searchedGame)

                if (!newGame){
                    return res.status(404).json({
                        error: 'Game not found in database or API',
                        search: searchedGame
                    })
                }

                console.log('Adding to database')
                const savedGame = await db.insertNewGame(newGame)

                result = [savedGame]

                console.log(`Successfully added ${searchedGame} to the database`)
            }

            res.json({
                results: result,
                count: result.length,
            })
        } catch(err){
            console.error('Search error:', err)
            res.status(500).json({
                error: 'Search Failed',
                message: err.message
            })
        }
    }
]

exports.gameGetByID = [
    validateId,
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {
            const game = await db.getGameById(req.params.id)

            if (!game){
                return res.status(404).json({
                    error: "Game not found",
                    id: req.params.id
                })
            }

            res.json(game)
        } catch(err){
            console.error('Error fetching game:', err)
            res.status(500).json({
                error: 'Failed to fetch game',
                message: err.message
            })
        }
    }
]

exports.gameUpdate = (req, res) => {
    
}

exports.gameDelete = (req, res) => {

}