const {Router} = require('express')
const gameRouter = Router()
const gameController = require('../controllers/gameController')

gameRouter.get('/', gameController.gameListGet)
gameRouter.get('/search', gameController.gameSearchGet)
gameRouter.get('/:id', gameController.gameGetByID)

gameRouter.patch('/:id', gameController.gameUpdate)
gameRouter.delete('/:id', gameController.gameDelete)
module.exports = gameRouter