
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running ✅' });
});

app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
