import React from 'react';
import { Activity, PieChart, BarChart2 } from 'lucide-react';

const Analytics = () => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Analytics</h4>
        <div className="btn-group">
          <button className="btn btn-outline-primary active">Week</button>
          <button className="btn btn-outline-primary">Month</button>
          <button className="btn btn-outline-primary">Year</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Revenue Overview</h5>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="compareToggle" defaultChecked />
                <label className="form-check-label" htmlFor="compareToggle">Compare to previous period</label>
              </div>
            </div>
            <div className="card-body">
              <div className="text-center py-5 text-muted bg-light rounded">
                <Activity size={40} className="mb-2" />
                <p>Chart area - Revenue trends visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">User Demographics</h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5 text-muted bg-light rounded">
                <PieChart size={40} className="mb-2" />
                <p>Chart area - User demographics breakdown</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Conversion Rates</h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5 text-muted bg-light rounded">
                <BarChart2 size={40} className="mb-2" />
                <p>Chart area - Conversion metrics visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;