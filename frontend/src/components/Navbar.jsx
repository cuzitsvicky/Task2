import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
              FitPlanHub
            </span>
          </Link>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <Link
                  to="/"
                  className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                    isActive('/')
                      ? 'bg-white/20 text-white border border-white/30 shadow-md'
                      : 'text-white hover:scale-105'
                  }`}
                >
                  All Plans
                </Link>
                <Link
                  to="/feed"
                  className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                    isActive('/feed')
                      ? 'bg-white/20 text-white border border-white/30 shadow-md'
                      : 'text-white hover:scale-105'
                  }`}
                >
                  Feed
                </Link>
                {user.role === 'user' && (
                  <Link
                    to="/my-subscriptions"
                    className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                      isActive('/my-subscriptions')
                        ? 'bg-white/20 text-white border border-white/30 shadow-md'
                        : 'text-white hover:scale-105'
                    }`}
                  >
                    Subscriptions
                  </Link>
                )}
                {user.role === 'trainer' && (
                  <Link
                    to="/dashboard"
                    className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                      isActive('/dashboard')
                        ? 'bg-white/20 text-white border border-white/30 shadow-md'
                        : 'text-white hover:scale-105'
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-white/20 flex items-center space-x-2 lg:space-x-3">
                  <span className="text-xs lg:text-sm text-white drop-shadow-md hidden lg:inline">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 lg:px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-xs lg:text-sm font-medium rounded-lg border border-white/30 hover:scale-105 transition-transform duration-200 touch-manipulation"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                    isActive('/')
                      ? 'bg-white/20 text-white border border-white/30 shadow-md'
                      : 'text-white hover:scale-105'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                    isActive('/login')
                      ? 'bg-white/20 text-white border border-white/30 shadow-md'
                      : 'text-white hover:scale-105'
                  }`}
                >
                  Login/SignUp
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 touch-manipulation"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                      isActive('/')
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-white'
                    }`}
                  >
                    All Plans
                  </Link>
                  <Link
                    to="/feed"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                      isActive('/feed')
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-white'
                    }`}
                  >
                    Feed
                  </Link>
                  {user.role === 'user' && (
                    <Link
                      to="/my-subscriptions"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                        isActive('/my-subscriptions')
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'text-white'
                      }`}
                    >
                      Subscriptions
                    </Link>
                  )}
                  {user.role === 'trainer' && (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                        isActive('/dashboard')
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'text-white'
                      }`}
                    >
                      Trainer Dashboard
                    </Link>
                  )}
                  <div className="pt-2 border-t border-white/20">
                    <div className="px-4 py-2 text-sm text-white">{user.name}</div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-lg border border-white/30 touch-manipulation"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                      isActive('/')
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-white'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm touch-manipulation ${
                      isActive('/login')
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-white'
                    }`}
                  >
                    Login/SignUp
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
