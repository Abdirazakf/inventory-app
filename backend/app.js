const express = require('express')
const path = require('path')
const app = express()
const indexRouter = require('./routes/indexRouter')
const gameRouter = require('./routes/gameRouter')
require('dotenv').config()

app.use(express.urlencoded({extended: true}))

app.use('/', indexRouter)
app.use('/game', gameRouter)

app.listen(process.env.PORT, (err) => {
    if (err){
        console.log(err)
    }

    console.log(`Inventory App is running at port ${process.env.PORT}`)
})