import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(loginEmail, loginPassword);
    
    if (result.success) {
      navigate('/feed');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signup(name, email, password, role);
    
    if (result.success) {
      navigate('/feed');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setError('');
    setLoginEmail('');
    setLoginPassword('');
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
  };

  return (
    <div className="auth-page glass-background">
      <div className="auth-card glass-card">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={switchToLogin}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={switchToSignup}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="glass-input"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="glass-input"
                />
              </div>
              <button type="submit" className="btn btn-primary glass-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="auth-link">
              Don't have an account?{' '}
              <span className="auth-link-text" onClick={switchToSignup}>
                Sign up
              </span>
            </p>
          </>
        ) : (
          <>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="glass-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-input"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="glass-input"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="glass-input">
                  <option value="user">User</option>
                  <option value="trainer">Trainer</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary glass-button" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
            <p className="auth-link">
              Already have an account?{' '}
              <span className="auth-link-text" onClick={switchToLogin}>
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;

