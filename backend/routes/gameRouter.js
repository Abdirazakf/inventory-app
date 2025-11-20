const {Router} = require('express')
const gameRouter = Router()
const gameController = require('../controllers/gameController')

gameRouter.get('/', gameController.gameListGet)
gameRouter.get('/search', gameController.gameSearchGet)

module.exports = gameRouter