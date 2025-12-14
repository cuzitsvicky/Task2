import express from 'express';
import User from '../models/User.js';
import FitnessPlan from '../models/FitnessPlan.js';
import Follow from '../models/Follow.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get trainer profile
router.get('/:trainerId', authenticate, async (req, res) => {
  try {
    const trainer = await User.findById(req.params.trainerId);

    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    const plans = await FitnessPlan.find({ trainer: req.params.trainerId })
      .sort({ createdAt: -1 });

    let isFollowing = false;
    if (req.userRole === 'user') {
      const follow = await Follow.findOne({
        follower: req.userId,
        trainer: req.params.trainerId
      });
      isFollowing = !!follow;
    }

    res.json({
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        bio: trainer.bio
      },
      plans,
      isFollowing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
