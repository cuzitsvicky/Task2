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
    <div className="min-h-screen bg-dark-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {user?.role === 'trainer' ? 'All Plans' : 'My Feed'}
          </h1>
          <p className="text-white">
            {user?.role === 'trainer' 
              ? 'Browse all available fitness plans' 
              : 'Plans from trainers you follow'}
          </p>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        ) : (
          <>
            {feed.length === 0 ? (
              <div className="text-center py-12 bg-black rounded-xl border border-white">
                {user?.role === 'user' ? (
                  <>
                    <p className="text-white mb-2">No plans from trainers you follow yet.</p>
                    <p className="text-white mb-4">Start following trainers to see their plans here!</p>
                    <Link
                      to="/"
                      className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-200"
                    >
                      Browse All Plans
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-white mb-4">No plans available yet.</p>
                    <Link
                      to="/"
                      className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-200"
                    >
                      Browse All Plans
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {user?.role === 'trainer' 
                    ? 'All Fitness Plans' 
                    : 'Plans from Trainers You Follow'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {feed.map((plan) => (
                    <div
                      key={plan._id}
                      className="bg-black border border-white rounded-xl p-6 relative flex flex-col"
                    >
                      {plan.isSubscribed && (
                        <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Subscribed
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                      <p className="text-sm text-white mb-3">
                        {plan.trainer?.name}
                      </p>
                      <p className="text-2xl font-bold text-white mb-4">₹{plan.price}</p>
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
                          className="block w-full text-center py-2 bg-white text-black font-semibold rounded-lg hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserFeed;
