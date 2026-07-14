import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/common/Spinner';

const CARD_CONFIG = [
  { key: 'totalTeachers', label: 'Total Teachers', icon: 'bi-person-workspace', color: 'primary' },
   { key: 'totalStudents', label: 'Total Students', icon: 'bi-people', color: 'info' },
  { key: 'totalFeedback', label: 'Total Feedback', icon: 'bi-chat-square-text', color: 'dark' },
  { key: 'positiveFeedback', label: 'Positive Feedback', icon: 'bi-emoji-smile', color: 'success' },
  { key: 'negativeFeedback', label: 'Negative Feedback', icon: 'bi-emoji-frown', color: 'danger' },
  { key: 'neutralFeedback', label: 'Neutral Feedback', icon: 'bi-emoji-neutral', color: 'secondary' },
];

const Dashboard = () => {
  const { admin } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axiosInstance.get('/dashboard/summary');
        setSummary(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      <h3 className="mb-1">Welcome,, {admin?.name} </h3>
      <p className="text-muted mb-4">Here the overview of student feedback</p>

      {loading && <Spinner />}

      {!loading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && summary && (
        <div className="row g-4">
          {CARD_CONFIG.map((card) => (
            <div className="col-md-4 col-sm-6" key={card.key}>
              <div className={`card border-0 shadow-sm border-start border-4 border-${card.color}`}>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted small">{card.label}</div>
                    <div className="fs-3 fw-bold">{summary[card.key]}</div>
                  </div>
                  <i className={`bi ${card.icon} fs-1 text-${card.color} opacity-50`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && summary && summary.totalFeedback === 0 && (
        <div className="alert alert-info mt-4" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          No feedback data yet. Head to <strong>Upload Excel</strong> to get started.
        </div>
      )}
    </div>
  );
};

export default Dashboard;