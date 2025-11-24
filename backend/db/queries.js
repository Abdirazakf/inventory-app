require('dotenv').config()
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
        FROM games AS g
        LEFT JOIN genres AS gen ON g.genre_id = gen.id
        LEFT JOIN developers AS d ON g.developer_id = d.id
        LEFT JOIN game_platforms AS gp ON g.id = gp.game_id
        LEFT JOIN platforms AS p ON gp.platform_id = p.id
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
        FROM games AS g
        LEFT JOIN genres AS gen ON g.genre_id = gen.id
        LEFT JOIN developers AS d ON g.developer_id = d.id
        LEFT JOIN game_platforms AS gp ON g.id = gp.game_id
        LEFT JOIN platforms AS p ON gp.platform_id = p.id
        WHERE g.title ILIKE $1 
            OR gen.genre_name ILIKE $1 
            OR d.developer_name ILIKE $1
        GROUP BY g.id, g.title, g.price, g.rating, g.release_year, g.image_url, gen.genre_name, d.developer_name
        ORDER BY g.title
    `, [`%${search}%`])
    return rows
}

async function getGameByID(id) {
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
        FROM games AS g
        LEFT JOIN genres AS gen ON g.genre_id = gen.id
        LEFT JOIN developers AS d ON g.developer_id = d.id
        LEFT JOIN game_platforms AS gp ON g.id = gp.game_id
        LEFT JOIN platforms AS p ON gp.platform_id = p.id
        WHERE g.id = $1
        GROUP BY g.id, g.title, g.price, g.rating, g.release_year, g.image_url, gen.genre_name, d.developer_name
        `, [id])
    
        return rows[0]
}

async function insertNewGame(data) {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Insert or get genre
        const genre = await client.query(
            `INSERT INTO genres (genre_name)
            VALUES ($1)
            ON CONFLICT (genre_name) DO UPDATE SET genre_name = EXCLUDED.genre_name
            RETURNING id`,
            [data.genre_name]
        )
        const genreID = genre.rows[0].id

        // Insert or get developer
        const developer = await client.query(
            `INSERT INTO developers (developer_name)
            VALUES ($1)
            ON CONFLICT (developer_name) DO UPDATE SET developer_name = EXCLUDED.developer_name
            RETURNING id`,
            [data.developer_name]
        )
        const devID = developer.rows[0].id

        // Insert game
        const game = await client.query(
            `INSERT INTO games (title, price, genre_id, rating, release_year, image_url, developer_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`,
            [
                data.title,
                data.price,
                genreID,
                data.rating,
                data.release_year,
                data.image_url,
                devID
            ]
        )
        const gameID = game.rows[0].id

        // Insert platforms and link to game
        for (const platformName of data.platforms){
            const platform = await client.query(
                `INSERT INTO platforms (platform_name)
                VALUES ($1)
                ON CONFLICT (platform_name) DO UPDATE SET platform_name = EXCLUDED.platform_name
                RETURNING id`,
                [platformName]
            )
            const platformID = platform.rows[0].id

            await client.query(
                `INSERT INTO game_platforms (game_id, platform_id)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING`,
                [gameID, platformID]
            )
        }

        await client.query('COMMIT')
        
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
            FROM games AS g
            LEFT JOIN genres AS gen ON g.genre_id = gen.id
            LEFT JOIN developers AS d ON g.developer_id = d.id
            LEFT JOIN game_platforms AS gp ON g.id = gp.game_id
            LEFT JOIN platforms AS p ON gp.platform_id = p.id
            WHERE g.id = $1
            GROUP BY g.id, g.title, g.price, g.rating, g.release_year, g.image_url, gen.genre_name, d.developer_name`
            , [gameID])

        return rows[0]
    } catch(err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
}

async function updateGame(id, updates){
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        let genreID = null
        let developerID = null

        // Handle genre update
        if (updates.genre_name) {
            const genre = await client.query(
                `INSERT INTO genres (genre_name)
                VALUES ($1)
                ON CONFLICT (genre_name) DO UPDATE SET genre_name = EXCLUDED.genre_name
                RETURNING id`,
                [updates.genre_name]
            )
            genreID = genre.rows[0].id
        }

        // Handle developer update
        if (updates.developer_name) {
            const developer = await client.query(
                `INSERT INTO developers (developer_name)
                VALUES ($1)
                ON CONFLICT (developer_name) DO UPDATE SET developer_name = EXCLUDED.developer_name
                RETURNING id`,
                [updates.developer_name]
            )
            developerID = developer.rows[0].id
        }

        const updateFields = []
        const values = []
        let count = 1

        // Add direct game fields
        if (updates.title !== undefined) {
            updateFields.push(`title = $${count}`)
            values.push(updates.title)
            count++
        }
        if (updates.price !== undefined) {
            updateFields.push(`price = $${count}`)
            values.push(updates.price)
            count++
        }
        if (updates.rating !== undefined) {
            updateFields.push(`rating = $${count}`)
            values.push(updates.rating)
            count++
        }
        if (updates.release_year !== undefined) {
            updateFields.push(`release_year = $${count}`)
            values.push(updates.release_year)
            count++
        }
        if (updates.image_url !== undefined) {
            updateFields.push(`image_url = $${count}`)
            values.push(updates.image_url)
            count++
        }

        if (genreID !== null) {
            updateFields.push(`genre_id = $${count}`)
            values.push(genreID)
            count++
        }
        if (developerID !== null) {
            updateFields.push(`developer_id = $${count}`)
            values.push(developerID)
            count++
        }

        if (updateFields.length > 0) {
            values.push(id)
            const updateQuery = `
                UPDATE games
                SET ${updateFields.join(', ')}
                WHERE id = $${count}
                RETURNING *
            `
            await client.query(updateQuery, values)
        }

        await client.query('COMMIT')

        return await getGameByID(id)
    } catch(err){
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
}

async function deleteGame(id){
    const {rowCount} = await pool.query(`
        DELETE FROM games WHERE id = $1
        `, [id])

    return rowCount > 0
}

module.exports = {
    getAllGames,
    getSearchedGame,
    insertNewGame,
    getGameByID,
    updateGame,
    deleteGame
}