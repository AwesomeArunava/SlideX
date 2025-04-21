import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  token: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["emailVerification", "passwordReset", "session"],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    // Optional TTL: Only apply TTL for short-lived tokens
    // We’ll conditionally add it later depending on type
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

// 🔧 Optional: Add TTL only for certain types
// (MongoDB TTL is based on a fixed index on one field)
tokenSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 600, // 10 minutes
    partialFilterExpression: { type: { $in: ["emailVerification", "passwordReset"] } },
  }
);

export default mongoose.model("Token", tokenSchema);
