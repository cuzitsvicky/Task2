import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { feedAPI, plansAPI } from '../services/api';

const UserFeed = () => {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFeed();
    }
  }, [user]);

  const loadFeed = async () => {
    try {
      if (user?.role === 'user') {
        const response = await feedAPI.getFeed();
        setFeed(response.data);
      } else if (user?.role === 'trainer') {
        // For trainers, show all plans
        const response = await plansAPI.getAll();
        setFeed(response.data || []);
      }
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feed-page">
      <header className="page-header">
        <h1>{user?.role === 'trainer' ? 'All Plans' : 'My Feed'}</h1>
      </header>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {feed.length === 0 ? (
            <div className="empty-state">
              {user?.role === 'user' ? (
                <>
                  <p>No plans from trainers you follow yet.</p>
                  <p>Start following trainers to see their plans here!</p>
                  <Link to="/" className="btn btn-primary">Browse All Plans</Link>
                </>
              ) : (
                <>
                  <p>No plans available yet.</p>
                  <Link to="/" className="btn btn-primary">Browse All Plans</Link>
                </>
              )}
            </div>
          ) : (
            <div className="feed-content">
              <h2>
                {user?.role === 'trainer' 
                  ? 'All Fitness Plans' 
                  : 'Plans from Trainers You Follow'}
              </h2>
              <div className="plans-grid">
                {feed.map((plan) => (
                  <div key={plan._id} className="plan-card">
                    <h3>{plan.title}</h3>
                    <p className="trainer-name">
                      <Link to={`/trainers/${plan.trainer._id}`}>
                        {plan.trainer.name}
                      </Link>
                    </p>
                    <p className="price">₹{plan.price}</p>
                    {plan.isSubscribed && (
                      <span className="subscribed-badge">Subscribed</span>
                    )}
                    {plan.description && (
                      <p className="description">{plan.description}</p>
                    )}
                    {plan.duration && (
                      <p className="duration">Duration: {plan.duration} days</p>
                    )}
                    <Link to={`/plans/${plan._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserFeed;
