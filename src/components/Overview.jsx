import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { getallusersApi, onlineUsersCountApi, totalUserCountApi } from '../features/userApis';
import { totalEscalationCountsApi, getEscalationAnalyticsApi } from '../features/escalationsApi';
import { totalEvaluationCountsApi, getEvaluationAnalyticsApi } from '../features/evaluationApi';
import { totalMarketingCountsApi, getMarketingAnalyticsApi } from '../features/marketingApi';
import { Button } from 'react-bootstrap';
import { Crown } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#6633AA'];

const Overview = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState(null);
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
  const [admins, setAdmins]=  useState([]);
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  


     useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoadingAgents(true);
        const res = await getallusersApi();
        if (Array.isArray(res?.data?.data)) {
          setAgents(res.data.data.filter((u) => u.role === "agent"));
        } else {
          setAgents([]);
        }
      } catch (err) {
        console.error("Error fetching admins", err);
        setAgents([]);
      } finally {
        setLoadingAgents(false);
      }
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoadingAgents(true);
        const res = await getallusersApi();
        if (Array.isArray(res?.data?.data)) {
          setAdmins(res.data.data.filter((u) => u.role === "admin"));
        } else {
          setAdmins([]);
        }
      } catch (err) {
        console.error("Error fetching admins", err);
        setAdmins([]);
      } finally {
        setLoadingAgents(false);
      }
    };
    fetchAdmins();
  }, []);


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
        onlineUsers,
      ] = await Promise.all([
        totalUserCountApi(),
        totalEscalationCountsApi(),
        totalEvaluationCountsApi(),
        totalMarketingCountsApi(),
        getEscalationAnalyticsApi(),
        getEvaluationAnalyticsApi(),
        getMarketingAnalyticsApi(),
        onlineUsersCountApi(), // ✅ removed extra overviewAnalyticsRangeApi
      ]);

      // ✅ Use safe updates with fallbacks
      setTotalUsers(users?.count ?? 0);
      setTotalEscalationCounts(escalations?.count ?? 0);
      setTotalEvaluationCounts(evaluations?.count ?? 0);
      setTotalMarketingCounts(marketing?.count ?? 0);
      setOnlineUsersCount(onlineUsers?.count ?? 0);

      setEscalationAnalytics(escalationAnalyticsData);
      setEvaluationAnalytics({
        averageScore: evaluationAnalyticsData?.avgRating ?? 0,
        totalEvaluations: evaluationAnalyticsData?.total ?? 0,
      });
      setMarketingAnalytics(marketingAnalyticsData);

      // Transform evaluation ratingRanges for BarChart
      if (evaluationAnalyticsData?.ratingRanges) {
        const ratingRangeArray = Object.entries(evaluationAnalyticsData.ratingRanges).map(
          ([range, count]) => ({ name: range, count })
        );
        setEvaluationRatingRangeData(ratingRangeArray);
      }

      // Transform marketing sourceCounts for PieChart
      if (marketingAnalyticsData?.sourceCounts) {
        const marketingSourcesArray = Object.entries(marketingAnalyticsData.sourceCounts).map(
          ([source, count]) => ({ name: source, value: count })
        );
        setMarketingSourceData(marketingSourcesArray);
      }

      // Transform escalation severityCounts for PieChart
      if (escalationAnalyticsData?.severityCounts) {
        const escalationSeverityArray = Object.entries(escalationAnalyticsData.severityCounts).map(
          ([severity, count]) => ({ name: severity, value: count })
        );
        setEscalationSeverityData(escalationSeverityArray);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  fetchAllData();
}, []);


  

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
  <Button variant="success">
    Active Users : {onlineUsersCount ?? "Loading..."}
  </Button>
  <Button variant="danger">
    Inactive Users : {totalUsers && onlineUsersCount !== null 
      ? totalUsers - onlineUsersCount 
      : "Loading..."}
  </Button>
</div>

        <div>
        <div className='d-flex gap-3'>
           <div>
            <Button variant='info'>{totalUsers ?? "Loading..."} Total Users </Button>
           </div>
          <div>
             <Button variant='dark'>
            Add User
          </Button>
          </div>
         
        </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
  <div className="card-body">
    {/* Card Header */}
    <h5 className="text-muted mb-4 fw-bold">Content Overview</h5>

    {/* Draft Section */}
    <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded bg-light">
      <div>
        <h6 className="mb-1 fw-semibold">Total Drafts</h6>
        <small className="text-muted">From: 8</small>
      </div>
      <Button variant="dark" size="sm">
        Publish
      </Button>
    </div>

    {/* Publish Section */}
    <div className="d-flex align-items-center justify-content-between p-2 rounded bg-light">
      <div>
        <h6 className="mb-1 fw-semibold">Total Published</h6>
        <small className="text-muted">From: 5</small>
      </div>
      <Button variant="dark" size="sm">
        View 
      </Button>
    </div>
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
       
       <div className="col-12 col-lg-6 ">
      <div className="card border-0 shadow-sm mb-4 h-100">
        <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">QC Team</h5>
              <button onClick={() => navigate("/dashboard/qc-team")} className="btn btn-sm btn-link text-decoration-none">View All</button>
            </div>
        <div className="card-body">
          {admins.length > 0 ? (
            <ul className="list-group list-group-flush">
              {admins.slice(0, 5).map((admin) => (
                <li
                  key={admin._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{admin.name}</strong>
                    <div className="text-muted small">{admin.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center my-3">
              No Admin users found.
            </p>
          )}
        </div>
      </div>
    </div>
      <div className="col-12 col-lg-6 ">
      <div className="card border-0 shadow-sm mb-4 h-100">
        <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Sale Agent Team</h5>
              <button onClick={() => navigate("/dashboard/sales-team")} className="btn btn-sm btn-link text-decoration-none">View All</button>
            </div>
        <div className="card-body">
          {agents.length > 0 ? (
            <ul className="list-group list-group-flush">
              {agents.slice(0, 5).map((admin) => (
                <li
                  key={admin._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{admin.name}</strong>
                    <div className="text-muted small">{admin.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center my-3">
              No Admin users found.
            </p>
          )}
        </div>
      </div>
    </div>   
      </div>

    </>
  );
};

export default Overview;