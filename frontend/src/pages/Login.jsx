import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, addUser } from '../api';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [mode, setMode] = useState('login');

  const [loginForm, setLoginForm] = useState({ membershipId: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    membershipId: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(loginForm.membershipId.trim());
      if (user.error) return alert(user.error);
      setCurrentUser(user);      // ← context update (triggers App re-render)
      navigate('/');
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.name.trim() || !registerForm.membershipId.trim()) {
      return alert('Name and Membership ID are required');
    }
    try {
      const res = await addUser({
        name: registerForm.name.trim(),
        membershipId: registerForm.membershipId.trim(),
        role: 'Member',
        password: registerForm.password || '',
      });
      if (res.error) return alert(res.error);
      setCurrentUser(res);       // ← context update
      navigate('/');
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-mark">CL</div>
        <h1>Community Library</h1>
        <p className="auth-sub">Library Management System</p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>Membership ID</label>
            <input
              placeholder="e.g. 1"
              value={loginForm.membershipId || ''}
              onChange={(e) => setLoginForm({ ...loginForm, membershipId: e.target.value })}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={loginForm.password || ''}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button className="primary-btn full" type="submit">Sign In</button>
            <div className="auth-hint">
              <strong>Demo admin:</strong> Membership ID <strong>1</strong> / password <strong>Dash</strong>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <label>Full Name</label>
            <input
              placeholder="Your name"
              value={registerForm.name || ''}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              required
            />
            <label>Membership ID</label>
            <input
              placeholder="Choose a unique ID"
              value={registerForm.membershipId || ''}
              onChange={(e) => setRegisterForm({ ...registerForm, membershipId: e.target.value })}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Choose a password"
              value={registerForm.password || ''}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
            <button className="primary-btn full" type="submit">Create Account</button>
            <p className="auth-hint">
              New accounts are created as <strong>Members</strong>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;