import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { subscriptionsAPI } from '../services/api';

const MySubscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unsubscribing, setUnsubscribing] = useState({});
  const { showToast } = useToast();

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

  const handleUnsubscribe = async (planId, planTitle) => {
    if (!window.confirm(`Are you sure you want to unsubscribe from "${planTitle}"?`)) return;
    
    setUnsubscribing(prev => ({ ...prev, [planId]: true }));
    try {
      const response = await subscriptionsAPI.unsubscribe(planId);
      showToast('Successfully unsubscribed from plan', 'success');
      loadSubscriptions();
    } catch (error) {
      console.error('Unsubscribe error:', error);
      console.error('Error response:', error.response);
      showToast(error.response?.data?.message || error.message || 'Error unsubscribing from plan', 'error');
    } finally {
      setUnsubscribing(prev => ({ ...prev, [planId]: false }));
    }
  };

  if (user?.role !== 'user') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">Access denied. This page is for users only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Subscriptions</h1>
          <p className="text-white">Your subscribed fitness plans</p>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading subscriptions...</p>
          </div>
        ) : (
          <>
            {subscriptions.length === 0 ? (
              <div className="text-center py-12 bg-black rounded-xl border border-white">
                <p className="text-white mb-4">You haven't subscribed to any plans yet.</p>
                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-200"
                >
                  Browse Plans
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((subscription) => {
                  const plan = subscription.plan;
                  return (
                    <div
                      key={subscription._id}
                      className="bg-black border-2 border-white rounded-xl p-6 relative flex flex-col"
                    >
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Subscribed
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                      <p className="text-sm text-white mb-3">
                        By {plan.trainer?.name}
                      </p>
                      <p className="text-2xl font-bold text-white mb-4">₹{plan.price}</p>
                      {plan.description && (
                        <p className="text-white mb-3 line-clamp-3">{plan.description}</p>
                      )}
                      {plan.duration && (
                        <p className="text-sm text-white mb-2">
                          Duration: {plan.duration} days
                        </p>
                      )}
                      <p className="text-xs text-white mb-4">
                        Purchased: {new Date(subscription.purchasedAt).toLocaleDateString()}
                      </p>
                      <div className="mt-auto space-y-2">
                        <Link
                          to={`/plans/${plan._id}`}
                          className="block w-full text-center py-2 bg-white text-black font-semibold rounded-lg hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-200"
                        >
                          View Plan
                        </Link>
                        <button
                          onClick={() => handleUnsubscribe(plan._id, plan.title)}
                          disabled={unsubscribing[plan._id]}
                          className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {unsubscribing[plan._id] ? 'Unsubscribing...' : 'Unsubscribe'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;
