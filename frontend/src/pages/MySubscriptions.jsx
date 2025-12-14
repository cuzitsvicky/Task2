import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { subscriptionsAPI } from '../services/api';
import ConfirmationDialog from '../components/ConfirmationDialog';

const MySubscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unsubscribing, setUnsubscribing] = useState({});
  const { showToast } = useToast();
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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

  const handleUnsubscribe = (planId, planTitle) => {
    setSelectedPlan({ id: planId, title: planTitle });
    setShowUnsubscribeConfirm(true);
  };

  const confirmUnsubscribe = async () => {
    if (!selectedPlan) return;
    
    setShowUnsubscribeConfirm(false);
    setUnsubscribing(prev => ({ ...prev, [selectedPlan.id]: true }));
    try {
      const response = await subscriptionsAPI.unsubscribe(selectedPlan.id);
      showToast('Successfully unsubscribed from plan', 'success');
      loadSubscriptions();
    } catch (error) {
      console.error('Unsubscribe error:', error);
      console.error('Error response:', error.response);
      showToast(error.response?.data?.message || error.message || 'Error unsubscribing from plan', 'error');
    } finally {
      setUnsubscribing(prev => ({ ...prev, [selectedPlan.id]: false }));
      setSelectedPlan(null);
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
    <div className="min-h-screen bg-black py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">My Subscriptions</h1>
          <p className="text-sm sm:text-base text-white">Your subscribed fitness plans</p>
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
                  className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200 touch-manipulation text-sm sm:text-base"
                >
                  Browse Plans
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {subscriptions.map((subscription) => {
                  const plan = subscription.plan;
                  return (
                    <div
                      key={subscription._id}
                      className="bg-black border-2 border-white rounded-xl p-4 sm:p-6 relative flex flex-col"
                    >
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
                        Subscribed
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{plan.title}</h3>
                      <p className="text-xs sm:text-sm text-white mb-3">
                        By {plan.trainer?.name}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-white mb-4">₹{plan.price}</p>
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
                          className="block w-full text-center py-2 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200 touch-manipulation text-sm sm:text-base"
                        >
                          View Plan
                        </Link>
                        <button
                          onClick={() => handleUnsubscribe(plan._id, plan.title)}
                          disabled={unsubscribing[plan._id]}
                          className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
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
      <ConfirmationDialog
        isOpen={showUnsubscribeConfirm}
        onClose={() => {
          setShowUnsubscribeConfirm(false);
          setSelectedPlan(null);
        }}
        onConfirm={confirmUnsubscribe}
        title="Unsubscribe from Plan"
        message={`Are you sure you want to unsubscribe from "${selectedPlan?.title}"?`}
      />
    </div>
  );
};

export default MySubscriptions;
