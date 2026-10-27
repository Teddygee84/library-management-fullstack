import { useState, useEffect } from 'react';
import { getUsers, addUser, updateUser, deleteUser } from '../api';
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const emptyForm = { name: '', membershipId: '', role: 'Member', password: '' };
  const [form, setForm] = useState(emptyForm);

  const isAdmin = currentUser?.role === 'Admin';
  const isLibrarian = currentUser?.role === 'Librarian';
  const isMember = currentUser?.role === 'Member';

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    const stored = localStorage.getItem('currentUser');
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  // Member: blocked from this page
  if (isMember) {
    return (
      <div className="page">
        <div className="panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>
            Members cannot access user management.
          </p>
        </div>
      </div>
    );
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) ||
      u.membership_id?.toLowerCase().includes(q);
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openAdd = () => {
    if (!isAdmin) return alert('Only Admins can add users');
    setForm(emptyForm);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    if (!isAdmin) return alert('Only Admins can edit users');
    setForm({
      name: user.name,
      membershipId: user.membership_id,
      role: user.role,
      password: '',
    });
    setEditing(user.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setEditing(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.membershipId.trim()) {
      return alert('Name and Membership ID are required');
    }
    try {
      if (editing) {
        await updateUser(editing, form);
        if (currentUser.id === editing) {
          const updated = { ...currentUser, name: form.name, membership_id: form.membershipId, role: form.role };
          setCurrentUser(updated);
          localStorage.setItem('currentUser', JSON.stringify(updated));
        }
      } else {
        const res = await addUser(form);
        if (res.error) return alert(res.error);
      }
      await loadUsers();
      closeModal();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return alert('Only Admins can delete users');
    if (id === currentUser.id) return alert("You can't delete yourself");
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading users...</p>;

  return (
    <>
      <div className="page-actions">
        <div>
          <h3>User Management</h3>
          <p>Manage library members and administrator accounts.</p>
        </div>
        <div className="page-actions-right">
          {isAdmin && (
            <button className="primary-btn" onClick={openAdd}>Add New User</button>
          )}
        </div>
      </div>

      {isLibrarian && (
        <div className="panel" style={{ background: '#fff8e1', borderLeft: '4px solid #f39c12', marginBottom: '1rem' }}>
          <p style={{ color: '#b7791f' }}>
            ⚠ <strong>Read-only mode.</strong> Librarians can view users but not modify them.
          </p>
        </div>
      )}

      <div className="panel">
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All roles</option>
            <option>Admin</option>
            <option>Librarian</option>
            <option>Member</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Role</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={isAdmin ? 4 : 3}>No users match.</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.membership_id}</td>
                    <td><span className="role-tag">{u.role}</span></td>
                    {isAdmin && (
                      <td>
                        <button className="icon-btn edit" onClick={() => openEdit(u)}>Edit</button>
                        <button className="icon-btn delete" onClick={() => handleDelete(u.id)}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && isAdmin && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-card small-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{editing ? 'Edit User' : 'Add New User'}</h3>
                <p>Enter user details.</p>
              </div>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="field full-field">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="field full-field">
                <label>Membership ID</label>
                <input name="membershipId" value={form.membershipId} onChange={handleChange} />
              </div>
              <div className="field full-field">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option>Member</option>
                  <option>Librarian</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className="field full-field">
                <label>Password</label>
                <input name="password" type="password" placeholder="Optional" value={form.password} onChange={handleChange} />
              </div>
              <div className="modal-actions full-field">
                <button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="primary-btn">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;