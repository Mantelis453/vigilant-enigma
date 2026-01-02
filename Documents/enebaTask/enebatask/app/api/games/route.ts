import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import Fuse from 'fuse.js';

// 1. MUST BE NAMED "GET" AND MUST BE EXPORTED
export async function GET(request: Request) {
  try {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        platform TEXT,
        region TEXT,
        price REAL,
        oldPrice REAL,
        cashback REAL,
        image TEXT
      )
    `);

    // Seed if empty
    const count = await db.get('SELECT COUNT(*) as count FROM games');
    if (count.count === 0) {
      await db.run(`INSERT INTO games (title, platform, region, price, oldPrice, cashback, image) VALUES 
        /* Split Fiction (Using "It Takes Two" art as a proxy since Split Fiction is a fictional game in the prompt) */
        ('Split Fiction', 'EA App Key (PC)', 'GLOBAL', 40.93, 49.99, 4.50, 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Split_Fiction_cover_art.jpg/250px-Split_Fiction_cover_art.jpg'),
        ('Split Fiction', 'Xbox Series X|S', 'EUROPE', 34.14, 49.99, 3.76, 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Split_Fiction_cover_art.jpg/250px-Split_Fiction_cover_art.jpg'),
        ('Split Fiction', 'Xbox Series X|S', 'GLOBAL', 35.15, 49.99, 3.87, 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Split_Fiction_cover_art.jpg/250px-Split_Fiction_cover_art.jpg'),
        ('Split Fiction', 'Nintendo Switch 2', 'EUROPE', 36.25, 49.99, 3.99, 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Split_Fiction_cover_art.jpg/250px-Split_Fiction_cover_art.jpg'),
    
        /* FIFA 23 */
        ('FIFA 23', 'EA App Key (PC)', 'GLOBAL', 25.50, 69.99, 2.10, 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/FIFA_23_Cover.jpg/250px-FIFA_23_Cover.jpg'),
        ('FIFA 23', 'Xbox Live Key', 'EUROPE', 22.10, 59.99, 1.95, 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/FIFA_23_Cover.jpg/250px-FIFA_23_Cover.jpg'),
        ('FIFA 23', 'Nintendo eShop Key', 'EUROPE', 19.99, 39.99, 1.50, 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/FIFA_23_Cover.jpg/250px-FIFA_23_Cover.jpg'),
        ('FIFA 23 Ultimate Edition', 'PC', 'GLOBAL', 45.00, 89.99, 5.20, 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/FIFA_23_Cover.jpg/250px-FIFA_23_Cover.jpg'),
    
        /* Red Dead Redemption 2 */
        ('Red Dead Redemption 2', 'Rockstar Key (PC)', 'EUROPE', 19.75, 59.99, 1.45, 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg'),
        ('Red Dead Redemption 2', 'Xbox Live Key', 'GLOBAL', 24.99, 59.99, 2.05, 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg'),
        ('Red Dead Redemption 2: Story Mode', 'PC', 'GLOBAL', 14.50, 39.99, 1.10, 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg'),
        ('Red Dead Redemption 2 Ultimate', 'Xbox', 'EUROPE', 32.99, 99.99, 3.15, 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg')
      `);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const allGames = await db.all("SELECT * FROM games");

    const games = await db.all(
      "SELECT * FROM games WHERE title LIKE ?",
      [`%${search}%`]
    );

    if (search) {
      const fuse = new Fuse(allGames, {
        keys: ['title'],
        threshold: 0.4, // 0.0 is perfect match, 1.0 matches everything
      });
    
      const results = fuse.search(search);
      // Fuse returns an array of objects: { item: game, refIndex: 0 }
      return NextResponse.json(results.map(r => r.item));
    }

    return NextResponse.json(games);
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}