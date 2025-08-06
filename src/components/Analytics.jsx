import React from "react";
import { Activity, PieChart, BarChart2, Filter } from "lucide-react";
import BitrixLeadDetails from "./BitrixLeadDetails";

const Analytics = () => {
  return (
    <div className="container-fluid px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Analytics Dashboard</h3>
        <div className="btn-group">
          <button className="btn btn-outline-primary active">Week</button>
          <button className="btn btn-outline-primary">Month</button>
          <button className="btn btn-outline-primary">Year</button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="row g-4 mb-4">
        {/* Revenue */}
        <div className="col-12 col-lg-6 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-semibold">Revenue Overview</h6>
              <Filter size={16} />
            </div>
            <div className="card-body">
              <div className="text-center text-muted py-4 bg-light rounded">
                <Activity size={40} className="mb-2" />
                <p className="mb-0">Revenue trend visualization placeholder</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Demographics */}
        <div className="col-12 col-lg-6 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-semibold">User Demographics</h6>
              <Filter size={16} />
            </div>
            <div className="card-body">
              <div className="text-center text-muted py-4 bg-light rounded">
                <PieChart size={40} className="mb-2" />
                <p className="mb-0">Demographics breakdown placeholder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-semibold">Conversion Rates</h6>
              <Filter size={16} />
            </div>
            <div className="card-body">
              <div className="text-center text-muted py-4 bg-light rounded">
                <BarChart2 size={40} className="mb-2" />
                <p className="mb-0">Conversion metrics visualization placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bitrix Lead Details */}
      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0 fw-bold">Bitrix Lead Information</h5>
              <small className="text-muted">Full CRM Lead Details from Bitrix API</small>
            </div>
            <div className="card-body">
              {/* You can make this dynamic later with a dropdown/search */}
              <BitrixLeadDetails />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
