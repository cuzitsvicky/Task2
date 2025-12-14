import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscriptionsAPI } from '../services/api';

const MySubscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'user') {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      const response = await subscriptionsAPI.getMySubscriptions();
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'user') {
    return <div>Access denied. This page is for users only.</div>;
  }

  return (
    <div className="subscriptions-page">
      <header className="page-header">
        <h1>My Subscriptions</h1>
      </header>

      {loading ? (
        <div className="loading">Loading subscriptions...</div>
      ) : (
        <>
          {subscriptions.length === 0 ? (
            <div className="empty-state">
              <p>You haven't subscribed to any plans yet.</p>
              <Link to="/" className="btn btn-primary">Browse Plans</Link>
            </div>
          ) : (
            <div className="plans-grid">
              {subscriptions.map((subscription) => {
                const plan = subscription.plan;
                return (
                  <div key={subscription._id} className="plan-card subscribed">
                    <div className="subscribed-badge">Subscribed</div>
                    <h3>{plan.title}</h3>
                    <p className="trainer-name">
                      <Link to={`/trainers/${plan.trainer._id}`}>
                        By {plan.trainer.name}
                      </Link>
                    </p>
                    <p className="price">₹{plan.price}</p>
                    <p className="description">{plan.description}</p>
                    <p className="duration">Duration: {plan.duration} days</p>
                    <p className="purchased-date">
                      Purchased: {new Date(subscription.purchasedAt).toLocaleDateString()}
                    </p>
                    <Link to={`/plans/${plan._id}`} className="btn btn-primary">
                      View Plan
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MySubscriptions;
