const db = require('../db/queries')
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

        const result = await db.getSearchedGame(searchedGame)
        res.json(result)
    }
]