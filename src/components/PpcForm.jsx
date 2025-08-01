import React, { useState } from 'react';
import { CheckCircle2, User, Mail, Hash, Target, TrendingUp, DollarSign, MousePointer, Eye, Calendar, Clock, FileText, Award, BarChart3 } from 'lucide-react';

const PPCForm = () => {
  const [evaluation, setEvaluation] = useState({
    email: "user@example.com",
    campaignId: "",
    campaignName: "",
    campaignManager: "",
    platform: "",
    keywordResearch: "",
    adCopy: "",
    targeting: "",
    bidStrategy: "",
    landingPage: "",
    tracking: "",
    evaluationsummary: "",
    rating: 0
  });

  const [userRate, setUserRate] = useState({
    keywordResearch: { rateVal: 0 },
    adCopy: { rateVal: 0 },
    targeting: { rateVal: 0 },
    bidStrategy: { rateVal: 0 },
    landingPage: { rateVal: 0 },
    tracking: { rateVal: 0 },
  });

  // Static campaign managers data
  const campaignManagers = [
    { _id: "1", managerName: "Alex Johnson" },
    { _id: "2", managerName: "Maria Garcia" },
    { _id: "3", managerName: "David Chen" },
    { _id: "4", managerName: "Lisa Thompson" }
  ];

  const handleChange = (name, value) => {
    setEvaluation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const total = Object.values(userRate).reduce((sum, cat) => sum + cat.rateVal, 0);
    
    console.log("PPC Form submitted:", { ...evaluation, rating: total });
    alert("PPC Campaign evaluation submitted successfully! Thank you for your feedback.");
  };

  const currentRating = Object.values(userRate).reduce((sum, cat) => sum + cat.rateVal, 0);
  const maxRating = 96;
  const ratingPercentage = (currentRating / maxRating) * 100;

  const evaluationCriteria = [
    {
      id: 'keywordResearch',
      title: 'Keyword Research & Selection',
      description: 'Comprehensive keyword analysis and strategic selection for optimal campaign performance.',
      icon: <Target size={18} />,
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)',
      goodOption: {
        value: 'comprehensive',
        text: 'Conducts thorough keyword research with proper match types, negative keywords, and competitive analysis',
        points: 16
      }
    },
    {
      id: 'adCopy',
      title: 'Ad Copy & Creative Quality',
      description: 'Compelling and relevant ad copy that drives engagement and conversions.',
      icon: <FileText size={18} />,
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.1)',
      goodOption: {
        value: 'compelling',
        text: 'Creates compelling, relevant ad copy with strong CTAs and proper ad extensions utilization',
        points: 16
      }
    },
    {
      id: 'targeting',
      title: 'Audience Targeting & Segmentation',
      description: 'Precise audience targeting and demographic segmentation for maximum ROI.',
      icon: <Eye size={18} />,
      color: '#dc2626',
      bgColor: 'rgba(220, 38, 38, 0.1)',
      goodOption: {
        value: 'precise',
        text: 'Implements precise audience targeting with proper demographic, geographic, and behavioral segmentation',
        points: 16
      }
    },
    {
      id: 'bidStrategy',
      title: 'Bid Strategy & Budget Management',
      description: 'Effective bid management and budget allocation for cost-efficient performance.',
      icon: <DollarSign size={18} />,
      color: '#7c3aed',
      bgColor: 'rgba(124, 58, 237, 0.1)',
      goodOption: {
        value: 'strategic',
        text: 'Employs strategic bid management with appropriate budget allocation and automated bidding strategies',
        points: 16
      }
    },
    {
      id: 'landingPage',
      title: 'Landing Page Optimization',
      description: 'Well-optimized landing pages that align with ad content and drive conversions.',
      icon: <MousePointer size={18} />,
      color: '#ea580c',
      bgColor: 'rgba(234, 88, 12, 0.1)',
      goodOption: {
        value: 'optimized',
        text: 'Ensures landing pages are well-optimized, relevant to ad content, and designed for conversion',
        points: 16
      }
    },
    {
      id: 'tracking',
      title: 'Analytics & Performance Tracking',
      description: 'Comprehensive tracking setup and data-driven optimization approach.',
      icon: <BarChart3 size={18} />,
      color: '#0891b2',
      bgColor: 'rgba(8, 145, 178, 0.1)',
      goodOption: {
        value: 'comprehensive',
        text: 'Implements comprehensive tracking with proper conversion setup and data-driven optimization',
        points: 16
      }
    }
  ];

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 80) return { text: 'Excellent', class: 'text-success', bgClass: 'bg-success-subtle' };
    if (percentage >= 60) return { text: 'Good', class: 'text-primary', bgClass: 'bg-primary-subtle' };
    if (percentage >= 40) return { text: 'Average', class: 'text-warning', bgClass: 'bg-warning-subtle' };
    return { text: 'Needs Improvement', class: 'text-danger', bgClass: 'bg-danger-subtle' };
  };

  const performanceLevel = getPerformanceLevel(ratingPercentage);
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <style jsx>{`
        .gradient-bg {
          background: #f4f4f4;
          min-height: 100vh;
        }
        
        .header-section {
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-bottom: 1px solid #e2e8f0;
        }
        
        .icon-badge {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .custom-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        
        .custom-card:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .progress-header {
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          border-radius: 16px 16px 0 0;
        }
        
        .progress-custom {
          height: 12px;
          background-color: #e2e8f0;
          border-radius: 6px;
        }
        
        .progress-bar-custom {
          background: linear-gradient(90deg, #3b82f6 0%, #4f46e5 100%);
          border-radius: 6px;
          transition: width 0.7s ease;
        }
        
        .form-control-modern {
          border-radius: 12px;
          border: 1px solid #d1d5db;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }
        
        .form-control-modern:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .radio-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .radio-card:hover {
          background-color: #f9fafb;
        }
        
        .radio-card.selected-primary {
          border-color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.05);
        }
        
        .radio-card.selected-success {
          border-color: #10b981;
          background-color: rgba(16, 185, 129, 0.05);
        }
        
        .radio-card.selected-danger {
          border-color: #ef4444;
          background-color: rgba(239, 68, 68, 0.05);
        }
        
        .criteria-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .badge-points {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 20px;
        }
        
        .final-score-card {
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          border-radius: 16px;
          box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          border: none;
          border-radius: 16px;
          padding: 16px 32px;
          font-weight: 600;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(0,0,0,0.2);
          background: linear-gradient(135deg, #047857 0%, #059669 100%);
        }
        
        .section-header {
          border-bottom: 1px solid #e5e7eb;
          padding: 1.5rem;
        }
        
        .datetime-info {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .mode-selection {
          gap: 16px;
        }
        
        .readonly-field {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }
      `}</style>

      <div className="gradient-bg">
        {/* Header Section */}
        <div className="header-section">
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center mb-2">
                  <div className="icon-badge me-3">
                    <Target size={20} />
                  </div>
                  <h1 className="h2 fw-bold text-dark mb-0">PPC Campaign Evaluation</h1>
                </div>
                <p className="text-muted mb-0 ms-5">Comprehensive assessment and performance analysis system</p>
              </div>
              <div className="col-auto text-end">
                <div className="datetime-info d-flex align-items-center mb-1">
                  <Calendar size={16} className="me-1" />
                  {today}
                </div>
                <div className="datetime-info d-flex align-items-center">
                  <Clock size={16} className="me-1" />
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              {/* Progress Card */}
              <div className="custom-card mb-4">
                <div className="progress-header text-white p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <TrendingUp size={20} className="me-2" />
                      <span className="fw-semibold">Evaluation Progress</span>
                    </div>
                    <div className="text-end">
                      <div className="h3 fw-bold mb-0">{currentRating}</div>
                      <small style={{ color: 'rgba(255,255,255,0.8)' }}>out of {maxRating} points</small>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fw-medium text-dark">Completion Status</span>
                    <span className={`badge ${performanceLevel.bgClass} ${performanceLevel.class}`}>
                      {performanceLevel.text}
                    </span>
                  </div>
                  <div className="progress-custom">
                    <div 
                      className="progress-bar-custom h-100"
                      style={{ width: `${ratingPercentage}%` }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <small className="text-muted">0%</small>
                    <small className="text-muted">{Math.round(ratingPercentage)}%</small>
                    <small className="text-muted">100%</small>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <FileText size={20} className="me-2 text-primary" />
                    Campaign Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="row g-4">
                    {/* Email Field */}
                    <div className="col-12">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Mail size={16} className="me-2 text-primary" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-modern readonly-field"
                        value={evaluation.email}
                        readOnly
                      />
                    </div>

                    {/* Campaign ID */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Hash size={16} className="me-2 text-primary" />
                        Campaign ID
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-modern"
                        placeholder="Enter Campaign ID"
                        value={evaluation.campaignId}
                        onChange={(e) => handleChange("campaignId", e.target.value)}
                      />
                    </div>

                    {/* Campaign Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Target size={16} className="me-2 text-primary" />
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-modern"
                        placeholder="Enter Campaign Name"
                        value={evaluation.campaignName}
                        onChange={(e) => handleChange("campaignName", e.target.value)}
                      />
                    </div>

                    {/* Campaign Manager */}
                    <div className="col-12">
                      <label className="form-label fw-medium d-flex align-items-center mb-3">
                        <User size={16} className="me-2 text-primary" />
                        Campaign Manager
                      </label>
                      <div className="row g-3">
                        {campaignManagers.map((manager) => (
                          <div key={manager._id} className="col-md-6">
                            <div className={`radio-card ${evaluation.campaignManager === manager.managerName ? 'selected-primary' : ''}`}>
                              <label className="form-check-label d-flex align-items-center mb-0 w-100">
                                <input
                                  type="radio"
                                  name="campaignManager"
                                  value={manager.managerName}
                                  checked={evaluation.campaignManager === manager.managerName}
                                  onChange={(e) => handleChange("campaignManager", e.target.value)}
                                  className="form-check-input me-3"
                                />
                                <span className="fw-medium">{manager.managerName}</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Platform */}
                    <div className="col-12">
                      <label className="form-label fw-medium d-flex align-items-center mb-3">
                        <BarChart3 size={16} className="me-2 text-primary" />
                        Advertising Platform
                      </label>
                      <div className="d-flex mode-selection flex-wrap">
                        {['Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'Microsoft Ads'].map((platform) => (
                          <div key={platform} className={`radio-card ${evaluation.platform === platform ? 'selected-primary' : ''}`}>
                            <label className="form-check-label d-flex align-items-center mb-0">
                              <input
                                type="radio"
                                name="platform"
                                value={platform}
                                checked={evaluation.platform === platform}
                                onChange={(e) => handleChange("platform", e.target.value)}
                                className="form-check-input me-3"
                              />
                              <span className="fw-medium">{platform}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Criteria */}
              {evaluationCriteria.map((criteria, index) => (
                <div key={criteria.id} className="custom-card mb-4">
                  <div className="section-header">
                    <div className="d-flex align-items-start">
                      <div 
                        className="criteria-icon me-3"
                        style={{ backgroundColor: criteria.bgColor, color: criteria.color }}
                      >
                        {criteria.icon}
                      </div>
                      <div className="flex-fill">
                        <h4 className="h5 fw-semibold text-dark mb-1">{criteria.title}</h4>
                        <p className="text-muted small mb-0 lh-base">{criteria.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="row g-3">
                      {/* Good Option */}
                      <div className="col-12">
                        <div className={`radio-card ${evaluation[criteria.id] === criteria.goodOption.value ? 'selected-success' : ''}`}>
                          <label className="form-check-label d-flex align-items-start mb-0 w-100">
                            <input
                              type="radio"
                              name={criteria.id}
                              value={criteria.goodOption.value}
                              checked={evaluation[criteria.id] === criteria.goodOption.value}
                              onChange={(e) => {
                                handleChange(criteria.id, e.target.value);
                                setUserRate(pre => ({ ...pre, [criteria.id]: { rateVal: criteria.goodOption.points } }));
                              }}
                              className="form-check-input me-3 mt-1"
                            />
                            <div className="flex-fill">
                              <div className="d-flex align-items-start mb-2">
                                <CheckCircle2 size={20} className="text-success me-2 mt-0" style={{flexShrink: 0}} />
                                <span className="fw-medium text-dark flex-fill">Meets Standards</span>
                                <span className="badge bg-success badge-points">
                                  +{criteria.goodOption.points} pts
                                </span>
                              </div>
                              <p className="text-muted small mb-0 lh-base" style={{paddingLeft: '28px'}}>
                                {criteria.goodOption.text}
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      {/* Poor Option */}
                      <div className="col-12">
                        <div className={`radio-card ${evaluation[criteria.id] === "poor" ? 'selected-danger' : ''}`}>
                          <label className="form-check-label d-flex align-items-start mb-0 w-100">
                            <input
                              type="radio"
                              name={criteria.id}
                              value="poor"
                              checked={evaluation[criteria.id] === "poor"}
                              onChange={(e) => {
                                handleChange(criteria.id, e.target.value);
                                setUserRate(pre => ({ ...pre, [criteria.id]: { rateVal: 0 } }));
                              }}
                              className="form-check-input me-3 mt-1"
                            />
                            <div className="flex-fill">
                              <div className="d-flex align-items-start mb-2">
                                <div 
                                  className="me-2 mt-0" 
                                  style={{
                                    width: '20px', 
                                    height: '20px', 
                                    border: '2px solid #ef4444', 
                                    borderRadius: '50%',
                                    flexShrink: 0
                                  }}
                                ></div>
                                <span className="fw-medium text-dark flex-fill">Below Standards</span>
                                <span className="badge bg-danger badge-points">
                                  0 pts
                                </span>
                              </div>
                              <p className="text-muted small mb-0 lh-base" style={{paddingLeft: '28px'}}>
                                Performance does not meet the required standards for this criteria
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Evaluation Summary */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <FileText size={20} className="me-2 text-primary" />
                    Campaign Evaluation Summary
                  </h3>
                </div>
                <div className="p-4">
                  <label className="form-label fw-medium text-dark mb-3">
                    Performance Analysis & Recommendations
                  </label>
                  <textarea
                    className="form-control form-control-modern"
                    placeholder="Please provide detailed analysis of campaign performance, key insights, areas for optimization, and specific recommendations for improving ROI and campaign effectiveness..."
                    rows="5"
                    value={evaluation.evaluationsummary}
                    onChange={(e) => handleChange("evaluationsummary", e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>

              {/* Final Score Summary */}
              <div className="final-score-card text-white mb-4">
                <div className="p-5 text-center">
                  <h2 className="h3 fw-bold mb-4">Final Campaign Score</h2>
                  <div className="d-flex align-items-center justify-content-center mb-4">
                    <div className="display-4 fw-bold me-2">{currentRating}</div>
                    <div className="h4" style={{ color: 'rgba(255,255,255,0.8)' }}>/ {maxRating}</div>
                  </div>
                  <div className={`badge ${performanceLevel.bgClass} ${performanceLevel.class} px-3 py-2`}>
                    Campaign Performance: {performanceLevel.text}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-grid">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn submit-btn text-white fw-semibold"
                >
                  Submit Campaign Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PPCForm;