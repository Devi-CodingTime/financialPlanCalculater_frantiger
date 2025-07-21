import mongoose from 'mongoose';

const projectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  inputs: {
    type: Object,
    default: {}
  },
  results: {
    type: Array,
    default: []
  }
});

export default mongoose.model('Projection', projectionSchema);