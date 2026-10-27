import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, getUsers, getTransactions } from '../api';
import './Dashboard.css';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [b, u, t] = await Promise.all([
          getBooks(),
          getUsers(),
          getTransactions(),
        ]);
        setBooks(b);
        setUsers(u);
        setTransactions(t);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const lowStock = books.filter((b) => b.quantity < 2);
  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);

  if (loading) return <p style={{ padding: '2rem' }}>Loading dashboard...</p>;

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">T</span>
          <div>
            <small>Total Titles</small>
            <strong>{books.length}</strong>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">C</span>
          <div>
            <small>Total Copies</small>
            <strong>{totalCopies}</strong>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">L</span>
          <div>
            <small>Low Stock</small>
            <strong>{lowStock.length}</strong>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">M</span>
          <div>
            <small>Members</small>
            <strong>{users.length}</strong>
          </div>
        </div>
      </div>

      <div className="section-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Current Availability</h3>
              <p>Books currently held by the library</p>
            </div>
            <Link className="secondary-btn" to="/books">Manage Books</Link>
          </div>

          <div className="table-wrap">
            {books.length === 0 ? (
              <p className="empty-msg">No books yet. Add some on the Books page.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>ISBN</th>
                    <th>Available</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.isbn}</td>
                      <td>{book.quantity}</td>
                      <td>
                        {book.quantity < 2 ? (
                          <span className="status-low">Low Stock</span>
                        ) : (
                          <span className="status-ok">Available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recent Activity</h3>
              <p>Latest stock transactions</p>
            </div>
          </div>

          <div className="activity-list">
            {transactions.length === 0 ? (
              <p className="empty-msg">No activity yet.</p>
            ) : (
              transactions.slice(0, 8).map((t) => (
                <div key={t.id} className="activity-item">
                  <span className={`dot ${t.type}`}></span>
                  <div>
                    <strong>{t.book_title}</strong>
                    <small>
                      {t.type === 'borrow' ? 'Borrowed' : 'Added'} {t.amount} •{' '}
                      {new Date(t.created_at).toLocaleString()}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;