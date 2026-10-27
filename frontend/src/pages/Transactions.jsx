import { useState, useEffect } from 'react';
import { getBooks, getTransactions, addTransaction, clearTransactions } from '../api';
import './Transactions.css';

function Transactions() {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookId, setBookId] = useState('');
  const [type, setType] = useState('add');
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  // Read currentUser from localStorage (login is still tracked locally)
  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [booksData, txData] = await Promise.all([getBooks(), getTransactions()]);
      setBooks(booksData);
      setTransactions(txData);
    } catch (err) {
      console.error('Error loading:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookId) return alert('Please select a book');

    const amount = Number(qty);
    if (amount <= 0) return alert('Quantity must be greater than 0');

    try {
      const res = await addTransaction({
        bookId: Number(bookId),
        type,
        amount,
        note,
        userId: currentUser?.id || null,
      });

      if (res.error) return alert(res.error);

      await loadData();
      setBookId('');
      setType('add');
      setQty(1);
      setNote('');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear all transaction history? This cannot be undone.')) return;
    try {
      await clearTransactions();
      await loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading transactions...</p>;

  return (
    <>
      <div className="page-actions">
        <div>
          <h3>Stock Transactions</h3>
          <p>Add new stock or record borrowed copies.</p>
        </div>
      </div>

      <div className="transaction-layout">
        <div className="panel">
          <h3 className="panel-title">Record Transaction</h3>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field full-field">
              <label>Book</label>
              <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
                <option value="">-- Select Book --</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.quantity} in stock)
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Transaction Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="add">Add Stock</option>
                <option value="borrow">Borrow / Deduct</option>
              </select>
            </div>

            <div className="field">
              <label>Quantity</label>
              <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>

            <div className="field full-field">
              <label>Note</label>
              <input
                type="text"
                placeholder="Optional note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button className="primary-btn full-field" type="submit">
              Save Transaction
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Transaction History</h3>
              <p>Complete stock movement log</p>
            </div>
            {transactions.length > 0 && (
              <button className="danger-outline" onClick={handleClear}>Clear History</button>
            )}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Qty.</th>
                  <th>Note</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="6">No transactions yet.</td></tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id}>
                      <td className="small-td">{new Date(t.created_at).toLocaleString()}</td>
                      <td>{t.book_title}</td>
                      <td>
                        <span className={`tx-badge ${t.type}`}>
                          {t.type === 'borrow' ? 'Borrow' : 'Add'}
                        </span>
                      </td>
                      <td>{t.amount}</td>
                      <td>{t.note || '—'}</td>
                      <td>{t.user_name || 'Guest'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Transactions;