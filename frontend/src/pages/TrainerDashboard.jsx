import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { plansAPI } from '../services/api';
import api from '../services/api';

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
      loadPlans();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving plan');
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

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await api.delete(`/plans/${planId}`);
      loadPlans();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting plan');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
    setFormData({ title: '', description: '', price: '', duration: '' });
  };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Trainer Dashboard</h1>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>My Fitness Plans</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Create New Plan
          </button>
        </div>

        {showForm && (
          <div className="plan-form-card">
            <h3>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (days)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading plans...</div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => (
              <div key={plan._id} className="plan-card">
                <h3>{plan.title}</h3>
                <p className="description">{plan.description}</p>
                <div className="plan-meta">
                  <span className="price">₹{plan.price}</span>
                  <span className="duration">{plan.duration} days</span>
                </div>
                <div className="plan-actions">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="btn btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/plans/${plan._id}`)}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
            {plans.length === 0 && (
              <p className="empty-state">No plans created yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;
