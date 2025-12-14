import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one follow relationship per user-trainer pair
followSchema.index({ follower: 1, trainer: 1 }, { unique: true });

export default mongoose.model('Follow', followSchema);
