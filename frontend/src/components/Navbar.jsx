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
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              FitPlanHub
            </span>
          </Link>
          
          {/* Navigation Menu */}
          <div className="flex items-center space-x-1">
            {user ? (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                    isActive('/')
                      ? 'bg-white/20 text-white border border-white/30 shadow-md'
                      : 'text-white hover:bg-white/10 hover:border hover:border-white/20'
                  }`}
                >
                  All Plans
                </Link>
                <Link
                  to="/feed"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                    isActive('/feed')
                      ? 'bg-white/20 text-white border border-white/30 shadow-md'
                      : 'text-white hover:bg-white/10 hover:border hover:border-white/20'
                  }`}
                >
                  Feed
                </Link>
                {user.role === 'user' && (
                  <Link
                    to="/my-subscriptions"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                      isActive('/my-subscriptions')
                        ? 'bg-white/20 text-white border border-white/30 shadow-md'
                        : 'text-white hover:bg-white/10 hover:border hover:border-white/20'
                    }`}
                  >
                    Subscriptions
                  </Link>
                )}
                {user.role === 'trainer' && (
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                      isActive('/dashboard')
                        ? 'bg-white/20 text-white border border-white/30 shadow-md'
                        : 'text-white hover:bg-white/10 hover:border hover:border-white/20'
                    }`}
                  >
                    Trainer Dashboard
                  </Link>
                )}
                <div className="ml-4 pl-4 border-l border-white/20 flex items-center space-x-3">
                  <span className="text-sm text-white drop-shadow-md">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-lg border border-white/30 hover:bg-white/30 hover:shadow-md transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                    isActive('/')
                      ? 'bg-white/20 text-white border border-white/30 shadow-md'
                      : 'text-white hover:bg-white/10 hover:border hover:border-white/20'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                    isActive('/login')
                      ? 'bg-white/20 text-white border border-white/30 shadow-md'
                      : 'text-white hover:bg-white/10 hover:border hover:border-white/20'
                  }`}
                >
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
