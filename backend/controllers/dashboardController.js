const asyncHandler = require('../utils/asyncHandler');
const Feedback = require('../models/Feedback');
const Analysis = require('../models/Analysis');

/**
  Get aggregated summary statistics for the dashboard cards
  (Total Teachers, Total Students, Total Feedback, Positive/Negative/Neutral)
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  // Run all aggregations in parallel — they're independent of each other
  const [
    distinctTeachers,
    distinctStudents,
    totalFeedback,
    sentimentAggregation,
  ] = await Promise.all([
    Feedback.distinct('teacher'),
    Feedback.distinct('studentName'),
    Feedback.countDocuments(),
    Analysis.aggregate([
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Convert aggregation result [{ _id: 'Positive', count: 12 }, ...] into a flat object
  const sentimentBreakdown = { Positive: 0, Neutral: 0, Negative: 0 };
  sentimentAggregation.forEach((entry) => {
    if (sentimentBreakdown[entry._id] !== undefined) {
      sentimentBreakdown[entry._id] = entry.count;
    }
  });

  res.status(200).json({
    success: true,
    data: {
    totalTeachers: distinctTeachers.length,
    totalStudents: distinctStudents.length,
      totalFeedback,
      positiveFeedback: sentimentBreakdown.Positive,
      negativeFeedback: sentimentBreakdown.Negative,
      neutralFeedback: sentimentBreakdown.Neutral,
    },
  });
});

module.exports = { getDashboardSummary };