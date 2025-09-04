import { SquarePen, Trash, Loader, FileWarning } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getEvaluationOnwerApi } from "../features/evaluationApi";
import { getEscalationOnwerApi } from "../features/escalationsApi";
import { useNavigate, useParams } from "react-router-dom";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache time

const TableAdmin = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("evaluations");
  const [evaluations, setEvaluations] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [marketing, setMarketing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [hoveredRow, setHoveredRow] = useState(null);

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
          const cacheKey = `evaluations_${adminId}`;
          const cached = loadFromCache(cacheKey);
          if (cached) setEvaluations(cached);
          else {
            const evals = await getEvaluationOnwerApi(adminId);
            setEvaluations(evals);
            saveToCache(cacheKey, evals);
          }
        } else if (activeTab === "escalations") {
          const cacheKey = `escalations_${adminId}`;
          const cached = loadFromCache(cacheKey);
          if (cached) setEscalations(cached);
          else {
            const escs = await getEscalationOnwerApi(adminId);
            setEscalations(escs);
            saveToCache(cacheKey, escs);
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
  }, [activeTab, adminId]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvaluations = evaluations.slice(indexOfFirstItem, indexOfLastItem);
  const currentEscalations = escalations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    activeTab === "evaluations"
      ? evaluations.length / itemsPerPage
      : activeTab === "escalations"
      ? escalations.length / itemsPerPage
      : marketing.length / itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleString() : "-");

  const handleEdit = (id) => navigate(`/admin-details/edit?id=${id}`);

const containerStyle = {
  backgroundColor: '#ffffff',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  borderRadius: '12px',
  border: '1px solid #d1d5db',
  padding: '32px',
  maxWidth: '100%',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  overflowX: 'auto',   
  whiteSpace: 'nowrap'  
};



  const tabContainerStyle = {
    display: 'flex',
    gap: '32px',
    borderBottom: '2px solid #e5e7eb',
    marginBottom: '24px',
    paddingBottom: '8px'
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

  const tableContainerStyle = {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
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
    borderBottom: '1px solid #e5e7eb'
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
          setCurrentPage(1); // Reset to first page when changing tabs
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
            ? evaluations.length
            : tab === "escalations"
            ? escalations.length
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

  {/* Evaluations Tab */}
  {activeTab === "evaluations" && (
    <div>
      {loading ? (
        <div style={loadingStyle}>
          <Loader size={32} className="animate-spin" />
        </div>
      ) : (
        <>
          <div style={{...tableContainerStyle, overflow: 'hidden'}}>
            <div style={{overflowX: 'auto', overflowY: 'visible'}}>
              <table style={tableStyle}>
                <thead style={{...headerStyle, position: 'sticky', top: 0}}>
                  <tr>
                    <th style={headerCellStyle}>#</th>
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
                    <th style={headerCellStyle}>Rating</th>
                    <th style={headerCellStyle}>Created At</th>
                    <th style={headerCellStyle}>Edit</th>
                    <th style={lastHeaderCellStyle}>Delete</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div style={{overflow: 'auto', maxHeight: '400px'}}>
              <table style={{...tableStyle, marginTop: 0}}>
                <tbody>
                  {currentEvaluations.length > 0 ? (
                    currentEvaluations.map((row, index) => (
                      <tr
                        key={row._id || index}
                        style={getRowStyle(hoveredRow === index)}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td style={cellStyle}>{indexOfFirstItem + index + 1}</td>
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
                        <td style={cellStyle}>{row.rating || '-'}</td>
                        <td style={cellStyle}>{formatDate(row.createdAt)}</td>
                        <td style={cellStyle}>
                          <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                            <SquarePen  size={18} />
                          </button>
                        </td>
                        <td style={lastCellStyle}>
                          <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                            <Trash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="17" style={{ ...cellStyle, textAlign: 'center' }}>
                        No evaluations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {evaluations.length > itemsPerPage && (
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

  {/* Escalations Tab */}
  {activeTab === "escalations" && (
    <div>
      {loading ? (
        <div style={loadingStyle}>
          <Loader size={32} className="animate-spin" />
        </div>
      ) : (
        <>
          <div style={{...tableContainerStyle, overflow: 'hidden'}}>
            <div style={{overflowX: 'auto', overflowY: 'visible'}}>
              <table style={tableStyle}>
                <thead style={{...headerStyle, position: 'sticky', top: 0}}>
                  <tr>
                    <th style={headerCellStyle}>#</th>
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
              </table>
            </div>
            <div style={{overflow: 'auto', maxHeight: '400px'}}>
              <table style={{...tableStyle, marginTop: 0}}>
                <tbody>
                  {currentEscalations.length > 0 ? (
                    currentEscalations.map((row, index) => (
                      <tr
                        key={row._id || index}
                        style={getRowStyle(hoveredRow === index)}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td style={cellStyle}>{indexOfFirstItem + index + 1}</td>
                        <td style={cellStyle}>{row.useremail || '-'}</td>
                        <td style={cellStyle}>{row.leadID || '-'}</td>
                        <td style={cellStyle}>{row.evaluatedby || '-'}</td>
                        <td style={cellStyle}>{row.agentName || '-'}</td>
                        <td style={cellStyle}>{row.teamleader || '-'}</td>
                        <td style={cellStyle}>{row.leadSource || '-'}</td>
                        <td style={cellStyle}>{row.leadStatus || '-'}</td>
                        <td style={cellStyle}>{row.escSeverity || '-'}</td>
                        <td style={cellStyle}>{row.issueIden || '-'}</td>
                        <td style={cellStyle}>{row.escAction || '-'}</td>
                        <td style={cellStyle}>{row.documentation || '-'}</td>
                        <td style={cellStyle}>{row.successmaration || '-'}</td>
                        <td style={cellStyle}>{row.userrating || '-'}</td>
                        <td style={cellStyle}>{formatDate(row.createdAt)}</td>
                        <td style={cellStyle}>
                          <button onClick={() => handleEdit(row._id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                            <SquarePen  size={18} />
                          </button>
                        </td>
                        <td style={lastCellStyle}>
                          <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                            <Trash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="17" style={{ ...cellStyle, textAlign: 'center' }}>
                        No escalations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {escalations.length > itemsPerPage && (
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