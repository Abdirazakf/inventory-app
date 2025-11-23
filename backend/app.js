const express = require('express')
const cors = require('cors')
const app = express()
const gameRouter = require('./routes/gameRouter')
require('dotenv').config()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/games', gameRouter)

app.listen(process.env.PORT, (err) => {
    if (err){
        console.log(err)
    }

    console.log(`Inventory App is running at port ${process.env.PORT}`)
})