import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Upload, MessageSquare, Phone, FileText, X, AlertTriangle, Clock, Calendar, Send, Star } from 'lucide-react';
import { getLowRatingCallApi, getLowRatingChatsApi } from '../../features/agents';
import { getToken } from '../../features/config';




const AgentFeedbackBox = () => {
  const [activeTab, setActiveTab] = useState('flagged-chats');
  const [expandedChats, setExpandedChats] = useState({});
  const [expandedCalls, setExpandedCalls] = useState({});
  const [comments, setComments] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [generalComment, setGeneralComment] = useState('');
  const [generalFiles, setGeneralFiles] = useState([]);
   const [flaggedCalls, setFlaggedCalls] = useState([]);
   const [flaggedChats, setFlaggedChats] = useState([]);
   const [loading, setLoading] = useState(true);
   const token = getToken();
   const decoded = JSON.parse(atob(token.split(".")[1])); 
   const currentUserName = decoded.name;
   const currentUserEmail = decoded.email;
    const currentUserId = decoded.id; // if you store user id




const normalizeData = (rawData, type) => {
  return rawData.map((item) => ({
    id: item._id,
    title: `${type === 'chat' ? 'Chat' : 'Call'} with ${item.agentName}`,
    time: new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date(item.createdAt).toLocaleDateString(),
    duration: `${Math.floor(Math.random() * 15) + 5}:${String(
      Math.floor(Math.random() * 59)
    ).padStart(2, "0")}`,
    severity: item.rating <= 40 ? "high" : item.rating <= 70 ? "medium" : "low",
    agent: item.agentName,
    raw: item,
  }));
};

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const currentUserName = (decoded.name || "").toLowerCase(); // 👈 "haris"

      const [callsRes, chatsRes] = await Promise.all([
        getLowRatingCallApi(),
        getLowRatingChatsApi()
      ]);

      // Filter calls by current user's name
      const callsRaw = (Array.isArray(callsRes?.data) ? callsRes.data : [])
        .filter(item => (item.agentName || "").toLowerCase() === currentUserName);

      // Filter chats by current user's name
      const chatsRaw = (Array.isArray(chatsRes?.data) ? chatsRes.data : [])
        .filter(item => (item.agentName || "").toLowerCase() === currentUserName);

      setFlaggedCalls(normalizeData(callsRaw, "call"));
      setFlaggedChats(normalizeData(chatsRaw, "chat"));
    } catch (error) {
      console.error("Error fetching flagged data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);




  const toggleChatExpanded = (chatId) => {
    setExpandedChats(prev => ({
      ...prev,
      [chatId]: !prev[chatId]
    }));
  };

    const toggleCallExpanded = (callId) => {
    setExpandedCalls((prev) => ({
      ...prev,
      [callId]: !prev[callId],
    }));
  };


  const handleCommentChange = (type, id, value) => {
    setComments(prev => ({
      ...prev,
      [`${type}-${id}`]: value
    }));
  };


  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'high': 
        return { 
          bg: 'linear-gradient(to right, #ef4444, #dc2626)', 
          text: '#ffffff', 
          icon: AlertTriangle,
          light: { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' }
        };
      case 'medium': 
        return { 
          bg: 'linear-gradient(to right, #f59e0b, #ea580c)', 
          text: '#ffffff', 
          icon: Clock,
          light: { bg: '#fffbeb', border: '#fde68a', text: '#d97706' }
        };
      case 'low': 
        return { 
          bg: 'linear-gradient(to right, #10b981, #059669)', 
          text: '#ffffff', 
          icon: Star,
          light: { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' }
        };
      default: 
        return { 
          bg: 'linear-gradient(to right, #6b7280, #4b5563)', 
          text: '#ffffff', 
          icon: Clock,
          light: { bg: '#f9fafb', border: '#d1d5db', text: '#374151' }
        };
    }
  };

 

  const renderFlaggedItem = (item, type, expandedState, toggleExpanded) => {
    const isExpanded = expandedState[item.id];
    const key = `${type}-${item.id}`;
    const severityConfig = getSeverityConfig(item.severity);
    const SeverityIcon = severityConfig.icon;
    
    return (
      <div key={item.id} style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginBottom: '24px',
        transition: 'box-shadow 0.2s'
      }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onClick={() => toggleExpanded(item.id)}
          onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #f9fafb, #eff6ff)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: severityConfig.bg,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              {type === 'chat' ? (
                <MessageSquare style={{ width: '24px', height: '24px', color: '#ffffff' }} />
              ) : (
                <Phone style={{ width: '24px', height: '24px', color: '#ffffff' }} />
              )}
            </div>
            <div>
              <h4 style={{ 
                fontWeight: '600', 
                color: '#111827', 
                fontSize: '18px', 
                margin: '0 0 8px 0' 
              }}>
                {item.title}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                  <Calendar style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                  {item.date} at {item.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                  <Clock style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                  {item.duration}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Agent: <span style={{ fontWeight: '500', color: '#374151' }}>{item.agent}</span>
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: severityConfig.light.bg,
                  border: `1px solid ${severityConfig.light.border}`,
                  color: severityConfig.light.text,
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}>
                  <SeverityIcon style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                  {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)} Priority
                </span>
              </div>
            </div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            <ChevronDown style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </div>
        </div>
        
        {isExpanded && (
          <div style={{
            borderTop: '1px solid #f3f4f6',
            background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)'
          }}>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px'
                }}>
                  <MessageSquare style={{ width: '16px', height: '16px', marginRight: '8px', color: '#2563eb' }} />
                  Feedback Comments
                </label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={comments[key] || ''}
                    onChange={(e) => handleCommentChange(type, item.id, e.target.value)}
                    placeholder="Share your detailed feedback about this interaction..."
                    style={{
                      width: '100%',
                      padding: '16px',
                      paddingRight: '48px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      resize: 'none',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit'
                    }}
                    rows="4"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    fontSize: '12px',
                    color: '#9ca3af',
                    backgroundColor: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {(comments[key] || '').length}/500
                  </div>
                </div>
              </div>
              
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                paddingTop: '16px', 
                borderTop: '1px solid #e5e7eb' 
              }}>
                <button style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: '600',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
                >
                  <Send style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f1f5f9, #eff6ff, #e0e7ff)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(to right, #2563eb, #4f46e5)',
            borderRadius: '16px',
            marginBottom: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <MessageSquare style={{ width: '32px', height: '32px', color: '#ffffff' }} />
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #111827, #1e40af, #4338ca)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
            lineHeight: '1.1'
          }}>
            Agent Feedback Center
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            maxWidth: '512px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Review flagged interactions and provide comprehensive feedback to enhance agent performance and customer satisfaction
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          marginBottom: '32px',
          backgroundColor: '#ffffff',
          padding: '8px',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('flagged-chats')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 24px',
              borderRadius: '12px',
              transition: 'all 0.3s',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              flex: '1',
              minWidth: '160px',
              ...(activeTab === 'flagged-chats' ? {
                background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                color: '#ffffff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transform: 'scale(1.05)'
              } : {
                color: '#6b7280',
                backgroundColor: 'transparent'
              })
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'flagged-chats') {
                e.target.style.color = '#111827';
                e.target.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'flagged-chats') {
                e.target.style.color = '#6b7280';
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <MessageSquare style={{ width: '20px', height: '20px', marginRight: '12px' }} />
            Flagged Chats
            <span style={{
              marginLeft: '12px',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              ...(activeTab === 'flagged-chats' ? {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff'
              } : {
                backgroundColor: '#dbeafe',
                color: '#1e40af'
              })
            }}>
              {flaggedChats.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('flagged-calls')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 24px',
              borderRadius: '12px',
              transition: 'all 0.3s',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              flex: '1',
              minWidth: '160px',
              ...(activeTab === 'flagged-calls' ? {
                background: 'linear-gradient(to right, #059669, #047857)',
                color: '#ffffff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transform: 'scale(1.05)'
              } : {
                color: '#6b7280',
                backgroundColor: 'transparent'
              })
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'flagged-calls') {
                e.target.style.color = '#111827';
                e.target.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'flagged-calls') {
                e.target.style.color = '#6b7280';
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Phone style={{ width: '20px', height: '20px', marginRight: '12px' }} />
            Flagged Calls
            <span style={{
              marginLeft: '12px',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              ...(activeTab === 'flagged-calls' ? {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff'
              } : {
                backgroundColor: '#dcfce7',
                color: '#166534'
              })
            }}>
              {flaggedCalls.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('general')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 24px',
              borderRadius: '12px',
              transition: 'all 0.3s',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              flex: '1',
              minWidth: '160px',
              ...(activeTab === 'general' ? {
                background: 'linear-gradient(to right, #7c3aed, #6d28d9)',
                color: '#ffffff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transform: 'scale(1.05)'
              } : {
                color: '#6b7280',
                backgroundColor: 'transparent'
              })
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'general') {
                e.target.style.color = '#111827';
                e.target.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'general') {
                e.target.style.color = '#6b7280';
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <FileText style={{ width: '20px', height: '20px', marginRight: '12px' }} />
            General Feedback
          </button>
        </div>

        {/* Content Area */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          minHeight: '384px',
          overflow: 'hidden'
        }}>
          {activeTab === 'flagged-chats' && (
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px'
                }}>
                  <MessageSquare style={{ width: '24px', height: '24px', color: '#2563eb' }} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Flagged Chat Conversations</h2>
              </div>
              {flaggedChats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <MessageSquare style={{ width: '40px', height: '40px', color: '#9ca3af' }} />
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '18px', margin: '0 0 8px 0' }}>No flagged chats to review</p>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>All chat conversations are performing well!</p>
                </div>
              ) : (
                <div>
                  {flaggedChats.map(chat => renderFlaggedItem(chat, 'chat', expandedChats, toggleChatExpanded))}
                </div>
              )}
            </div>
          )}

         {activeTab === 'flagged-calls' && (
  loading ? (
    
    <p style={{ textAlign: "center", color: "#6b7280" }}>Loading flagged calls...</p>
  ) : (
    flaggedCalls.length > 0 ? (
      flaggedCalls.map((call) =>
        renderFlaggedItem(call, "call", expandedCalls, toggleCallExpanded)
      )
    ) : (
      
      <p style={{ textAlign: "center", color: "#6b7280" }}>No flagged calls found</p>
    )
  )
)}

          {activeTab === 'general' && (
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f3e8ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px'
                }}>
                  <FileText style={{ width: '24px', height: '24px', color: '#7c3aed' }} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>General Feedback</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '16px'
                  }}>
                    <MessageSquare style={{ width: '16px', height: '16px', marginRight: '8px', color: '#7c3aed' }} />
                    Share Your Insights
                  </label>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      value={generalComment}
                      onChange={(e) => setGeneralComment(e.target.value)}
                      placeholder="Share your comprehensive feedback about agent performance, suggest improvements, highlight positive interactions, or provide any other valuable observations..."
                      style={{
                        width: '100%',
                        padding: '24px',
                        paddingRight: '64px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        resize: 'none',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        outline: 'none',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit'
                      }}
                      rows="8"
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7c3aed';
                        e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      fontSize: '12px',
                      color: '#9ca3af',
                      backgroundColor: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {generalComment.length}/1000
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  paddingTop: '24px', 
                  borderTop: '1px solid #e5e7eb' 
                }}>
                  <button style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '16px 32px',
                    background: 'linear-gradient(to right, #7c3aed, #6d28d9)',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #6d28d9, #5b21b6)';
                    e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #7c3aed, #6d28d9)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  >
                    <Send style={{ width: '20px', height: '20px', marginRight: '12px' }} />
                    Submit General Feedback
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Summary Stats */}
        <div style={{ 
          marginTop: '40px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          <div style={{
            background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)',
            borderRadius: '16px',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#bfdbfe', fontWeight: '500', marginBottom: '8px', margin: '0 0 8px 0' }}>Flagged Chats</p>
                <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{flaggedChats.length}</p>
                <p style={{ color: '#dbeafe', fontSize: '14px', margin: 0 }}>Conversations pending review</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageSquare style={{ width: '28px', height: '28px', color: '#ffffff' }} />
              </div>
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(to bottom right, #10b981, #059669)',
            borderRadius: '16px',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#a7f3d0', fontWeight: '500', marginBottom: '8px', margin: '0 0 8px 0' }}>Flagged Calls</p>
                <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{flaggedCalls.length}</p>
                <p style={{ color: '#d1fae5', fontSize: '14px', margin: 0 }}>Recordings under review</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Phone style={{ width: '28px', height: '28px', color: '#ffffff' }} />
              </div>
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(to bottom right, #8b5cf6, #7c3aed)',
            borderRadius: '16px',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#c4b5fd', fontWeight: '500', marginBottom: '8px', margin: '0 0 8px 0' }}>Active Reviews</p>
                <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                  {Object.keys(expandedChats).filter(key => expandedChats[key]).length + 
                   Object.keys(expandedCalls).filter(key => expandedCalls[key]).length}
                </p>
                <p style={{ color: '#ddd6fe', fontSize: '14px', margin: 0 }}>Currently being reviewed</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText style={{ width: '28px', height: '28px', color: '#ffffff' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentFeedbackBox;