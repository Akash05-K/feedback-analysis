const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    teacher: {
      type: String,
      required: [true, 'Teacher name is required'],
      trim: true,
    },
    feedbackText: {
      type: String,
      required: [true, 'Feedback text is required'],
      trim: true,
    },
    // Groups all rows uploaded together in a single Excel file
    uploadBatch: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sourceFileName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ teacher: 1 });
feedbackSchema.index({ uploadBatch: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);