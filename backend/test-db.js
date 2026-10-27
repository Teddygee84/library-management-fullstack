require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [rows] = await conn.execute('SELECT COUNT(*) AS count FROM books');
    console.log('✅ Connected to MySQL. Books count:', rows[0].count);
    await conn.end();
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
  }
})();
