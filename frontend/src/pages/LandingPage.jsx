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
      <div className="min-h-screen bg-black flex items-center justify-center py-8 px-4">
        <div className="text-center space-y-6 sm:space-y-8 px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            FitPlanHub
          </h1>
          <p className="text-lg sm:text-xl text-white px-4">
            Your destination for professional fitness plans
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200 touch-manipulation text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">All Fitness Plans</h1>
          <p className="text-sm sm:text-base text-white">Discover and subscribe to professional fitness plans</p>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-black border border-white rounded-xl p-4 sm:p-6 flex flex-col"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{plan.title}</h3>
                <p className="text-xs sm:text-sm text-white mb-3">
                  By {plan.trainer?.name}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white mb-4">₹{plan.price}</p>
                {plan.description && (
                  <p className="text-white mb-3 line-clamp-3">{plan.description}</p>
                )}
                {plan.duration && (
                  <p className="text-sm text-white mb-4">
                    Duration: {plan.duration} days
                  </p>
                )}
                {!plan.description && (
                  <p className="text-yellow-400 italic mb-4 text-sm">
                    Subscribe to view full details
                  </p>
                )}
                <div className="mt-auto">
                  <Link
                    to={`/plans/${plan._id}`}
                    className="block w-full text-center py-2 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200 touch-manipulation text-sm sm:text-base"
                  >
                    {plan.description ? 'View Details' : 'View Preview'}
                  </Link>
                </div>
              </div>
            ))}
            {plans.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-white text-lg">No plans available yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
