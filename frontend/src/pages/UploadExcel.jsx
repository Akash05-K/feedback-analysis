import { useState, useRef, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/common/Spinner';

const UploadExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const [uploadHistory, setUploadHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [deletingBatchId, setDeletingBatchId] = useState(null);
  const [historyError, setHistoryError] = useState('');

  const fetchUploadHistory = useCallback(async () => {
    setLoadingHistory(true);
    setHistoryError('');
    try {
      const { data } = await axiosInstance.get('/feedback/uploads');
      setUploadHistory(data.data);
    } catch (err) {
      setHistoryError(err.response?.data?.message || 'Failed to load upload history.');
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchUploadHistory();
  }, [fetchUploadHistory]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');
    setResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const isExcel = /\.(xlsx|xls)$/i.test(file.name);
    if (!isExcel) {
      setError('Please select a valid .xlsx or .xls file.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please choose a file first.');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const { data } = await axiosInstance.post('/feedback/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data.data);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchUploadHistory(); // refresh the history table with the new upload
    } catch (err) {
      const message =
        err.response?.data?.message || 'Something went wrong while uploading the file.';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (uploadBatch, fileName) => {
    const confirmed = window.confirm(
      `Delete "${fileName}"? This will permanently remove all feedback and analysis data from this upload.`
    );
    if (!confirmed) return;

    setDeletingBatchId(uploadBatch);
    setHistoryError('');

    try {
      await axiosInstance.delete(`/feedback/uploads/${uploadBatch}`);
      setUploadHistory((prev) => prev.filter((u) => u.uploadBatch !== uploadBatch));
    } catch (err) {
      setHistoryError(err.response?.data?.message || 'Failed to delete this upload.');
    } finally {
      setDeletingBatchId(null);
    }
  };

  return (
    <div>
      <h3 className="mb-1">Upload Excel</h3>
      <p className="text-muted">
        Upload student feedback in .xlsx format. Columns required: Student Name, Teacher, Feedback.
      </p>

      <div className="card shadow-sm mt-3" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <form onSubmit={handleUpload}>
            <div className="mb-3">
              <label htmlFor="excelFile" className="form-label">
                Select Excel File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                className="form-control"
                id="excelFile"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <div className="form-text">
                  <i className="bi bi-file-earmark-excel text-success me-1"></i>
                  {selectedFile.name}
                </div>
              )}
            </div>

            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={uploading || !selectedFile}>
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-1"></i>
                  Upload & Analyze
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {result && (
        <div className="card shadow-sm mt-4">
          <div className="card-header bg-success text-white">
            <i className="bi bi-check-circle me-2"></i>
            Processed Successfully
          </div>
          <div className="card-body">
            <div className="row g-3 mb-3">
              <SummaryStat label="File" value={result.fileName} />
              <SummaryStat label="Rows (students)" value={result.totalRows} />
              <SummaryStat label="Sentences Found" value={result.totalSentences} />
              <SummaryStat label="Sentences Categorized" value={result.totalCategorizedSentences} />
              <SummaryStat label="Analysis Records Saved" value={result.totalAnalysisRecords} />
              <SummaryStat label="Teachers Found" value={result.teachersFound.join(', ')} />
            </div>

            <h6 className="mt-3">Sentiment Breakdown</h6>
            <div className="d-flex gap-2 mb-3">
              <span className="badge bg-success">Positive: {result.sentimentBreakdown.Positive}</span>
              <span className="badge bg-secondary">Neutral: {result.sentimentBreakdown.Neutral}</span>
              <span className="badge bg-danger">Negative: {result.sentimentBreakdown.Negative}</span>
            </div>

            <h6>Category Breakdown</h6>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(result.categoryBreakdown).map(([category, count]) => (
                <span key={category} className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle">
                  {category}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload History */}
      <div className="card shadow-sm mt-4">
        <div className="card-header bg-white">
          <strong>Upload History</strong>
        </div>

        {loadingHistory ? (
          <div className="card-body">
            <Spinner />
          </div>
        ) : historyError ? (
          <div className="card-body">
            <div className="alert alert-danger mb-0" role="alert">
              {historyError}
            </div>
          </div>
        ) : uploadHistory.length === 0 ? (
          <div className="card-body">
            <p className="text-muted mb-0">No files uploaded yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>File Name</th>
                  <th>Uploaded On</th>
                  <th>Rows</th>
                  <th>Teachers</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map((upload) => (
                  <tr key={upload.uploadBatch}>
                    <td>
                      <i className="bi bi-file-earmark-excel text-success me-2"></i>
                      {upload.fileName}
                    </td>
                    <td>{new Date(upload.uploadedAt).toLocaleString()}</td>
                    <td>{upload.totalRows}</td>
                    <td>{upload.teacherCount}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={deletingBatchId === upload.uploadBatch}
                        onClick={() => handleDelete(upload.uploadBatch, upload.fileName)}
                      >
                        {deletingBatchId === upload.uploadBatch ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <>
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryStat = ({ label, value }) => (
  <div className="col-6">
    <div className="text-muted small">{label}</div>
    <div className="fw-semibold">{value}</div>
  </div>
);

export default UploadExcel;