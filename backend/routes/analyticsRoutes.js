const express = require('express');
const {
  getTeachersList,
  getTeacherAnalytics,
  getAnalyticsCharts,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/teachers', protect, getTeachersList);
router.get('/charts', protect, getAnalyticsCharts);
router.get('/teacher/:teacherName', protect, getTeacherAnalytics);

module.exports = router;