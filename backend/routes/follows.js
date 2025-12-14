import express from 'express';
import Follow from '../models/Follow.js';
import User from '../models/User.js';
import { authenticate, requireUser } from '../middleware/auth.js';

const router = express.Router();

// Follow a trainer
router.post('/:trainerId', authenticate, requireUser, async (req, res) => {
  try {
    const trainer = await User.findById(req.params.trainerId);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    if (trainer.role !== 'trainer') {
      return res.status(400).json({ message: 'Can only follow trainers' });
    }

    if (trainer._id.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const existingFollow = await Follow.findOne({
      follower: req.userId,
      trainer: req.params.trainerId
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this trainer' });
    }

    const follow = new Follow({
      follower: req.userId,
      trainer: req.params.trainerId
    });

    await follow.save();
    res.json({ message: 'Successfully followed trainer', follow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unfollow a trainer
router.delete('/:trainerId', authenticate, requireUser, async (req, res) => {
  try {
    const follow = await Follow.findOneAndDelete({
      follower: req.userId,
      trainer: req.params.trainerId
    });

    if (!follow) {
      return res.status(404).json({ message: 'Not following this trainer' });
    }

    res.json({ message: 'Successfully unfollowed trainer' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's followed trainers
router.get('/my-follows', authenticate, requireUser, async (req, res) => {
  try {
    const follows = await Follow.find({ follower: req.userId })
      .populate('trainer', 'name email bio role')
      .sort({ followedAt: -1 });

    res.json(follows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if following a trainer
router.get('/check/:trainerId', authenticate, requireUser, async (req, res) => {
  try {
    const follow = await Follow.findOne({
      follower: req.userId,
      trainer: req.params.trainerId
    });

    res.json({ isFollowing: !!follow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
