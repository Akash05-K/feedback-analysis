import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/common/Spinner';

// Consistent sentiment color mapping used across every chart
const SENTIMENT_COLORS = {
  positive: "#166534",
  neutral: "#4B5563",
  negative: "#991B1B",
};

const TEACHER_PALETTE = [
  "#264653", // Dark Cyan
  "#2A9D8F", // Teal
  "#1D3557", // Navy Blue
  "#6A4C93", // Royal Purple
  "#8B2635", // Burgundy
  "#3A5A40", // Forest Green
  "#5C3D2E", // Coffee Brown
  "#283618", // Olive Green
  "#4A4E69", // Slate Blue
  "#7F5539", // Dark Copper
];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const { data: response } = await axiosInstance.get('/analytics/charts');
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics charts.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, []);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  const hasNoData = !data || data.teacherComparison.length === 0;

  if (hasNoData) {
    return (
      <div className="alert alert-info" role="alert">
        <i className="bi bi-info-circle me-2"></i>
        No analytics data yet. Upload an Excel file first from <strong>Upload Excel</strong>.
      </div>
    );
  }

  const overallSentimentData = [
    { name: 'Positive', value: data.overallSentiment.Positive },
    { name: 'Neutral', value: data.overallSentiment.Neutral },
    { name: 'Negative', value: data.overallSentiment.Negative },
  ];

  const rankedTeacherNames = new Set();
  const rankedTeachers = [];
  [...data.topTeachers, ...data.lowestTeachers].forEach((t) => {
    if (!rankedTeacherNames.has(t.teacher)) {
      rankedTeacherNames.add(t.teacher);
      rankedTeachers.push(t);
    }
  });

  const topTeacherNames = new Set(data.topTeachers.map((t) => t.teacher));

  return (
    <div>
      <h3 className="mb-1">Analytics</h3>
      <p className="text-muted mb-4">Visual breakdown of all feedback collected</p>

      <div className="row g-4">
        {/* Overall Sentiment — Pie Chart */}
        <div className="col-lg-6">
          <ChartCard title="Overall Sentiment">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={overallSentimentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {overallSentimentData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={SENTIMENT_COLORS[entry.name.toLowerCase()]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Feedback Volume by Teacher — Doughnut-style Pie Chart */}
        <div className="col-lg-6">
          <ChartCard title="Feedback Volume by Teacher">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.teacherComparison}
                  dataKey="total"
                  nameKey="teacher"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  label={(entry) => entry.teacher}
                >
                  {data.teacherComparison.map((entry, index) => (
                    <Cell
                      key={entry.teacher}
                      fill={TEACHER_PALETTE[index % TEACHER_PALETTE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Category-wise Sentiment — Stacked Bar Chart */}
        <div className="col-12">
          <ChartCard title="Category-wise Sentiment (Top 10 Categories)">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.categoryBreakdown} margin={{ bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-30} textAnchor="end" interval={0} height={90} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" stackId="sentiment" fill={SENTIMENT_COLORS.positive} name="Positive" />
                <Bar dataKey="neutral" stackId="sentiment" fill={SENTIMENT_COLORS.neutral} name="Neutral" />
                <Bar dataKey="negative" stackId="sentiment" fill={SENTIMENT_COLORS.negative} name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Teacher-wise Sentiment / Teacher Comparison — Stacked Bar Chart */}
        <div className="col-12">
          <ChartCard title="Teacher Comparison (Sentiment Breakdown)">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.teacherComparison} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="teacher" angle={-20} textAnchor="end" interval={0} height={70} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" stackId="sentiment" fill={SENTIMENT_COLORS.positive} name="Positive" />
                <Bar dataKey="neutral" stackId="sentiment" fill={SENTIMENT_COLORS.neutral} name="Neutral" />
                <Bar dataKey="negative" stackId="sentiment" fill={SENTIMENT_COLORS.negative} name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Top & Lowest Rated Teachers — Plain Bar Chart, color-coded by rank */}
        <div className="col-lg-6">
          <ChartCard title="Top & Lowest Rated Teachers (% Positive Feedback)">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={rankedTeachers} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis type="category" dataKey="teacher" width={110} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="positivePercentage" name="Positive %">
                  {rankedTeachers.map((entry) => (
                    <Cell
                      key={entry.teacher}
                      fill={topTeacherNames.has(entry.teacher) ? SENTIMENT_COLORS.positive : SENTIMENT_COLORS.negative}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="d-flex gap-3 small mt-2">
              <span><span className="badge bg-success">&nbsp;</span> Top rated ppl</span>
              <span><span className="badge bg-danger">&nbsp;</span> Needs attention</span>
            </div>
          </ChartCard>
        </div>

        {/* Sentiment Trend Over Time — Line Chart */}
        <div className="col-lg-6">
          <ChartCard title="Sentiment Trend Over Time">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.sentimentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="positive" stroke={SENTIMENT_COLORS.positive} name="Positive" />
                <Line type="monotone" dataKey="neutral" stroke={SENTIMENT_COLORS.neutral} name="Neutral" />
                <Line type="monotone" dataKey="negative" stroke={SENTIMENT_COLORS.negative} name="Negative" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};


const ChartCard = ({ title, children }) => (
  <div className="card shadow-sm h-100">
    <div className="card-header bg-white">
      <strong>{title}</strong>
    </div>
    <div className="card-body">{children}</div>
  </div>
);

export default Analytics;