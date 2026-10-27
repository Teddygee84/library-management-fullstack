const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, b.title AS book_title, u.name AS user_name
      FROM transactions t
      JOIN books b ON b.id = t.book_id
      LEFT JOIN users u ON u.id = t.user_id
      ORDER BY t.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { bookId, type, amount, note, userId } = req.body;

    if (!bookId || !type || !amount) {
      return res.status(400).json({ error: 'Book, type, and amount are required' });
    }
    if (!['add', 'borrow'].includes(type)) {
      return res.status(400).json({ error: 'Type must be add or borrow' });
    }

    await conn.beginTransaction();

    const [bookRows] = await conn.query('SELECT * FROM books WHERE id = ?', [bookId]);
    if (bookRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Book not found' });
    }
    const book = bookRows[0];

    if (type === 'borrow' && book.quantity < amount) {
      await conn.rollback();
      return res.status(400).json({ error: `Not enough stock. Only ${book.quantity} available.` });
    }

    const newQty = type === 'add' ? book.quantity + Number(amount) : book.quantity - Number(amount);
    await conn.query('UPDATE books SET quantity = ? WHERE id = ?', [newQty, bookId]);

    const [result] = await conn.query(
      'INSERT INTO transactions (book_id, user_id, type, amount, note) VALUES (?, ?, ?, ?, ?)',
      [bookId, userId || null, type, amount, note || '']
    );

    await conn.commit();

    const [rows] = await conn.query(`
      SELECT t.*, b.title AS book_title, u.name AS user_name
      FROM transactions t
      JOIN books b ON b.id = t.book_id
      LEFT JOIN users u ON u.id = t.user_id
      WHERE t.id = ?
    `, [result.insertId]);

    res.status(201).json(rows[0]);
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM transactions');
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
