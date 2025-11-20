const db = require('../db/queries')

exports.gameListGet =  async (req, res) => {
    const games = await db.getAllGames()
    res.send(games)
}