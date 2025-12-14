import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import TrainerDashboard from './pages/TrainerDashboard';
import PlanDetails from './pages/PlanDetails';
import UserFeed from './pages/UserFeed';
import TrainerProfile from './pages/TrainerProfile';
import MySubscriptions from './pages/MySubscriptions';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './App.css';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-dark-text-muted mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar />

        <main>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Auth />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Auth />} />
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
                <ProtectedRoute>
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
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;