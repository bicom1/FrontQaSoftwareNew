// TableAdmin.jsx
import { SquarePen, Trash, Loader, FileWarning, CheckCircle, Edit } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getEvaluationsByUserEmailApi, getEvaluationsUseremailPublishedApi, publishEvaluationApi } from "../features/evaluationApi";
import { getEscalationsByUserEmailApi, getEscalationsUseremailPublishedApi, publishEscalationApi } from "../features/escalationsApi";
import { useNavigate, useParams } from "react-router-dom";

const CACHE_TTL = 1000; // 1 second cache time

const TableAdmin = () => {
  const { agentName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("evaluations");
  const [activeEscalationTab, setActiveEscalationTab] = useState("published");
  const [activeEvaluationTab, setActiveEvaluationTab] = useState("published");
  const [evaluations, setEvaluations] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [marketing, setMarketing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [hoveredRow, setHoveredRow] = useState(null);

  const getCurrentUserEmail = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.email || user.useremail || 'Unknown';
    }
    
    if (agentName) {
      return agentName;
    }
    
    return 'Unknown';
  };

  const currentUserEmail = getCurrentUserEmail();

  // Filter evaluations for current user only
  const userEvaluations = evaluations.filter(ev => 
    ev.useremail === currentUserEmail || ev.agentName === currentUserEmail
  );

  // Filter evaluations based on status from API
  const publishedEvaluations = userEvaluations.filter(ev => 
    ev.status === 'published' || ev.submissionSource === 'frontend'
  );
  const draftEvaluations = userEvaluations.filter(ev => 
    ev.status === 'draft' || ev.submissionSource === 'bitrix'
  );

  // Filter escalations for current user only
  const userEscalations = escalations.filter(esc => 
    esc.useremail === currentUserEmail || esc.agentName === currentUserEmail
  );

  // Filter escalations based on status from API
  const publishedEscalations = userEscalations.filter(esc => 
    esc.status === 'published' || esc.submissionSource === 'frontend'
  );
  const draftEscalations = userEscalations.filter(esc => 
    esc.status === 'draft' || esc.submissionSource === 'bitrix'
  );

  // Cache handling
  const loadFromCache = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  };

  const saveToCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (activeTab === "evaluations") {
          if (activeEvaluationTab === "published") {
            const cacheKey = `published_evaluations_${currentUserEmail}`;
            const cached = loadFromCache(cacheKey);
            if (cached) setEvaluations(cached);
            else {
              const evals = await getEvaluationsUseremailPublishedApi(currentUserEmail);
              setEvaluations(evals);
              saveToCache(cacheKey, evals);
            }
          } else {
            const cacheKey = `draft_evaluations_${currentUserEmail}`;
            const cached = loadFromCache(cacheKey);
            if (cached) setEvaluations(cached);
            else {
              const evals = await getEvaluationsByUserEmailApi(currentUserEmail);
              setEvaluations(evals);
              saveToCache(cacheKey, evals);
            }
          }
        } else if (activeTab === "escalations") {
          if (activeEscalationTab === "published") {
            const cacheKey = `published_escalations_${currentUserEmail}`;
            const cached = loadFromCache(cacheKey);
            if (cached) setEscalations(cached);
            else {
              const escs = await getEscalationsUseremailPublishedApi(currentUserEmail);
              setEscalations(escs);
              saveToCache(cacheKey, escs);
            }
          } else {
            const cacheKey = `draft_escalations_${currentUserEmail}`;
            const cached = loadFromCache(cacheKey);
            if (cached) setEscalations(cached);
            else {
              const escs = await getEscalationsByUserEmailApi(currentUserEmail);
              setEscalations(escs);
              saveToCache(cacheKey, escs);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, activeEscalationTab, activeEvaluationTab, currentUserEmail]);

  const getCurrentEvaluations = () => {
    const currentData = activeEvaluationTab === "published" ? publishedEvaluations : draftEvaluations;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return currentData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getCurrentEscalations = () => {
    const currentData = activeEscalationTab === "published" ? publishedEscalations : draftEscalations;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return currentData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvaluations = getCurrentEvaluations();
  const currentEscalations = getCurrentEscalations();
  
  const getTotalPages = () => {
    if (activeTab === "evaluations") {
      const dataLength = activeEvaluationTab === "published" ? publishedEvaluations.length : draftEvaluations.length;
      return Math.ceil(dataLength / itemsPerPage);
    } 
    
    if (activeTab === "escalations") {
      const dataLength = activeEscalationTab === "published" ? publishedEscalations.length : draftEscalations.length;
      return Math.ceil(dataLength / itemsPerPage);
    }
    return Math.ceil(marketing.length / itemsPerPage);
  };
  
  const totalPages = getTotalPages();

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleString() : "-");

  // Navigation handlers
  const handleEditEscalation = (id, rowData) => {
    navigate(`/dashboard/qc-team/editescalation/${id}`, { state: { row: rowData } });
  };

  const handleEditEvaluation = (id, rowData) => {
    navigate(`/dashboard/qc-team/editevaluation/${id}`, { state: { row: rowData } });
  };

  // Double click handlers
  const handleRowDoubleClick = (row, type) => {
    if (type === 'escalation') {
      handleEditEscalation(row._id, row);
    } else if (type === 'evaluation') {
      handleEditEvaluation(row._id, row);
    }
  };

  // Publish handlers
  const handlePublishEscalation = async (id) => {
    try {
      setLoading(true);
      await publishEscalationApi(id);
      
      if (activeEscalationTab === "published") {
        const escs = await getEscalationsUseremailPublishedApi(currentUserEmail);
        setEscalations(escs);
      } else {
        const escs = await getEscalationsByUserEmailApi(currentUserEmail);
        setEscalations(escs);
      }
      
      setActiveEscalationTab("published");
      setCurrentPage(1);
      
    } catch (error) {
      console.error("Failed to publish escalation:", error);
      alert("Failed to publish escalation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishEvaluation = async (id) => {
    try {
      setLoading(true);
      await publishEvaluationApi(id);
      
      if (activeEvaluationTab === "published") {
        const evals = await getEvaluationsUseremailPublishedApi(currentUserEmail);
        setEvaluations(evals);
      } else {
        const evals = await getEvaluationsByUserEmailApi(currentUserEmail);
        setEvaluations(evals);
      }
      
      setActiveEvaluationTab("published");
      setCurrentPage(1);
      
    } catch (error) {
      console.error("Failed to publish evaluation:", error);
      alert("Failed to publish evaluation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add source badge style
  const getSourceBadgeStyle = (source) => ({
    display: 'inline-flex',
    alignItems: 'center',
    paddingLeft: '6px',
    paddingRight: '6px',
    paddingTop: '1px',
    paddingBottom: '1px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: '500',
    backgroundColor: source === 'frontend' ? '#dbeafe' : '#f3e8ff',
    color: source === 'frontend' ? '#1e40af' : '#7e22ce',
    marginTop: '4px'
  });

  const containerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    padding: '32px',
    maxWidth: '100%',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const tabContainerStyle = {
    display: 'flex',
    gap: '32px',
    borderBottom: '2px solid #e5e7eb',
    marginBottom: '24px',
    paddingBottom: '8px'
  };

  const subTabContainerStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    backgroundColor: '#f9fafb',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  const getTabStyle = (isActive) => ({
    paddingBottom: '12px',
    paddingLeft: '8px',
    paddingRight: '8px',
    fontSize: '16px',
    fontWeight: '600',
    borderBottom: isActive ? '3px solid #6b7280' : '3px solid transparent',
    color: isActive ? '#374151' : '#6b7280',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  const getSubTabStyle = (isActive) => ({
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '6px',
    color: isActive ? '#ffffff' : '#374151',
    backgroundColor: isActive ? '#6b7280' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  const getBadgeStyle = (isActive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: isActive ? '#6b7280' : '#e5e7eb',
    color: isActive ? '#ffffff' : '#374151'
  });

  const getStatusBadgeStyle = (status) => ({
    display: 'inline-flex',
    alignItems: 'center',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '2px',
    paddingBottom: '2px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: status === 'published' ? '#dcfce7' : '#fef3c7',
    color: status === 'published' ? '#166534' : '#92400e'
  });

  const scrollableContainerStyle = {
    overflowX: 'scroll',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    maxWidth: '100%'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1000px'
  };

  const headerStyle = {
    backgroundColor: '#4b5563',
    color: '#ffffff'
  };

  const headerCellStyle = {
    padding: '16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderRight: '1px solid #6b7280'
  };

  const lastHeaderCellStyle = {
    ...headerCellStyle,
    borderRight: 'none'
  };

  const getRowStyle = (isHovered) => ({
    backgroundColor: isHovered ? '#f9fafb' : '#ffffff',
    transition: 'background-color 0.2s ease',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer'
  });

  const cellStyle = {
    padding: '16px',
    borderRight: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#374151'
  };

  const lastCellStyle = {
    ...cellStyle,
    borderRight: 'none'
  };

  const paginationContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '24px'
  };

  const paginationStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    overflow: 'hidden'
  };

  const paginationButtonStyle = {
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '8px',
    paddingBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const activePaginationButtonStyle = {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#6b7280',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    paddingTop: '48px',
    paddingBottom: '48px'
  };

  const emptyTextStyle = {
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '500'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px'
  };

  return (
    <div style={containerStyle}>
      <div style={tabContainerStyle}>
        {["evaluations", "escalations", "marketing"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            style={getTabStyle(activeTab === tab)}
            onMouseEnter={(e) => {
              if (activeTab !== tab) {
                e.target.style.color = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab) {
                e.target.style.color = '#6b7280';
              }
            }}
          >
            <span style={{ textTransform: 'capitalize' }}>{tab}</span>
            <span style={getBadgeStyle(activeTab === tab)}>
              {tab === "evaluations"
                ? userEvaluations.length
                : tab === "escalations"
                ? userEscalations.length
                : marketing.length}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '6px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FileWarning size={16} />
          {error}
        </div>
      )}

      {/* Escalations Tab */}
      {activeTab === "escalations" && (
        <div>
          <div style={subTabContainerStyle}>
            <button
              onClick={() => {
                setActiveEscalationTab("published");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(activeEscalationTab === "published")}
            >
              <CheckCircle size={16} />
              Published
              <span style={{
                ...getBadgeStyle(activeEscalationTab === "published"),
                backgroundColor: activeEscalationTab === "published" ? '#10b981' : '#e5e7eb',
                color: activeEscalationTab === "published" ? '#ffffff' : '#374151'
              }}>
                {publishedEscalations.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveEscalationTab("draft");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(activeEscalationTab === "draft")}
            >
              <Edit size={16} />
              Drafts
              <span style={{
                ...getBadgeStyle(activeEscalationTab === "draft"),
                backgroundColor: activeEscalationTab === "draft" ? '#f59e0b' : '#e5e7eb',
                color: activeEscalationTab === "draft" ? '#ffffff' : '#374151'
              }}>
                {draftEscalations.length}
              </span>
            </button>
          </div>

          {loading ? (
            <div style={loadingStyle}>
              <Loader size={32} className="animate-spin" />
            </div>
          ) : (
            <>
              <div style={scrollableContainerStyle}>
                <table style={tableStyle}>
                  <thead style={headerStyle}>
                    <tr>
                      <th style={headerCellStyle}>#</th>
                      <th style={headerCellStyle}>Source</th>
                      <th style={headerCellStyle}>Publish</th>
                      <th style={headerCellStyle}>Email</th>
                      <th style={headerCellStyle}>Lead ID</th>
                      <th style={headerCellStyle}>Evaluated By</th>
                      <th style={headerCellStyle}>Agent Name</th>
                      <th style={headerCellStyle}>Team Leader</th>
                      <th style={headerCellStyle}>Lead Source</th>
                      <th style={headerCellStyle}>Lead Status</th>
                      <th style={headerCellStyle}>Esc Severity</th>
                      <th style={headerCellStyle}>Issue Identified</th>
                      <th style={headerCellStyle}>Escalation Action</th>
                      <th style={headerCellStyle}>Documentation</th>
                      <th style={headerCellStyle}>Success Metrics</th>
                      <th style={headerCellStyle}>User Rating</th>
                      <th style={headerCellStyle}>Created At</th>
                      <th style={headerCellStyle}>Edit</th>
                      <th style={lastHeaderCellStyle}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEscalations.length > 0 ? (
                      currentEscalations.map((row, index) => {
                        const status = row.status || 'draft';
                        const source = row.submissionSource || 'bitrix';
                        return (
                          <tr
                            key={row._id || index}
                            style={getRowStyle(hoveredRow === index)}
                            onMouseEnter={() => setHoveredRow(index)}
                            onMouseLeave={() => setHoveredRow(null)}
                            onDoubleClick={() => handleRowDoubleClick(row, 'escalation')}
                            title="Double-click to edit"
                          >
                            <td style={cellStyle}>{indexOfFirstItem + index + 1}</td>
                            <td style={cellStyle}>
                              
                              <span style={getSourceBadgeStyle(source)}>
                                {source === 'frontend' ? 'Frontend' : 'Bitrix'}
                              </span>
                            </td>
                            <td style={cellStyle}>
                              {status === 'draft' ? (
                                <button
                                  onClick={() => handlePublishEscalation(row._id)}
                                  style={{ 
                                    border: 'none', 
                                    background: 'none', 
                                    cursor: 'pointer',
                                    color: '#10b981'
                                  }}
                                  title="Publish this escalation"
                                  disabled={loading}
                                >
                                  <CheckCircle size={18} />
                                </button>
                              ) : (
                                <span style={{ color: '#6b7280', fontSize: '12px' }}>Published</span>
                              )}
                            </td>
                            <td style={cellStyle}>{row.useremail || '-'}</td>
                            <td style={cellStyle}>{row.leadID || '-'}</td>
                            <td style={cellStyle}>{row.evaluatedby || '-'}</td>
                            <td style={cellStyle}>{row.agentName || '-'}</td>
                            <td style={cellStyle}>{row.teamleader || '-'}</td>
                            <td style={cellStyle}>{row.leadsource || '-'}</td>
                            <td style={cellStyle}>{row.leadStatus || '-'}</td>
                            <td style={cellStyle}>{row.escSeverity || '-'}</td>
                            <td style={cellStyle}>
                              {row.issueIden ? (
                                <div style={{
                                  maxWidth: '150px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }} title={row.issueIden}>
                                  {row.issueIden}
                                </div>
                              ) : '-'}
                            </td>
                            <td style={cellStyle}>
                              {row.escAction ? (
                                <div style={{
                                  maxWidth: '150px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }} title={row.escAction}>
                                  {row.escAction}
                                </div>
                              ) : '-'}
                            </td>
                            <td style={cellStyle}>
                              {row.documentation ? (
                                <div style={{
                                  maxWidth: '150px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }} title={row.documentation}>
                                  {row.documentation}
                                </div>
                              ) : '-'}
                            </td>
                            <td style={cellStyle}>
                              {row.successmaration ? (
                                <div style={{
                                  maxWidth: '150px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }} title={row.successmaration}>
                                  {row.successmaration}
                                </div>
                              ) : '-'}
                            </td>
                            <td style={cellStyle}>{row.userrating || '-'}</td>
                            <td style={cellStyle}>{formatDate(row.createdAt)}</td>
                            <td style={cellStyle}>
                              <button
                                onClick={() => handleEditEscalation(row._id, row)}
                                style={{ 
                                  border: 'none', 
                                  background: 'none', 
                                  cursor: 'pointer',
                                  color: '#6b7280'
                                }}
                                title="Edit escalation"
                              >
                                <SquarePen size={18} />
                              </button>
                            </td>
                            <td style={lastCellStyle}>
                              <button style={{ 
                                border: 'none', 
                                background: 'none', 
                                cursor: 'pointer', 
                                color: '#ef4444' 
                              }}>
                                <Trash size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="19" style={{ ...cellStyle, textAlign: 'center' }}>
                          {activeEscalationTab === "published" 
                            ? "No published escalations found for your account"
                            : "No draft escalations found for your account"
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {((activeEscalationTab === "published" && publishedEscalations.length > itemsPerPage) ||
                (activeEscalationTab === "draft" && draftEscalations.length > itemsPerPage)) && (
                <div style={paginationContainerStyle}>
                  <div style={paginationStyle}>
                    <button
                      style={paginationButtonStyle}
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        style={page === currentPage ? activePaginationButtonStyle : paginationButtonStyle}
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      style={paginationButtonStyle}
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Evaluations Tab */}
      {activeTab === "evaluations" && (
        <div>
          <div style={subTabContainerStyle}>
            <button
              onClick={() => {
                setActiveEvaluationTab("published");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(activeEvaluationTab === "published")}
            >
              <CheckCircle size={16} />
              Published
              <span style={{
                ...getBadgeStyle(activeEvaluationTab === "published"),
                backgroundColor: activeEvaluationTab === "published" ? '#10b981' : '#e5e7eb',
                color: activeEvaluationTab === "published" ? '#ffffff' : '#374151'
              }}>
                {publishedEvaluations.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveEvaluationTab("draft");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(activeEvaluationTab === "draft")}
            >
              <Edit size={16} />
              Drafts
              <span style={{
                ...getBadgeStyle(activeEvaluationTab === "draft"),
                backgroundColor: activeEvaluationTab === "draft" ? '#f59e0b' : '#e5e7eb',
                color: activeEvaluationTab === "draft" ? '#ffffff' : '#374151'
              }}>
                {draftEvaluations.length}
              </span>
            </button>
          </div>

          {loading ? (
            <div style={loadingStyle}>
              <Loader size={32} className="animate-spin" />
            </div>
          ) : (
            <>
              <div style={scrollableContainerStyle}>
                <table style={tableStyle}>
                  <thead style={headerStyle}>
                    <tr>
                      <th style={headerCellStyle}>#</th>
                      <th style={headerCellStyle}>Source</th>
                      <th style={headerCellStyle}>Publish</th>
                      <th style={headerCellStyle}>Email</th>
                      <th style={headerCellStyle}>Lead ID</th>
                      <th style={headerCellStyle}>Agent Name</th>
                      <th style={headerCellStyle}>MOD</th>
                      <th style={headerCellStyle}>Team Leader</th>
                      <th style={headerCellStyle}>Greetings</th>
                      <th style={headerCellStyle}>Accuracy</th>
                      <th style={headerCellStyle}>Building</th>
                      <th style={headerCellStyle}>Presenting</th>
                      <th style={headerCellStyle}>Closing</th>
                      <th style={headerCellStyle}>Bonus</th>
                      <th style={headerCellStyle}>Evaluation Summary</th>
                      <th style={headerCellStyle}>Created At</th>
                      <th style={headerCellStyle}>Edit</th>
                      <th style={lastHeaderCellStyle}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEvaluations.length > 0 ? (
                      currentEvaluations.map((row, index) => {
                        const status = row.status || 'draft';
                        const source = row.submissionSource || 'bitrix';
                        return (
                          <tr
                            key={row._id || index}
                            style={getRowStyle(hoveredRow === index)}
                            onMouseEnter={() => setHoveredRow(index)}
                            onMouseLeave={() => setHoveredRow(null)}
                            onDoubleClick={() => handleRowDoubleClick(row, 'evaluation')}
                            title="Double-click to edit"
                          >
                            <td style={cellStyle}>{indexOfFirstItem + index + 1}</td>
                            <td style={cellStyle}>
                              
                              <span style={getSourceBadgeStyle(source)}>
                                {source === 'frontend' ? 'Frontend' : 'Bitrix'}
                              </span>
                            </td>
                            <td style={cellStyle}>
                              {status === 'draft' ? (
                                <button
                                  onClick={() => handlePublishEvaluation(row._id)}
                                  style={{ 
                                    border: 'none', 
                                    background: 'none', 
                                    cursor: 'pointer',
                                    color: '#10b981'
                                  }}
                                  title="Publish this evaluation"
                                  disabled={loading}
                                >
                                  <CheckCircle size={18} />
                                </button>
                              ) : (
                                <span style={{ color: '#6b7280', fontSize: '12px' }}>Published</span>
                              )}
                            </td>
                            <td style={cellStyle}>{row.useremail || '-'}</td>
                            <td style={cellStyle}>{row.leadID || '-'}</td>
                            <td style={cellStyle}>{row.agentName || '-'}</td>
                            
                            <td style={cellStyle}>{row.mod || '-'}</td>
                            <td style={cellStyle}>{row.teamleader || '-'}</td>
                            <td style={cellStyle}>{row.greetings || '-'}</td>
                            <td style={cellStyle}>{row.accuracy || '-'}</td>
                            <td style={cellStyle}>{row.building || '-'}</td>
                            <td style={cellStyle}>{row.presenting || '-'}</td>
                            <td style={cellStyle}>{row.closing || '-'}</td>
                            <td style={cellStyle}>{row.bonus || '-'}</td>
                            <td style={cellStyle}>{row.evaluationsummary || '-'}</td>
                            <td style={cellStyle}>{formatDate(row.createdAt)}</td>
                            <td style={cellStyle}>
                              <button
                                onClick={() => handleEditEvaluation(row._id, row)}
                                style={{ 
                                  border: 'none', 
                                  background: 'none', 
                                  cursor: 'pointer',
                                  color: '#6b7280'
                                }}
                                title="Edit evaluation"
                              >
                                <SquarePen size={18} />
                              </button>
                            </td>
                            <td style={lastCellStyle}>
                              <button style={{ 
                                border: 'none', 
                                background: 'none', 
                                cursor: 'pointer', 
                                color: '#ef4444' 
                              }}>
                                <Trash size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="18" style={{ ...cellStyle, textAlign: 'center' }}>
                          {activeEvaluationTab === "published" 
                            ? "No published evaluations found for your account"
                            : "No draft evaluations found for your account"
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {((activeEvaluationTab === "published" && publishedEvaluations.length > itemsPerPage) ||
                (activeEvaluationTab === "draft" && draftEvaluations.length > itemsPerPage)) && (
                <div style={paginationContainerStyle}>
                  <div style={paginationStyle}>
                    <button
                      style={paginationButtonStyle}
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        style={page === currentPage ? activePaginationButtonStyle : paginationButtonStyle}
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      style={paginationButtonStyle}
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Marketing Tab */}
      {activeTab === "marketing" && (
        <div>
          {marketing.length > 0 ? (
            <p style={{ color: '#374151', fontSize: '16px' }}>Marketing records go here.</p>
          ) : (
            <div style={emptyStateStyle}>
              <p style={emptyTextStyle}>No marketing records available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableAdmin;