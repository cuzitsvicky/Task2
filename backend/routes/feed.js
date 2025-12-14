import express from 'express';
import Follow from '../models/Follow.js';
import FitnessPlan from '../models/FitnessPlan.js';
import Subscription from '../models/Subscription.js';
import { authenticate, requireUser } from '../middleware/auth.js';

const router = express.Router();

// Get personalized feed
router.get('/', authenticate, requireUser, async (req, res) => {
  try {
    // Get all trainers the user follows
    const follows = await Follow.find({ follower: req.userId });
    const trainerIds = follows.map(follow => follow.trainer);

    // Get all plans from followed trainers
    const plans = await FitnessPlan.find({ trainer: { $in: trainerIds } })
      .populate('trainer', 'name email bio')
      .sort({ createdAt: -1 });

    // Get user's subscriptions
    const subscriptions = await Subscription.find({ user: req.userId });
    const subscribedPlanIds = subscriptions.map(sub => sub.plan.toString());

    // Add subscription status to each plan
    const feedItems = plans.map(plan => {
      const isSubscribed = subscribedPlanIds.includes(plan._id.toString());
      return {
        ...plan.toObject(),
        isSubscribed
      };
    });

    res.json(feedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
