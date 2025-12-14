import express from 'express';
import Subscription from '../models/Subscription.js';
import FitnessPlan from '../models/FitnessPlan.js';
import { authenticate, requireUser } from '../middleware/auth.js';

const router = express.Router();

// Get user's subscriptions (must come before parameterized routes)
router.get('/my-subscriptions', authenticate, requireUser, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.userId })
      .populate('plan')
      .populate({
        path: 'plan',
        populate: { path: 'trainer', select: 'name email bio' }
      })
      .sort({ purchasedAt: -1 });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Subscribe to a plan
router.post('/:planId', authenticate, requireUser, async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.planId);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const existingSubscription = await Subscription.findOne({
      user: req.userId,
      plan: req.params.planId
    });

    if (existingSubscription) {
      return res.status(400).json({ message: 'Already subscribed to this plan' });
    }

    const subscription = new Subscription({
      user: req.userId,
      plan: req.params.planId
    });

    await subscription.save();
    await subscription.populate('plan');

    res.status(201).json({
      message: 'Successfully subscribed to plan',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unsubscribe from a plan
router.delete('/:planId', authenticate, requireUser, async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({
      user: req.userId,
      plan: req.params.planId
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json({ message: 'Successfully unsubscribed from plan' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
