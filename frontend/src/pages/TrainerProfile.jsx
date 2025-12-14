import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
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
  const { showToast } = useToast();

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
        showToast('Successfully unfollowed trainer', 'success');
      } else {
        await followsAPI.follow(trainerId);
        setIsFollowing(true);
        showToast('Successfully followed trainer', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating follow status', 'error');
    } finally {
      setFollowing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading trainer profile...</p>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">Trainer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 px-4 py-2 bg-black text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200 border border-white touch-manipulation text-sm sm:text-base"
        >
          ← Back
        </button>

        <div className="bg-black border border-white rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">{trainer.name}</h1>
          {trainer.bio && (
            <p className="text-sm sm:text-base lg:text-lg text-white mb-4 sm:mb-6 max-w-2xl mx-auto px-4">{trainer.bio}</p>
          )}
          {user?.role === 'user' && (
            <button
              onClick={handleFollow}
              className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
                isFollowing
                  ? 'bg-black text-white border border-white hover:scale-105'
                  : 'bg-white text-black hover:scale-105'
              }`}
              disabled={following}
            >
              {following ? 'Updating...' : isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">Plans by {trainer.name}</h2>
          {plans.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-black rounded-xl border border-white">
              <p className="text-sm sm:text-base lg:text-lg text-white">This trainer hasn't created any plans yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-black border border-white rounded-xl p-4 sm:p-6 flex flex-col"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{plan.title}</h3>
                  <p className="text-xl sm:text-2xl font-bold text-white mb-4">₹{plan.price}</p>
                  {plan.description && (
                    <p className="text-white mb-3 line-clamp-3">{plan.description}</p>
                  )}
                  {plan.duration && (
                    <p className="text-sm text-white mb-4">
                      Duration: {plan.duration} days
                    </p>
                  )}
                  <div className="mt-auto">
                    <Link
                      to={`/plans/${plan._id}`}
                      className="block w-full text-center py-2 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200 touch-manipulation text-sm sm:text-base"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
