import express from 'express';
import jwt from 'jsonwebtoken';
import FitnessPlan from '../models/FitnessPlan.js';
import Subscription from '../models/Subscription.js';
import { authenticate, requireTrainer } from '../middleware/auth.js';

const router = express.Router();

// Optional auth middleware
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    }
  } catch (error) {
    // Ignore auth errors for optional auth
  }
  next();
};

// Get all plans (with preview for non-subscribed users)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { myPlans } = req.query;
    
    let query = {};
    // If trainer requests their own plans (requires auth)
    if (myPlans === 'true') {
      if (!req.userId || req.userRole !== 'trainer') {
        return res.status(401).json({ message: 'Authentication required' });
      }
      query.trainer = req.userId;
    }

    const plans = await FitnessPlan.find(query)
      .populate('trainer', 'name email bio')
      .sort({ createdAt: -1 });

    // If fetching own plans, return all details
    if (myPlans === 'true' && req.userRole === 'trainer') {
      return res.json(plans);
    }

    // If not authenticated, return only previews
    if (!req.userId) {
      const previews = plans.map(plan => ({
        _id: plan._id,
        title: plan.title,
        price: plan.price,
        trainer: plan.trainer,
        createdAt: plan.createdAt
      }));
      return res.json(previews);
    }

    const subscriptions = await Subscription.find({ user: req.userId });
    const subscribedPlanIds = subscriptions.map(sub => sub.plan.toString());

    const plansWithAccess = plans.map(plan => {
      const isSubscribed = subscribedPlanIds.includes(plan._id.toString());
      
      if (isSubscribed || req.userRole === 'trainer' || plan.trainer._id.toString() === req.userId) {
        return plan;
      } else {
        return {
          _id: plan._id,
          title: plan.title,
          price: plan.price,
          trainer: plan.trainer,
          createdAt: plan.createdAt
        };
      }
    });

    res.json(plansWithAccess);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single plan by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id)
      .populate('trainer', 'name email bio');

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const subscription = await Subscription.findOne({
      user: req.userId,
      plan: plan._id
    });

    const isSubscribed = !!subscription;
    const isOwner = plan.trainer._id.toString() === req.userId;

    if (!isSubscribed && !isOwner && req.userRole !== 'trainer') {
      return res.json({
        _id: plan._id,
        title: plan.title,
        price: plan.price,
        trainer: plan.trainer,
        createdAt: plan.createdAt,
        isSubscribed: false
      });
    }

    res.json({ ...plan.toObject(), isSubscribed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create plan (trainer only)
router.post('/', authenticate, requireTrainer, async (req, res) => {
  try {
    const { title, description, price, duration } = req.body;

    if (!title || !description || !price || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const plan = new FitnessPlan({
      title,
      description,
      price: parseFloat(price),
      duration: parseInt(duration),
      trainer: req.userId
    });

    await plan.save();
    await plan.populate('trainer', 'name email bio');

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update plan (trainer only, own plans)
router.put('/:id', authenticate, requireTrainer, async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    if (plan.trainer.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only edit your own plans' });
    }

    const { title, description, price, duration } = req.body;

    if (title) plan.title = title;
    if (description) plan.description = description;
    if (price !== undefined) plan.price = parseFloat(price);
    if (duration !== undefined) plan.duration = parseInt(duration);

    plan.updatedAt = Date.now();
    await plan.save();
    await plan.populate('trainer', 'name email bio');

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete plan (trainer only, own plans)
router.delete('/:id', authenticate, requireTrainer, async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    if (plan.trainer.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own plans' });
    }

    await FitnessPlan.findByIdAndDelete(req.params.id);
    await Subscription.deleteMany({ plan: req.params.id });

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
