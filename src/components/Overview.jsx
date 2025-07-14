import React, { useEffect, useState } from 'react';
import { BarChart2, PieChart } from 'lucide-react';
import { totalUserCountApi } from '../features/userApis';

    


const Overview = () => {

  const [totalUsers, setTotalUsers] = useState(null);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const count = await totalUserCountApi();
        setTotalUsers(count);
      } catch (err) {
        console.error("Failed to fetch total users:", err);
      }
    };
    fetchTotalUsers();
  }, []);
  
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Dashboard Overview</h4>
        <div>
          <select className="form-select form-select-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
            <option>Last quarter</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Total Users</h6>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">{totalUsers ?? "Loading..."}</h2>
              </div>
              <div className="text-muted small mt-2">Compared to last week</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Active Projects</h6>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">42</h2>
                <span className="badge bg-danger ms-2">-3%</span>
              </div>
              <div className="text-muted small mt-2">2 projects completed this week</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Total Revenue</h6>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">$86,589</h2>
                <span className="badge bg-success ms-2">+8%</span>
              </div>
              <div className="text-muted small mt-2">$10,234 this month</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Tasks Completed</h6>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">187</h2>
                <span className="badge bg-success ms-2">+24%</span>
              </div>
              <div className="text-muted small mt-2">32 tasks pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Performance Overview</h5>
              <div className="btn-group btn-group-sm">
                <button className="btn btn-outline-secondary active">Daily</button>
                <button className="btn btn-outline-secondary">Weekly</button>
                <button className="btn btn-outline-secondary">Monthly</button>
              </div>
            </div>
            <div className="card-body">
              <div className="text-center py-5 text-muted bg-light rounded">
                <BarChart2 size={40} className="mb-2" />
                <p>Chart area - Performance metrics visualization</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Traffic Sources</h5>
              <button className="btn btn-sm btn-link text-decoration-none">View Details</button>
            </div>
            <div className="card-body">
              <div className="text-center py-5 text-muted bg-light rounded">
                <PieChart size={40} className="mb-2" />
                <p>Chart area - Traffic source breakdown</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Tasks */}
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
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

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming Tasks</h5>
              <button className="btn btn-sm btn-primary">+ Add Task</button>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                <li className="list-group-item p-3">
                  <div className="form-check d-flex align-items-center">
                    <input className="form-check-input me-3" type="checkbox" id="task1" />
                    <div className="flex-grow-1">
                      <label className="form-check-label fw-bold" htmlFor="task1">
                        Update user interface for client portal
                      </label>
                      <div className="d-flex align-items-center mt-1">
                        <span className="badge bg-warning text-dark me-2">High Priority</span>
                        <span className="text-muted small">Due in 2 days</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="list-group-item p-3">
                  <div className="form-check d-flex align-items-center">
                    <input className="form-check-input me-3" type="checkbox" id="task2" />
                    <div className="flex-grow-1">
                      <label className="form-check-label fw-bold" htmlFor="task2">
                        Prepare monthly financial report
                      </label>
                      <div className="d-flex align-items-center mt-1">
                        <span className="badge bg-danger text-white me-2">Urgent</span>
                        <span className="text-muted small">Due tomorrow</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="list-group-item p-3">
                  <div className="form-check d-flex align-items-center">
                    <input className="form-check-input me-3" type="checkbox" id="task3" />
                    <div className="flex-grow-1">
                      <label className="form-check-label fw-bold" htmlFor="task3">
                        Schedule team meeting for project kickoff
                      </label>
                      <div className="d-flex align-items-center mt-1">
                        <span className="badge bg-info text-white me-2">Medium</span>
                        <span className="text-muted small">Due in 3 days</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="list-group-item p-3">
                  <div className="form-check d-flex align-items-center">
                    <input className="form-check-input me-3" type="checkbox" id="task4" />
                    <div className="flex-grow-1">
                      <label className="form-check-label fw-bold" htmlFor="task4">
                        Review and approve content for marketing campaign
                      </label>
                      <div className="d-flex align-items-center mt-1">
                        <span className="badge bg-secondary text-white me-2">Low</span>
                        <span className="text-muted small">Due in 5 days</span>
                      </div>
                    </div>
                  </div>
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