import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TrainerDashboard from './pages/TrainerDashboard';
import PlanDetails from './pages/PlanDetails';
import UserFeed from './pages/UserFeed';
import TrainerProfile from './pages/TrainerProfile';
import MySubscriptions from './pages/MySubscriptions';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="logo">FitPlanHub</h1>
            <nav className="main-nav">
              {user ? (
                <>
                  <span className="user-info">Welcome, {user.name} ({user.role})</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.href = '/login';
                    }}
                    className="btn btn-link"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="nav-link">Login</a>
                  <a href="/signup" className="nav-link">Sign Up</a>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireRole="trainer">
                  <TrainerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans/:id"
              element={
                <ProtectedRoute>
                  <PlanDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <ProtectedRoute requireRole="user">
                  <UserFeed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainers/:trainerId"
              element={
                <ProtectedRoute>
                  <TrainerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-subscriptions"
              element={
                <ProtectedRoute requireRole="user">
                  <MySubscriptions />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;