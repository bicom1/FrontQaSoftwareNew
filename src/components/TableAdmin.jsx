import React, { useState } from "react";

const TableAdmin = () => {
  const [activeTab, setActiveTab] = useState("evaluations");

  const evaluations = [
    {
      email: "aysha.shalab32@gmail.com",
      leadId: "1234",
      agentName: "Aysha",
      teamLeader: "Aysha",
      mode: "Call",
      responseTime: "—",
      greetings: "uses",
      accuracy: "questions",
      rapport: "skills",
      solutions: "appointment",
      closing: "Professionally",
      bonus: "customer",
      summary: "aysha shalabi",
    },
  ];

  const escalations = [
    { id: 1, title: "Escalation Example", status: "Open" },
  ];

  const marketing = [];

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

  const escalationItemStyle = {
    padding: '20px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    transition: 'all 0.2s ease',
    marginBottom: '16px'
  };

  const escalationContentStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const escalationTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151'
  };

  const escalationStatusStyle = {
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '4px',
    paddingBottom: '4px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    borderRadius: '6px'
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

  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div style={containerStyle}>
      {/* Tabs */}
      <div style={tabContainerStyle}>
        {["evaluations", "escalations", "marketing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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

      {/* Evaluations Tab */}
      {activeTab === "evaluations" && (
        <div>
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead style={headerStyle}>
                <tr>
                  <th style={headerCellStyle}>#</th>
                  <th style={headerCellStyle}>Email</th>
                  <th style={headerCellStyle}>Lead ID</th>
                  <th style={headerCellStyle}>Agent Name</th>
                  <th style={headerCellStyle}>Team Leader</th>
                  <th style={headerCellStyle}>Mode</th>
                  <th style={headerCellStyle}>Response</th>
                  <th style={headerCellStyle}>Greetings</th>
                  <th style={headerCellStyle}>Accuracy</th>
                  <th style={headerCellStyle}>Rapport</th>
                  <th style={headerCellStyle}>Solutions</th>
                  <th style={headerCellStyle}>Closing</th>
                  <th style={headerCellStyle}>Bonus</th>
                  <th style={lastHeaderCellStyle}>Summary</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((row, index) => (
                  <tr
                    key={index}
                    style={getRowStyle(hoveredRow === index)}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={cellStyle}>{index + 1}</td>
                    <td style={cellStyle}>{row.email}</td>
                    <td style={cellStyle}>{row.leadId}</td>
                    <td style={cellStyle}>{row.agentName}</td>
                    <td style={cellStyle}>{row.teamLeader}</td>
                    <td style={cellStyle}>{row.mode}</td>
                    <td style={cellStyle}>{row.responseTime}</td>
                    <td style={cellStyle}>{row.greetings}</td>
                    <td style={cellStyle}>{row.accuracy}</td>
                    <td style={cellStyle}>{row.rapport}</td>
                    <td style={cellStyle}>{row.solutions}</td>
                    <td style={cellStyle}>{row.closing}</td>
                    <td style={cellStyle}>{row.bonus}</td>
                    <td style={lastCellStyle}>{row.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={paginationContainerStyle}>
            <div style={paginationStyle}>
              <button 
                style={paginationButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                ‹
              </button>
              <button 
                style={activePaginationButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#4b5563';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6b7280';
                }}
              >
                1
              </button>
              <button 
                style={paginationButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalations Tab */}
      {activeTab === "escalations" && (
        <div>
          {escalations.length > 0 ? (
            <div>
              {escalations.map((esc) => (
                <div
                  key={esc.id}
                  style={escalationItemStyle}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                  }}
                >
                  <div style={escalationContentStyle}>
                    <span style={escalationTitleStyle}>{esc.title}</span>
                    <span style={escalationStatusStyle}>{esc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyStateStyle}>
              <p style={emptyTextStyle}>No escalations found.</p>
            </div>
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