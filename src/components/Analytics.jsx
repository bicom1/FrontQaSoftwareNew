// src/components/Analytics.jsx
import React, { useState } from "react";
import { Activity, PieChart, BarChart2, Filter, Search } from "lucide-react";
import BitrixLeadDetails from "./BitrixLeadDetails";

const Analytics = () => {
  const [leadId, setLeadId] = useState(""); // Default lead ID
  const [inputId, setInputId] = useState(""); // Controlled input value

  const handleSearch = (e) => {
    e.preventDefault();
    setLeadId(inputId.trim());
  };

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

      {/* Bitrix Lead Search + Result */}
      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-bold">Bitrix Lead Search</h5>
                <small className="text-muted">Enter a Lead ID to fetch details</small>
              </div>
            </div>
            <div className="card-body">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-4 d-flex align-items-center gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Lead ID (e.g., 19380)"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                />
                <button type="submit" className="btn btn-primary d-flex align-items-center">
                  <Search size={16} className="me-1" />
                  Search
                </button>
              </form>

              {/* Lead Details */}
              <BitrixLeadDetails leadId={leadId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;


