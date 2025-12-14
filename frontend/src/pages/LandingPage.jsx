import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { plansAPI } from '../services/api';

const LandingPage = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, [user]);

  const loadPlans = async () => {
    try {
      const response = await plansAPI.getAll();
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="landing-page">
        <div className="hero">
          <h1>FitPlanHub</h1>
          <p>Your destination for professional fitness plans</p>
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <header className="page-header">
        <h1>All Fitness Plans</h1>
        <nav>
          <Link to="/feed">My Feed</Link>
          {user.role === 'trainer' && <Link to="/dashboard">Dashboard</Link>}
          {user.role === 'user' && <Link to="/my-subscriptions">My Subscriptions</Link>}
        </nav>
      </header>

      {loading ? (
        <div className="loading">Loading plans...</div>
      ) : (
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan._id} className="plan-card">
              <h3>{plan.title}</h3>
              <p className="trainer-name">By {plan.trainer?.name}</p>
              <p className="price">${plan.price}</p>
              {plan.description ? (
                <>
                  <p className="description">{plan.description}</p>
                  <p className="duration">Duration: {plan.duration} days</p>
                  <Link to={`/plans/${plan._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </>
              ) : (
                <>
                  <p className="preview-note">Subscribe to view full details</p>
                  <Link to={`/plans/${plan._id}`} className="btn btn-secondary">
                    View Preview
                  </Link>
                </>
              )}
            </div>
          ))}
          {plans.length === 0 && (
            <p className="empty-state">No plans available yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
