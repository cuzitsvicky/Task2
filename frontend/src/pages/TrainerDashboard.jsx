import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { plansAPI } from '../services/api';
import api from '../services/api';
import ConfirmationDialog from '../components/ConfirmationDialog';

const TrainerDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: ''
  });
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await plansAPI.getMyPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.put(`/plans/${editingPlan._id}`, formData);
      } else {
        await api.post('/plans', formData);
      }
      setShowForm(false);
      setEditingPlan(null);
      setFormData({ title: '', description: '', price: '', duration: '' });
      showToast(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!', 'success');
      loadPlans();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving plan', 'error');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      duration: plan.duration
    });
    setShowForm(true);
  };

  const handleDelete = (planId) => {
    setSelectedPlanId(planId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlanId) return;
    
    setShowDeleteConfirm(false);
    try {
      await api.delete(`/plans/${selectedPlanId}`);
      showToast('Plan deleted successfully', 'success');
      loadPlans();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting plan', 'error');
    } finally {
      setSelectedPlanId(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
    setFormData({ title: '', description: '', price: '', duration: '' });
  };

  return (
    <div className="min-h-screen bg-black py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Trainer Dashboard</h1>
          <p className="text-sm sm:text-base text-white">Manage your fitness plans</p>
        </header>

        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">My Fitness Plans</h2>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200 touch-manipulation text-sm sm:text-base"
          >
            Create New Plan
          </button>
        </div>

        {showForm && (
          <div className="bg-black border border-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-white rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-white rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white resize-none text-base"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-white rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Duration (days)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black border border-white rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200 touch-manipulation text-sm sm:text-base"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 py-3 bg-black text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200 border border-white touch-manipulation text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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
                {plan.description && (
                  <p className="text-sm sm:text-base text-white mb-4 line-clamp-3">{plan.description}</p>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-white">₹{plan.price}</span>
                  {plan.duration && (
                    <span className="text-xs sm:text-sm text-white">{plan.duration} days</span>
                  )}
                </div>
                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-black text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200 border border-white text-xs sm:text-sm touch-manipulation"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="px-3 sm:px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200 text-xs sm:text-sm touch-manipulation"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/plans/${plan._id}`)}
                    className="px-3 sm:px-4 py-2 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200 text-xs sm:text-sm touch-manipulation"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
            {plans.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-white text-lg">No plans created yet</p>
              </div>
            )}
          </div>
        )}
      </div>
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedPlanId(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Plan"
        message="Are you sure you want to delete this plan? This action cannot be undone."
      />
    </div>
  );
};

export default TrainerDashboard;
