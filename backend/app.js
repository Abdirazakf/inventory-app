const express = require('express')
const path = require('path')
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

// Serve React app
if (process.env.NODE_ENV === 'production') {
    // Serve static files
    app.use(express.static(path.join(__dirname, '../frontend/dist')))
    
    // Handle React routing - send all non-API requests to index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}

app.listen(process.env.PORT, (err) => {
    if (err){
        console.log(err)
    }

    console.log(`Inventory App is running at port ${process.env.PORT}`)
})