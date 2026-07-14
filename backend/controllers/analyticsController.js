const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const Feedback = require('../models/Feedback');
const Analysis = require('../models/Analysis');

const getTeachersList = asyncHandler(async (req, res) => {
  const { uploadBatch } = req.query; 

  const filter = {};
  if (uploadBatch) {
    if (!mongoose.isValidObjectId(uploadBatch)) {
      res.status(400);
      throw new Error('Invalid upload batch id');
    }
    filter.uploadBatch = uploadBatch;
  }

  const teachers = await Feedback.distinct('teacher', filter);

  res.status(200).json({
    success: true,
    data: teachers.sort(), // alphabetical, for a predictable dropdown order
  });
});

const getTeacherAnalytics = asyncHandler(async (req, res) => {
  const { teacherName } = req.params;
  const { uploadBatch } = req.query; // optional — scopes results to one specific upload

  // Build match filters once, shared by every query below
  const feedbackFilter = { teacher: teacherName };
  const analysisFilter = { teacher: teacherName };

  if (uploadBatch) {
    if (!mongoose.isValidObjectId(uploadBatch)) {
      res.status(400);
      throw new Error('Invalid upload batch id');
    }
    feedbackFilter.uploadBatch = uploadBatch;
    analysisFilter.uploadBatch = new mongoose.Types.ObjectId(uploadBatch);
  }

  const totalFeedback = await Feedback.countDocuments(feedbackFilter);

  if (totalFeedback === 0) {
    res.status(404);
    throw new Error(
      uploadBatch
        ? `No feedback found for teacher "${teacherName}" in this upload`
        : `No feedback found for teacher "${teacherName}"`
    );
  }

  // Overall sentiment counts for this teacher (across all categories)
  const overallSentimentAgg = await Analysis.aggregate([
    { $match: analysisFilter },
    { $group: { _id: '$sentiment', count: { $sum: 1 } } },
  ]);

  const overallSentiment = { Positive: 0, Neutral: 0, Negative: 0 };
  overallSentimentAgg.forEach((entry) => {
    if (overallSentiment[entry._id] !== undefined) {
      overallSentiment[entry._id] = entry.count;
    }
  });

  // Category-wise breakdown, each further split by sentiment
  const categoryAgg = await Analysis.aggregate([
    { $match: analysisFilter },
    {
      $group: {
        _id: { category: '$category', sentiment: '$sentiment' },
        count: { $sum: 1 },
      },
    },
  ]);

  
  const categoryMap = {};

  categoryAgg.forEach(({ _id, count }) => {
    const { category, sentiment } = _id;

    if (!categoryMap[category]) {
      categoryMap[category] = { category, positive: 0, neutral: 0, negative: 0, total: 0 };
    }

    categoryMap[category][sentiment.toLowerCase()] = count;
    categoryMap[category].total += count;
  });

  // Sort categories by total mentions, most-discussed first
  const categoryBreakdown = Object.values(categoryMap).sort((a, b) => b.total - a.total);

  res.status(200).json({
    success: true,
    data: {
      teacher: teacherName,
      totalFeedback,
      positiveFeedback: overallSentiment.Positive,
      negativeFeedback: overallSentiment.Negative,
      neutralFeedback: overallSentiment.Neutral,
      categoryBreakdown,
    },
  });
});

const sentimentSumExpr = (sentimentLabel) => ({
  $sum: { $cond: [{ $eq: ['$sentiment', sentimentLabel] }, 1, 0] },
});

const getAnalyticsCharts = asyncHandler(async (req, res) => {
  const [
    overallSentimentAgg,
    categoryAgg,
    teacherAgg,
    trendAgg,
  ] = await Promise.all([
    // 1. Overall sentiment counts -> Pie Chart
    Analysis.aggregate([{ $group: { _id: '$sentiment', count: { $sum: 1 } } }]),

    // 2. Category-wise sentiment breakdown (top 10 by volume) -> Stacked Bar Chart
    Analysis.aggregate([
      {
        $group: {
          _id: '$category',
          positive: sentimentSumExpr('Positive'),
          neutral: sentimentSumExpr('Neutral'),
          negative: sentimentSumExpr('Negative'),
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]),

    // 3. Teacher-wise sentiment breakdown -> Stacked Bar Chart, Doughnut, ranked Bar Chart
    Analysis.aggregate([
      {
        $group: {
          _id: '$teacher',
          positive: sentimentSumExpr('Positive'),
          neutral: sentimentSumExpr('Neutral'),
          negative: sentimentSumExpr('Negative'),
          total: { $sum: 1 },
        },
      },
    ]),

    // 4. Sentiment trend by upload date -> Line Chart
    Analysis.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          positive: sentimentSumExpr('Positive'),
          neutral: sentimentSumExpr('Neutral'),
          negative: sentimentSumExpr('Negative'),
          avgScore: { $avg: '$sentimentScore' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  // --- Reshape overall sentiment into a flat object ---
  const overallSentiment = { Positive: 0, Neutral: 0, Negative: 0 };
  overallSentimentAgg.forEach((entry) => {
    if (overallSentiment[entry._id] !== undefined) overallSentiment[entry._id] = entry.count;
  });

  // --- Reshape category breakdown ---
  const categoryBreakdown = categoryAgg.map((entry) => ({
    category: entry._id,
    positive: entry.positive,
    neutral: entry.neutral,
    negative: entry.negative,
    total: entry.total,
  }));

  // --- Reshape teacher breakdown, add positivePercentage for ranking ---
  const teacherComparison = teacherAgg.map((entry) => ({
    teacher: entry._id,
    positive: entry.positive,
    neutral: entry.neutral,
    negative: entry.negative,
    total: entry.total,
    positivePercentage: entry.total > 0 ? Math.round((entry.positive / entry.total) * 100) : 0,
  }));

  // Rank teachers by positivePercentage — top 5 and lowest 5 (fewer if fewer teachers exist)
  const sortedByPositivity = [...teacherComparison].sort(
    (a, b) => b.positivePercentage - a.positivePercentage
  );
  const topTeachers = sortedByPositivity.slice(0, 5);
  const lowestTeachers = [...sortedByPositivity].reverse().slice(0, 5);

  // --- Reshape trend data, rounding avgScore for cleaner chart display ---
  const sentimentTrend = trendAgg.map((entry) => ({
    date: entry._id,
    positive: entry.positive,
    neutral: entry.neutral,
    negative: entry.negative,
    avgScore: Math.round(entry.avgScore * 100) / 100,
  }));

  res.status(200).json({
    success: true,
    data: {
      overallSentiment,
      categoryBreakdown,
      teacherComparison,
      topTeachers,
      lowestTeachers,
      sentimentTrend,
    },
  });
});

module.exports = { getTeachersList, getTeacherAnalytics, getAnalyticsCharts };