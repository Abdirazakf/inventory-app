require('dotenv').config()
const { Client } = require('pg')

const SQL = `
CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS platforms (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    platform_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    developer_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
    rating DECIMAL(4, 2) CHECK (rating >= 0 AND rating <= 10),
    developer_id INTEGER REFERENCES developers(id) ON DELETE SET NULL,
    release_year INTEGER,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS game_platforms(
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, platform_id)
);

-- SAMPLE GENRES

INSERT INTO genres (genre_name) VALUES
    ('Action'),
    ('RPG'),
    ('Strategy')
ON CONFLICT (genre_name) DO NOTHING;

-- SAMPLE PLATFORMS

INSERT INTO platforms (platform_name) VALUES
    ('PlayStation 5'),
    ('Xbox One'),
    ('PC'),
    ('Nintendo Switch')
ON CONFLICT (platform_name) DO NOTHING;

-- SAMPLE DEVELOPERS

INSERT INTO developers (developer_name) VALUES
    ('CD Projekt Red'),
    ('FromSoftware'),
    ('Nintendo')
ON CONFLICT (developer_name) DO NOTHING;

-- SAMPLE GAMES

INSERT INTO games (title, price, genre_id, rating, release_year, image_url, developer_id) VALUES
    ('The Witcher 3', 39.99, (SELECT id FROM genres WHERE genre_name = 'RPG'), 9.5, 2015, 'https://example.com/witcher3.jpg', (SELECT id FROM developers WHERE developer_name = 'CD Projekt Red')),
    ('Elden Ring', 39.99, (SELECT id FROM genres WHERE genre_name = 'RPG'), 9.5, 2022, 'https://img.gamebrain.co/games/898/elden_ring_fromsoftware_2022_1.jpg', (SELECT id FROM developers WHERE developer_name = 'FromSoftware'))
ON CONFLICT DO NOTHING;

-- LINK GAME TO PLATFORMS

INSERT INTO game_platforms (game_id, platform_id) VALUES
    ((SELECT id FROM games WHERE title = 'The Witcher 3'), (SELECT id FROM platforms WHERE platform_name = 'PlayStation 5')),
    ((SELECT id FROM games WHERE title = 'The Witcher 3'), (SELECT id FROM platforms WHERE platform_name = 'Xbox One')),
    ((SELECT id FROM games WHERE title = 'The Witcher 3'), (SELECT id FROM platforms WHERE platform_name = 'PC')),
    ((SELECT id FROM games WHERE title = 'Elden Ring'), (SELECT id FROM platforms WHERE platform_name = 'PlayStation 5')),
    ((SELECT id FROM games WHERE title = 'Elden Ring'), (SELECT id FROM platforms WHERE platform_name = 'PC'))
ON CONFLICT DO NOTHING;
`

async function main() {
    console.log('seeding...')
    const client = new Client({
        connectionString: process.env.DB_STRING
    })
    await client.connect()
    await client.query(SQL)
    await client.end()
    console.log('done')
}

main()