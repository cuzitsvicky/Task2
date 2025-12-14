import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          FitPlanHub
        </Link>
        
        <div className="navbar-menu-center">
          <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/" className={`navbar-link ${isActive('/')}`}>
                All Plans
              </Link>
              <Link to="/feed" className={`navbar-link ${isActive('/feed')}`}>
                Feed
              </Link>
              {user.role === 'user' && (
                <Link to="/my-subscriptions" className={`navbar-link ${isActive('/my-subscriptions')}`}>
                  Subscriptions
                </Link>
              )}
              {user.role === 'trainer' && (
                <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard')}`}>
                  Trainer Dashboard
                </Link>
              )}
              <div className="navbar-user">
                <span className="navbar-user-name">{user.name}</span>
                <button onClick={handleLogout} className="navbar-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className={`navbar-link ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/login" className={`navbar-link ${isActive('/login')}`}>
                Login/SignUp
              </Link>
            </>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

