const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, author, genre, isbn, quantity } = req.body;
    if (!title || !author || !isbn) {
      return res.status(400).json({ error: 'Title, author and ISBN are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?)',
      [title, author, genre || '', isbn, Number(quantity) || 0]
    );
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, author, genre, isbn, quantity } = req.body;
    const { id } = req.params;
    await pool.query(
      'UPDATE books SET title=?, author=?, genre=?, isbn=?, quantity=? WHERE id=?',
      [title, author, genre, isbn, Number(quantity), id]
    );
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
