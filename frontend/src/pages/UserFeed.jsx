import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { feedAPI } from '../services/api';

const UserFeed = () => {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'user') {
      loadFeed();
    }
  }, [user]);

  const loadFeed = async () => {
    try {
      const response = await feedAPI.getFeed();
      setFeed(response.data);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'user') {
    return <div>Access denied. This page is for users only.</div>;
  }

  return (
    <div className="feed-page">
      <header className="page-header">
        <h1>My Feed</h1>
        <nav>
          <Link to="/">All Plans</Link>
          <Link to="/my-subscriptions">My Subscriptions</Link>
        </nav>
      </header>

      {loading ? (
        <div className="loading">Loading your feed...</div>
      ) : (
        <>
          {feed.length === 0 ? (
            <div className="empty-state">
              <p>No plans from trainers you follow yet.</p>
              <p>Start following trainers to see their plans here!</p>
              <Link to="/" className="btn btn-primary">Browse All Plans</Link>
            </div>
          ) : (
            <div className="feed-content">
              <h2>Plans from Trainers You Follow</h2>
              <div className="plans-grid">
                {feed.map((plan) => (
                  <div key={plan._id} className="plan-card">
                    <h3>{plan.title}</h3>
                    <p className="trainer-name">
                      <Link to={`/trainers/${plan.trainer._id}`}>
                        {plan.trainer.name}
                      </Link>
                    </p>
                    <p className="price">${plan.price}</p>
                    {plan.isSubscribed && (
                      <span className="subscribed-badge">Subscribed</span>
                    )}
                    <p className="description">{plan.description}</p>
                    <p className="duration">Duration: {plan.duration} days</p>
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
