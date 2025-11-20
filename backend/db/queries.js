const pool = require('./pool')

async function getAllGames() {
    const {rows} = await pool.query(`
        SELECT
            g.id,
            g.title,
            g.price,
            g.rating,
            g.release_year,
            g.image_url,
            gen.genre_name,
            d.developer_name,
            ARRAY_AGG(p.platform_name ORDER BY p.platform_name) AS platforms
        FROM games g
        LEFT JOIN genres gen ON g.genre_id = gen.id
        LEFT JOIN developers d ON g.developer_id = d.id
        LEFT JOIN game_platforms gp ON g.id = gp.game_id
        LEFT JOIN platforms p ON gp.platform_id = p.id
        GROUP BY g.id, g.title, g.price, g.rating, g.release_year, g.image_url, gen.genre_name, d.developer_name
        ORDER BY g.id
        `)
    return rows
}

async function getSearchedGame(search) {
    const {rows} = await pool.query(`
        SELECT
            g.id,
            g.title,
            g.price,
            g.rating,
            g.release_year,
            g.image_url,
            gen.genre_name,
            d.developer_name,
            ARRAY_AGG(p.platform_name ORDER BY p.platform_name) AS platforms
        FROM games g
        LEFT JOIN genres gen ON g.genre_id = gen.id
        LEFT JOIN developers d ON g.developer_id = d.id
        LEFT JOIN game_platforms gp ON g.id = gp.game_id
        LEFT JOIN platforms p ON gp.platform_id = p.id
        WHERE g.title ILIKE $1 
            OR gen.genre_name ILIKE $1 
            OR d.developer_name ILIKE $1
        GROUP BY g.id, g.title, g.price, g.rating, g.release_year, g.image_url, gen.genre_name, d.developer_name
        ORDER BY g.title
    `, [`%${search}%`])
    return rows
}

module.exports = {
    getAllGames,
    getSearchedGame,
}