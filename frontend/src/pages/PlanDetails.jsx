import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { plansAPI, subscriptionsAPI } from '../services/api';

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    try {
      const response = await plansAPI.getById(id);
      setPlan(response.data);
    } catch (error) {
      console.error('Error loading plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!window.confirm(`Subscribe to this plan for ₹${plan.price}?`)) return;
    
    setSubscribing(true);
    try {
      await subscriptionsAPI.subscribe(id);
      alert('Successfully subscribed!');
      loadPlan();
    } catch (error) {
      alert(error.response?.data?.message || 'Error subscribing to plan');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading plan details...</div>;
  }

  if (!plan) {
    return <div>Plan not found</div>;
  }

  const hasFullAccess = plan.description || plan.isSubscribed || user?.role === 'trainer';

  return (
    <div className="plan-details-page">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">Back</button>
        <nav>
          <Link to="/">All Plans</Link>
          {user?.role === 'user' && <Link to="/feed">My Feed</Link>}
          {user?.role === 'trainer' && <Link to="/dashboard">Dashboard</Link>}
        </nav>
      </header>

      <div className="plan-details-card">
        <h1>{plan.title}</h1>
        <div className="trainer-info">
          <Link to={`/trainers/${plan.trainer?._id}`} className="trainer-link">
            By {plan.trainer?.name}
          </Link>
        </div>
        
        <div className="plan-meta">
          <span className="price">₹{plan.price}</span>
          {hasFullAccess && <span className="duration">{plan.duration} days</span>}
        </div>

        {hasFullAccess ? (
          <>
            <div className="description">
              <h3>Description</h3>
              <p>{plan.description}</p>
            </div>
            {plan.isSubscribed && (
              <div className="subscribed-badge">You are subscribed to this plan</div>
            )}
            {user?.role === 'user' && !plan.isSubscribed && (
              <button
                onClick={handleSubscribe}
                className="btn btn-primary"
                disabled={subscribing}
              >
                {subscribing ? 'Subscribing...' : 'Subscribe to Plan'}
              </button>
            )}
          </>
        ) : (
          <>
            <div className="preview-message">
              <p>Subscribe to view full plan details and access the complete fitness program.</p>
            </div>
            {user?.role === 'user' && (
              <button
                onClick={handleSubscribe}
                className="btn btn-primary"
                disabled={subscribing}
              >
                {subscribing ? 'Subscribing...' : `Subscribe for ₹${plan.price}`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlanDetails;
