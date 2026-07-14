const express = require('express');
const {
  uploadFeedback,
  getUploadHistory,
  deleteUploadBatch,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadFeedback);
router.get('/uploads', protect, getUploadHistory);
router.delete('/uploads/:batchId', protect, deleteUploadBatch);

module.exports = router;