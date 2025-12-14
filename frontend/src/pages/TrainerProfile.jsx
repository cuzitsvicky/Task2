import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trainersAPI, followsAPI } from '../services/api';

const TrainerProfile = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trainer, setTrainer] = useState(null);
  const [plans, setPlans] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    loadTrainerProfile();
  }, [trainerId]);

  useEffect(() => {
    if (user?.role === 'user' && trainerId) {
      checkFollowStatus();
    }
  }, [user, trainerId]);

  const loadTrainerProfile = async () => {
    try {
      const response = await trainersAPI.getTrainer(trainerId);
      setTrainer(response.data.trainer);
      setPlans(response.data.plans);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error loading trainer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await followsAPI.checkFollow(trainerId);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!user || user.role !== 'user') return;
    
    setFollowing(true);
    try {
      if (isFollowing) {
        await followsAPI.unfollow(trainerId);
        setIsFollowing(false);
      } else {
        await followsAPI.follow(trainerId);
        setIsFollowing(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating follow status');
    } finally {
      setFollowing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading trainer profile...</div>;
  }

  if (!trainer) {
    return <div>Trainer not found</div>;
  }

  return (
    <div className="trainer-profile-page">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">Back</button>
        <nav>
          <Link to="/">All Plans</Link>
          {user?.role === 'user' && <Link to="/feed">My Feed</Link>}
        </nav>
      </header>

      <div className="trainer-profile-card">
        <h1>{trainer.name}</h1>
        {trainer.bio && <p className="bio">{trainer.bio}</p>}
        {user?.role === 'user' && (
          <button
            onClick={handleFollow}
            className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
            disabled={following}
          >
            {following ? 'Updating...' : isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <div className="trainer-plans-section">
        <h2>Plans by {trainer.name}</h2>
        {plans.length === 0 ? (
          <p className="empty-state">This trainer hasn't created any plans yet.</p>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => (
              <div key={plan._id} className="plan-card">
                <h3>{plan.title}</h3>
                <p className="price">${plan.price}</p>
                <p className="description">{plan.description}</p>
                <p className="duration">Duration: {plan.duration} days</p>
                <Link to={`/plans/${plan._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerProfile;
