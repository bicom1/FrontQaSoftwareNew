import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { totalUserCountApi } from '../features/userApis';
import { totalEscalationCountsApi, getEscalationAnalyticsApi, overviewAnalyticsRangeApi } from '../features/escalationsApi';
import { totalEvaluationCountsApi, getEvaluationAnalyticsApi } from '../features/evaluationApi';
import { totalMarketingCountsApi, getMarketingAnalyticsApi } from '../features/marketingApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#6633AA'];

const Overview = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalEscalationCounts, setTotalEscalationCounts] = useState(null);
  const [totalEvaluationCounts, setTotalEvaluationCounts] = useState(null);
  const [totalMarketingCounts, setTotalMarketingCounts] = useState(null);

  const [escalationAnalytics, setEscalationAnalytics] = useState(null);
  const [evaluationAnalytics, setEvaluationAnalytics] = useState(null);
  const [marketingAnalytics, setMarketingAnalytics] = useState(null);

  // Chart data states
  const [evaluationRatingRangeData, setEvaluationRatingRangeData] = useState([]);
  const [marketingSourceData, setMarketingSourceData] = useState([]);
  const [escalationSeverityData, setEscalationSeverityData] = useState([]);
  // const [timeRange, setTimeRange] = useState('7d'); // default 'Last 7 days'


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          users,
          escalations,
          evaluations,
          marketing,
          escalationAnalyticsData,
          evaluationAnalyticsData,
          marketingAnalyticsData,
        ] = await Promise.all([
          totalUserCountApi(),
          totalEscalationCountsApi(),
          totalEvaluationCountsApi(),
          totalMarketingCountsApi(),
          getEscalationAnalyticsApi(),
          getEvaluationAnalyticsApi(),
          getMarketingAnalyticsApi(),
          overviewAnalyticsRangeApi()
        ]);

        setTotalUsers(users.count);
        setTotalEscalationCounts(escalations.count);
        setTotalEvaluationCounts(evaluations.count);
        setTotalMarketingCounts(marketing.count);

        setEscalationAnalytics(escalationAnalyticsData);
        setEvaluationAnalytics({
          averageScore: evaluationAnalyticsData.avgRating,
          totalEvaluations: evaluationAnalyticsData.total,
        });
        setMarketingAnalytics(marketingAnalyticsData);

        // Transform evaluation ratingRanges for BarChart
        if (evaluationAnalyticsData.ratingRanges) {
          const ratingRangeArray = Object.entries(evaluationAnalyticsData.ratingRanges).map(
            ([range, count]) => ({ name: range, count })
          );
          setEvaluationRatingRangeData(ratingRangeArray);
        }

        // Transform marketing sourceCounts for PieChart
        if (marketingAnalyticsData.sourceCounts) {
          const marketingSourcesArray = Object.entries(marketingAnalyticsData.sourceCounts).map(
            ([source, count]) => ({ name: source, value: count })
          );
          setMarketingSourceData(marketingSourcesArray);
        }

        // Transform escalation severityCounts for PieChart
        if (escalationAnalyticsData.severityCounts) {
          const escalationSeverityArray = Object.entries(escalationAnalyticsData.severityCounts).map(
            ([severity, count]) => ({ name: severity, value: count })
          );
          setEscalationSeverityData(escalationSeverityArray);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchAllData();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Dashboard Overview</h4>
        <div>
        {/* <select
  className="form-select form-select-sm"
  value={timeRange}
  onChange={(e) => setTimeRange(e.target.value)}
>
  <option value="7d">Last 7 days</option>
  <option value="30d">Last 30 days</option>
  <option value="month">This month</option>
  <option value="quarter">Last quarter</option>
</select> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Total Users</h6>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">{totalUsers ?? 'Loading...'}</h2>
                <span className="badge bg-success ms-2">+8%</span>
              </div>
              <div className="text-muted small mt-2">Compared to last week</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Total Escalation Forms</h6>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">{totalEscalationCounts ?? 'Loading...'}</h2>
                <span className="badge bg-success ms-2">+8%</span>
              </div>
              <div className="text-muted small mt-2">2 projects completed this week</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Total Evaluation Forms</h6>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">{totalEvaluationCounts ?? 'Loading...'}</h2>
                <span className="badge bg-success ms-2">+8%</span>
              </div>
              <div className="text-muted small mt-2">$10,234 this month</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Total Marketing Forms</h6>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">{totalMarketingCounts ?? 'Loading...'}</h2>
                <span className="badge bg-success ms-2">+24%</span>
              </div>
              <div className="text-muted small mt-2">32 tasks pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="row g-3 mb-4">
        {/* Evaluation Analytics */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Evaluation Score Avg</h6>
              <h2>{evaluationAnalytics ? evaluationAnalytics.averageScore : 'Loading...'}</h2>
              <div className="text-muted small mt-2">
                From {evaluationAnalytics ? evaluationAnalytics.totalEvaluations : 0} evaluations
              </div>
            </div>
          </div>
        </div>

        {/* Escalation Analytics */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Escalations Summary</h6>
              <h2>{escalationAnalytics ? escalationAnalytics.total : 'Loading...'}</h2>
              <div className="text-muted small mt-2">
                Urgent Actions: {escalationAnalytics?.severityCounts?.['Urgent Action required'] ?? 0}
              </div>
              <div className="text-muted small mt-1">
                High Severity: {escalationAnalytics?.severityCounts?.High ?? 0}
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Analytics */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Marketing Leads Quality</h6>
              <h2>{marketingAnalytics ? marketingAnalytics.total : 'Loading...'}</h2>
              <div className="text-muted small mt-2">
                High Quality: {marketingAnalytics?.qualityCounts?.High ?? 0}
              </div>
              <div className="text-muted small mt-1">
                Medium Quality: {marketingAnalytics?.qualityCounts?.Medium ?? 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
     
      <div className="row g-3 mb-4">
      <div className="col-12 col-lg-6 card border-0 shadow-sm mb-4">
        <div className="card-header">
          <h5>Evaluation Rating Ranges</h5>
        </div>
        <div className="card-body">
          {evaluationRatingRangeData.length > 0 ? (
            <BarChart
              width={600}
              height={300}
              data={evaluationRatingRangeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          ) : (
            <p>Loading Evaluation Chart...</p>
          )}
        </div>
      </div>

      {/* Marketing Source Pie Chart */}
      <div className="col-12 col-lg-6 card border-0 shadow-sm mb-4">
        <div className="card-header">
          <h5>Marketing Lead Sources</h5>
        </div>
        <div className="card-body">
          {marketingSourceData.length > 0 ? (
            <PieChart width={400} height={300}>
              <Pie
                data={marketingSourceData}
                cx={200}
                cy={150}
                label
                outerRadius={100}
                fill="#82ca9d"
                dataKey="value"
              >
                {marketingSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <p>Loading Marketing Chart...</p>
          )}
        </div>
      </div>
      </div>
     

      {/* Escalation Severity Pie Chart */}
      <div className="row g-3">
       
      <div className="col-12 col-lg-6  card border-0 shadow-sm mb-4">
        <div className="card-header">
          <h5>Escalation Severity Distribution</h5>
        </div>
        <div className="card-body">
          {escalationSeverityData.length > 0 ? (
            <PieChart width={400} height={300}>
              <Pie
                data={escalationSeverityData}
                cx={200}
                cy={150}
                label
                outerRadius={100}
                fill="#FF8042"
                dataKey="value"
              >
                {escalationSeverityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <p>Loading Escalation Chart...</p>
          )}
        </div>
      </div>
      <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Activity</h5>
              <button className="btn btn-sm btn-link text-decoration-none">View All</button>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <div>
                    <div className="fw-bold">New user registered</div>
                    <div className="text-muted small">John Smith created an account</div>
                  </div>
                  <span className="text-muted small">2 mins ago</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <div>
                    <div className="fw-bold">Project updated</div>
                    <div className="text-muted small">Mobile App Dashboard v2.0</div>
                  </div>
                  <span className="text-muted small">1 hour ago</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <div>
                    <div className="fw-bold">New payment received</div>
                    <div className="text-muted small">From client #40298</div>
                  </div>
                  <span className="text-muted small">3 hours ago</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <div>
                    <div className="fw-bold">Server maintenance completed</div>
                    <div className="text-muted small">Server #12 restarted successfully</div>
                  </div>
                  <span className="text-muted small">Yesterday</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
      </div>
     


     
      
    </>
  );
};

export default Overview;