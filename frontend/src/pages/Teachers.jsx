import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/common/Spinner';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const [uploadFiles, setUploadFiles] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(''); // '' = All Uploads
  const [loadingFiles, setLoadingFiles] = useState(true);

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchUploadFiles = async () => {
      try {
        const { data } = await axiosInstance.get('/feedback/uploads');
        setUploadFiles(data.data);
      } catch (err) {
        console.error('Failed to load upload file list:', err);
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchUploadFiles();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      setError('');

      try {
        const params = selectedBatch ? { uploadBatch: selectedBatch } : {};
        const { data } = await axiosInstance.get('/analytics/teachers', { params });
        setTeachers(data.data);

        setSelectedTeacher((prevSelected) => {
          if (data.data.includes(prevSelected)) return prevSelected;
          return data.data.length > 0 ? data.data[0] : '';
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load teacher list.');
        setTeachers([]);
        setSelectedTeacher('');
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, [selectedBatch]);

  // Fetch analytics whenever the selected teacher OR selected file changes
  useEffect(() => {
    if (!selectedTeacher) {
      setAnalytics(null);
      return;
    }

    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      setError('');
      setAnalytics(null);

      try {
        const url = `/analytics/teacher/${encodeURIComponent(selectedTeacher)}`;
        const params = selectedBatch ? { uploadBatch: selectedBatch } : {};
        const { data } = await axiosInstance.get(url, { params });
        setAnalytics(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics for this teacher.');
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [selectedTeacher, selectedBatch]);

  if (loadingTeachers && teachers.length === 0) return <Spinner />;

  if (!loadingTeachers && teachers.length === 0 && !selectedBatch) {
    return (
      <div className="alert alert-info" role="alert">
        <i className="bi bi-info-circle me-2"></i>
        No teachers found yet. Upload an Excel file first from <strong>Upload Excel</strong>.
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-1">Teacher Analytics</h3>
      <p className="text-muted">Select a teacher, and optionally a specific uploaded file, to view their feedback breakdown.</p>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label htmlFor="teacherSelect" className="form-label">
            Teacher
          </label>
          <select
            id="teacherSelect"
            className="form-select"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            disabled={loadingTeachers}
          >
            {teachers.length === 0 && <option value="">No teachers in this file</option>}
            {teachers.map((teacher) => (
              <option key={teacher} value={teacher}>
                {teacher}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-5">
          <label htmlFor="fileSelect" className="form-label">
            Upload File
          </label>
          <select
            id="fileSelect"
            className="form-select"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            disabled={loadingFiles}
          >
            <option value="">All Uploads (combined)</option>
            {uploadFiles.map((upload) => (
              <option key={upload.uploadBatch} value={upload.uploadBatch}>
                {upload.fileName} — {new Date(upload.uploadedAt).toLocaleDateString()} ({upload.totalRows} rows)
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadingTeachers && <Spinner />}

      {!loadingTeachers && teachers.length === 0 && selectedBatch && (
        <div className="alert alert-info" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          This file has no teachers in it.
        </div>
      )}

      {!loadingTeachers && loadingAnalytics && <Spinner />}

      {!loadingAnalytics && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loadingTeachers && !loadingAnalytics && analytics && (
        <>
          {selectedBatch && (
            <div className="alert alert-secondary py-2 small" role="alert">
              <i className="bi bi-funnel me-1"></i>
              Showing results for <strong>{selectedTeacher}</strong> from this one file only.
            </div>
          )}

          {/* Summary cards */}
          <div className="row g-3 mb-4">
            <SummaryCard label="Total Feedback" value={analytics.totalFeedback} color="dark" icon="bi-chat-square-text" />
            <SummaryCard label="Positive" value={analytics.positiveFeedback} color="success" icon="bi-emoji-smile" />
            <SummaryCard label="Negative" value={analytics.negativeFeedback} color="danger" icon="bi-emoji-frown" />
            <SummaryCard label="Neutral" value={analytics.neutralFeedback} color="secondary" icon="bi-emoji-neutral" />
          </div>

          {/* Category-wise breakdown table */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <strong>Category-wise Breakdown</strong>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Category</th>
                    <th className="text-success">Positive</th>
                    <th className="text-secondary">Neutral</th>
                    <th className="text-danger">Negative</th>
                    <th>Total Mentions</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.categoryBreakdown.map((row) => (
                    <tr key={row.category}>
                      <td className="fw-medium">{row.category}</td>
                      <td className="text-success">{row.positive}</td>
                      <td className="text-secondary">{row.neutral}</td>
                      <td className="text-danger">{row.negative}</td>
                      <td className="fw-semibold">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, color, icon }) => (
  <div className="col-md-3 col-sm-6">
    <div className={`card border-0 shadow-sm border-start border-4 border-${color}`}>
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fs-4 fw-bold">{value}</div>
        </div>
        <i className={`bi ${icon} fs-2 text-${color} opacity-50`}></i>
      </div>
    </div>
  </div>
);

export default Teachers;