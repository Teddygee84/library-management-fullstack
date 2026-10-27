const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { membershipId } = req.body;
    if (!membershipId) return res.status(400).json({ error: 'Membership ID required' });
    const [rows] = await pool.query('SELECT * FROM users WHERE membership_id = ?', [membershipId]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, membershipId, role, password } = req.body;
    if (!name || !membershipId) {
      return res.status(400).json({ error: 'Name and Membership ID required' });
    }
    const [result] = await pool.query(
      'INSERT INTO users (name, membership_id, role, password) VALUES (?, ?, ?, ?)',
      [name, membershipId, role || 'Member', password || '']
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Membership ID already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, membershipId, role, password } = req.body;
    const { id } = req.params;
    await pool.query(
      'UPDATE users SET name=?, membership_id=?, role=?, password=? WHERE id=?',
      [name, membershipId, role, password || '', id]
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
