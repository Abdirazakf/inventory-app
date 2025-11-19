const express = require('express')
const app = express()
require('dotenv').config()

app.listen(process.env.PORT, (err) => {
    if (err){
        console.log(err)
    }

    console.log(`Inventory App is running at port ${process.env.PORT}`)
})