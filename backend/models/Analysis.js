const mongoose = require('mongoose');
const analysisSchema = new mongoose.Schema(
  {
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    teacher: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    sentence: {
      type: String,
      required: true,
      trim: true,
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
      required: true,
      index: true,
    },
    sentimentScore: {
      type: Number,
      required: true,
    },
    uploadBatch: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index used heavily by teacher + category analytics queries
analysisSchema.index({ teacher: 1, category: 1 });
analysisSchema.index({ teacher: 1, sentiment: 1 });

module.exports = mongoose.model('Analysis', analysisSchema);