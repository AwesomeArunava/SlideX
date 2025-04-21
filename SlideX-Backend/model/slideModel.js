import mongoose from "mongoose";

const slideDeckSchema = new mongoose.Schema({
  // Owner user (optional for anonymous)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  // For guests (session-based tracking)
  sessionId: {
    type: String,
    default: null,
  },

  // Slide data — array of Fabric.js JSONs
  slides: {
    type: [mongoose.Schema.Types.Mixed], // Exactly your slides: [ {}, {}, {} ]
    required: true,
  },

  // Metadata
  title: {
    type: String,
    default: 'Untitled Presentation',
  },
  description: {
    type: String,
    default: '',
  },
  tags: [String],

  // Optional presentation settings
  settings: {
    aspectRatio: { type: String, default: '16:9' },
    backgroundColor: { type: String, default: '#ffffff' },
  },

  isPublic: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('SlideDeck', slideDeckSchema);

