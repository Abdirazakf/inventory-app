const db = require('../db/queries')
const gameAPI = require('../services/gameAPI')
const {query, validationResult} = require('express-validator')

const lengthErr = 'Search must be between 1 and 255 characters'

const validateSearch = [
    query('q').trim()
    .isLength({min: 1, max: 255})
    .withMessage(lengthErr)
]

exports.gameListGet =  async (req, res) => {
    const games = await db.getAllGames()
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