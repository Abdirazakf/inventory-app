const {Router} = require('express')
const indexRouter = Router()
const indexController = require('../controllers/indexController')

indexRouter.get('/', (req, res) => {
    res.send('Homepage')
})

module.exports = indexRouter