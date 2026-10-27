const API = 'http://localhost:5000/api';

// ===== BOOKS =====
export const getBooks = () => fetch(`${API}/books`).then(r => r.json());
export const addBook = (book) =>
  fetch(`${API}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  }).then(r => r.json());
export const updateBook = (id, book) =>
  fetch(`${API}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  }).then(r => r.json());
export const deleteBook = (id) =>
  fetch(`${API}/books/${id}`, { method: 'DELETE' }).then(r => r.json());

// ===== USERS =====
export const getUsers = () => fetch(`${API}/users`).then(r => r.json());
export const loginUser = (membershipId) =>
  fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ membershipId }),
  }).then(r => r.json());
export const addUser = (user) =>
  fetch(`${API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }).then(r => r.json());
export const updateUser = (id, user) =>
  fetch(`${API}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }).then(r => r.json());
export const deleteUser = (id) =>
  fetch(`${API}/users/${id}`, { method: 'DELETE' }).then(r => r.json());

// ===== TRANSACTIONS =====
export const getTransactions = () => fetch(`${API}/transactions`).then(r => r.json());
export const addTransaction = (tx) =>
  fetch(`${API}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx),
  }).then(r => r.json());
export const clearTransactions = () =>
  fetch(`${API}/transactions`, { method: 'DELETE' }).then(r => r.json());