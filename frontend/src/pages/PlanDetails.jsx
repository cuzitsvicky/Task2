import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { plansAPI, subscriptionsAPI, followsAPI } from '../services/api';

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [following, setFollowing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadPlan();
  }, [id]);

  useEffect(() => {
    if (user?.role === 'user' && plan?.trainer?._id) {
      checkFollowStatus();
    }
  }, [user, plan]);

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

  const checkFollowStatus = async () => {
    try {
      const response = await followsAPI.checkFollow(plan.trainer._id);
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
        await followsAPI.unfollow(plan.trainer._id);
        setIsFollowing(false);
        showToast('Successfully unfollowed trainer', 'success');
      } else {
        await followsAPI.follow(plan.trainer._id);
        setIsFollowing(true);
        showToast('Successfully followed trainer', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating follow status', 'error');
    } finally {
      setFollowing(false);
    }
  };

  const handleSubscribe = async () => {
    if (!window.confirm(`Subscribe to this plan for ₹${plan.price}?`)) return;
    
    setSubscribing(true);
    try {
      await subscriptionsAPI.subscribe(id);
      showToast('Successfully subscribed!', 'success');
      loadPlan();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error subscribing to plan', 'error');
    } finally {
      setSubscribing(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!window.confirm(`Are you sure you want to unsubscribe from "${plan.title}"?`)) return;
    
    setUnsubscribing(true);
    try {
      const response = await subscriptionsAPI.unsubscribe(id);
      showToast('Successfully unsubscribed from plan', 'success');
      loadPlan();
    } catch (error) {
      console.error('Unsubscribe error:', error);
      console.error('Error response:', error.response);
      showToast(error.response?.data?.message || error.message || 'Error unsubscribing from plan', 'error');
    } finally {
      setUnsubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">Plan not found</p>
        </div>
      </div>
    );
  }

  const hasFullAccess = plan.description || plan.isSubscribed || user?.role === 'trainer';

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-200 border border-white"
        >
          ← Back
        </button>

        <div className="bg-black border border-white rounded-xl p-8">
          <h1 className="text-4xl font-bold text-white mb-4">{plan.title}</h1>
          <div className="mb-6 flex items-center gap-3">
            <Link
              to={`/trainers/${plan.trainer?._id}`}
              className="text-white text-lg hover:text-yellow-400 transition-colors"
            >
              {plan.trainer?.name}
            </Link>
            {user?.role === 'user' && plan.trainer?._id && (
              <button
                onClick={handleFollow}
                disabled={following}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  isFollowing
                    ? 'bg-black text-white border border-white hover:bg-white hover:text-black'
                    : 'bg-white text-black hover:bg-black hover:text-white hover:border hover:border-white'
                }`}
              >
                {following ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-6 mb-6">
            <span className="text-3xl font-bold text-white">₹{plan.price}</span>
            {hasFullAccess && (
              <span className="text-white">{plan.duration} days</span>
            )}
          </div>

          {hasFullAccess ? (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                <p className="text-white leading-relaxed">{plan.description}</p>
              </div>
              {plan.isSubscribed && (
                <div className="mb-6 space-y-3">
                  <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg">
                    You are subscribed to this plan
                  </div>
                  {user?.role === 'user' && (
                    <button
                      onClick={handleUnsubscribe}
                      className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={unsubscribing}
                    >
                      {unsubscribing ? 'Unsubscribing...' : 'Unsubscribe from Plan'}
                    </button>
                  )}
                </div>
              )}
              {user?.role === 'user' && !plan.isSubscribed && (
                <button
                  onClick={handleSubscribe}
                  className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={subscribing}
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe to Plan'}
                </button>
              )}
            </>
          ) : (
            <>
              <div className="mb-6 bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 px-4 py-3 rounded-lg">
                <p>Subscribe to view full plan details and access the complete fitness program.</p>
              </div>
              {user?.role === 'user' && (
                <button
                  onClick={handleSubscribe}
                  className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={subscribing}
                >
                  {subscribing ? 'Subscribing...' : `Subscribe for ₹${plan.price}`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
