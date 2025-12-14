import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FitnessPlan',
    required: true
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active'
  }
});

// Ensure one subscription per user per plan
subscriptionSchema.index({ user: 1, plan: 1 }, { unique: true });

export default mongoose.model('Subscription', subscriptionSchema);
