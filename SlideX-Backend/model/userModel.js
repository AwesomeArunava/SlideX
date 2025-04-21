import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  // OAuth Support (future-ready)
  provider: {
    type: String, // e.g. "google", "github", "local"
    default: "local",
  },
  providerId: {
    type: String, // e.g. Google ID or GitHub ID
  },

  // Optional Profile Info (for personalization)
  avatar: {
    type: String, // URL to profile image
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  organization: {
    type: String,
  },

  // Slides Relationship
  slides: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SlideDeck',
    },
  ],

  // Analytics / Metadata
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // For future personalization / analytics
  preferences: {
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' },
    usageIntent: { type: String }, // e.g. "student", "teacher", "designer"
  },

  // Email verification / password reset (future use)
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

export default  mongoose.model('User', userSchema);
