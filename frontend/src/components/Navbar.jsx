import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) => (isActive ? 'nav-item active' : 'nav-item');

  const logout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark small">CL</div>
        <div>
          <strong>Community</strong>
          <span>Library</span>
        </div>
      </div>

      <nav className="main-nav">
        <NavLink to="/" className={linkClass} end>Dashboard</NavLink>
        <NavLink to="/books" className={linkClass}>Book Management</NavLink>
        <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
        <NavLink to="/users" className={linkClass}>User Management</NavLink>
      </nav>

      <div className="sidebar-bottom">
        {currentUser && (
          <>
            <div className="logged-user">
              <strong>{currentUser.name}</strong>
              <small>{currentUser.role}</small>
            </div>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </aside>
  );
}

export default Navbar;