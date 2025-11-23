const express = require('express')
const app = express()
const gameRouter = require('./routes/gameRouter')
require('dotenv').config()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/', gameRouter)

app.listen(process.env.PORT, (err) => {
    if (err){
        console.log(err)
    }

    console.log(`Inventory App is running at port ${process.env.PORT}`)
})