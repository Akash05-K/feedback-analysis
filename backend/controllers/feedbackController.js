const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { parseExcelBuffer } = require('../services/excelParserService');
const { detectCategories } = require('../services/keywordDetectionService');
const { analyzeSentiment } = require('../services/sentimentService');
const Feedback = require('../models/Feedback');
const Analysis = require('../models/Analysis');

const uploadFeedback = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded. Please attach an .xlsx file.');
  }

  // 1 Parse Excel into rows, each with feedback already split into sentences
  const parsedRows = parseExcelBuffer(req.file.buffer);

  // Groups this entire upload together so it can be traced/filtered later
  const uploadBatch = new mongoose.Types.ObjectId();

  const feedbackDocsToInsert = [];
  const analysisDocsToInsert = [];

  // Running counters for the response summary
  let totalSentences = 0;
  let totalCategorized = 0;
  const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
  const categoryCounts = {};

  for (const row of parsedRows) {
    const feedbackId = new mongoose.Types.ObjectId();

    feedbackDocsToInsert.push({
      _id: feedbackId,
      studentName: row.studentName,
      teacher: row.teacher,
      feedbackText: row.feedbackText,
      uploadBatch,
      sourceFileName: req.file.originalname,
    });

    for (const sentence of row.sentences) {
      totalSentences += 1;

      // 2 Category detection 
      const matchedCategories = detectCategories(sentence);

      if (matchedCategories.length === 0) {
        continue; // sentence didn't match any known category — skip storing it
      }

      totalCategorized += 1;

      // 3 Sentiment analysis (separate, independent service)
      const { sentiment, score } = analyzeSentiment(sentence);
      sentimentCounts[sentiment] += 1;

      for (const { category } of matchedCategories) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;

        analysisDocsToInsert.push({
          feedback: feedbackId,
          studentName: row.studentName,
          teacher: row.teacher,
          category,
          sentence,
          sentiment,
          sentimentScore: score,
          uploadBatch,
        });
      }
    }
  }

  if (analysisDocsToInsert.length === 0) {
    res.status(422);
    throw new Error(
      'No sentences in this file matched any known feedback category. Nothing was saved.'
    );
  }

  // 4 Persist everything in bulk (fast, single round-trip per collection)
  await Feedback.insertMany(feedbackDocsToInsert);
  await Analysis.insertMany(analysisDocsToInsert);

  res.status(201).json({
    success: true,
    message: 'File processed and analyzed successfully',
    data: {
      uploadBatch,
      fileName: req.file.originalname,
      totalRows: parsedRows.length,
      totalSentences,
      totalCategorizedSentences: totalCategorized,
      totalAnalysisRecords: analysisDocsToInsert.length,
      sentimentBreakdown: sentimentCounts,
      categoryBreakdown: categoryCounts,
      teachersFound: [...new Set(parsedRows.map((r) => r.teacher))],
    },
  });
});


const getUploadHistory = asyncHandler(async (req, res) => {
  const uploads = await Feedback.aggregate([
    {
      $group: {
        _id: '$uploadBatch',
        fileName: { $first: '$sourceFileName' },
        uploadedAt: { $first: '$createdAt' },
        totalRows: { $sum: 1 },
        teachers: { $addToSet: '$teacher' },
      },
    },
    { $sort: { uploadedAt: -1 } },
  ]);

  const formatted = uploads.map((upload) => ({
    uploadBatch: upload._id,
    fileName: upload.fileName,
    uploadedAt: upload.uploadedAt,
    totalRows: upload.totalRows,
    teacherCount: upload.teachers.length,
  }));

  res.status(200).json({
    success: true,
    data: formatted,
  });
});

const deleteUploadBatch = asyncHandler(async (req, res) => {
  const { batchId } = req.params;

  if (!mongoose.isValidObjectId(batchId)) {
    res.status(400);
    throw new Error('Invalid upload batch id');
  }

  const [feedbackResult, analysisResult] = await Promise.all([
    Feedback.deleteMany({ uploadBatch: batchId }),
    Analysis.deleteMany({ uploadBatch: batchId }),
  ]);

  if (feedbackResult.deletedCount === 0) {
    res.status(404);
    throw new Error('No upload found with this batch id');
  }

  res.status(200).json({
    success: true,
    message: 'Upload deleted successfully',
    data: {
      feedbackDeleted: feedbackResult.deletedCount,
      analysisDeleted: analysisResult.deletedCount,
    },
  });
});

module.exports = { uploadFeedback, getUploadHistory, deleteUploadBatch };