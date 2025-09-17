import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { onlineUsersCountApi, totalUserCountApi, getallusersApi, patchUserApi, deleteUserApi} from '../features/userApis';
import { totalEscalationCountsApi, getEscalationAnalyticsApi, overviewAnalyticsRangeApi } from '../features/escalationsApi';
import { totalEvaluationCountsApi, getEvaluationAnalyticsApi } from '../features/evaluationApi';
import { totalMarketingCountsApi, getMarketingAnalyticsApi } from '../features/marketingApi';
import { LeadRegister } from '../features/userApis'; // Import the API function
import { Button, Modal, Form, Alert, Tab, Tabs, Spinner } from 'react-bootstrap';
import { Crown, Users, Search, Mail, Shield, UserCheck, XCircle, Edit, Trash2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#6633AA'];

const Overview = () => {
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

  // Modal states for Add User
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales agent'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });

  // Users Modal states
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeTab, setActiveTab] = useState('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [usersError, setUsersError] = useState('');

  // Edit User Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: ''
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editAlertMessage, setEditAlertMessage] = useState({ type: '', message: '' });

  // Delete confirmation states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
          onlineUsersCountApi(),
        ]);

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

  // Fetch all users for the modal
  const fetchAllUsers = async () => {
    try {
      setLoadingUsers(true);
      setUsersError('');
      const res = await getallusersApi();
      if (Array.isArray(res?.data?.data)) {
        setAllUsers(res.data.data);
      } else {
        setAllUsers([]);
        setUsersError('No users data found');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsersError('Failed to fetch users. Please try again.');
      setAllUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Handle users modal
  const handleShowUsersModal = () => {
    setShowUsersModal(true);
    fetchAllUsers();
  };

  const handleCloseUsersModal = () => {
    setShowUsersModal(false);
    setSearchTerm('');
    setUsersError('');
    setActiveTab('admin');
  };

  // Filter users based on role and search term
  const getFilteredUsers = (role) => {
    const roleUsers = allUsers.filter(user => {
      if (role === 'admin') {
        return user.role === 'admin' || user.role === 'superadmin';
      }
      return user.role === 'sales agent' || user.role === 'agent';
    });

    if (!searchTerm) return roleUsers;

    return roleUsers.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const adminUsers = getFilteredUsers('admin');
  const salesAgentUsers = getFilteredUsers('sales agent');
  const currentUsers = activeTab === 'admin' ? adminUsers : salesAgentUsers;

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || ''
    });
    setEditAlertMessage({ type: '', message: '' });
    setShowEditModal(true);
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit edit user form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditSubmitting(true);
    setEditAlertMessage({ type: '', message: '' });

    try {
      // Validate form data
      if (!editFormData.name.trim() || !editFormData.email.trim()) {
        setEditAlertMessage({ type: 'danger', message: 'Name and email are required.' });
        setIsEditSubmitting(false);
        return;
      }

      console.log('Editing user:', editingUser._id, 'with data:', editFormData);

      // Call the patch API - you may need to modify your API to accept data
      const response = await patchUserApi(editingUser._id, editFormData);
      
      console.log('Edit response:', response);
      
      if (response.status === 200 || response.status === 201) {
        setEditAlertMessage({ type: 'success', message: 'User updated successfully!' });
        
        // Refresh the users list
        await fetchAllUsers();
        
        // Refresh total users count
        const updatedUsers = await totalUserCountApi();
        setTotalUsers(updatedUsers?.count ?? 0);
        
        // Close modal after a short delay
        setTimeout(() => {
          handleCloseEditModal();
        }, 1500);
      } else {
        setEditAlertMessage({ type: 'danger', message: 'Unexpected response from server.' });
      }
    } catch (error) {
      console.error('Edit user error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update user. Please try again.';
      setEditAlertMessage({ type: 'danger', message: errorMessage });
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // Confirm delete user
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      console.log('Deleting user:', deletingUser._id);
      
      const response = await deleteUserApi(deletingUser._id);
      
      console.log('Delete response:', response);
      
      if (response.status === 200 || response.status === 201) {
        // Refresh the users list
        await fetchAllUsers();
        
        // Refresh total users count
        const updatedUsers = await totalUserCountApi();
        setTotalUsers(updatedUsers?.count ?? 0);
        
        // Close delete modal
        setShowDeleteModal(false);
        setDeletingUser(null);
        
        // Show success message
        alert('User deleted successfully!');
      } else {
        alert('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user. Please try again.';
      alert('Error: ' + errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({ name: '', email: '' });
    setEditAlertMessage({ type: '', message: '' });
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  // User card component
  const UserCard = ({ user }) => (
    <div className="col-12 mb-3">
      <div className="card border-0 shadow-sm rounded-3 h-100">
        <div className="card-body py-3">
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <div className="admin-avatar rounded-circle bg-primary-gradient text-white d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {user.role === 'superadmin' && (
                <span className="position-absolute top-0 start-100 translate-middle">
                  <Crown size={12} className="text-warning" />
                </span>
              )}
            </div>
            
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1">
                {user.name || 'Unknown User'}
              </h6>
              
              <div className="d-flex align-items-center gap-1 text-muted">
                <Mail size={14} />
                <small>{user.email || 'No email provided'}</small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button 
                className="btn btn-outline-primary btn-sm p-2"
                onClick={() => handleEditUser(user)}
                title="Edit User"
              >
                <Edit size={14} />
              </button>
              <button 
                className="btn btn-outline-danger btn-sm p-2"
                onClick={() => handleDeleteUser(user)}
                title="Delete User"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Handle modal open/close for Add User
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'sales agent'
    });
    setAlertMessage({ type: '', message: '' });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlertMessage({ type: '', message: '' });

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
        setAlertMessage({ type: 'danger', message: 'All fields are required.' });
        setIsSubmitting(false);
        return;
      }

      // Call the API
      const response = await LeadRegister(formData);
      
      if (response.status === 200 || response.status === 201) {
        setAlertMessage({ type: 'success', message: 'User registered successfully!' });
        
        // Refresh the total users count
        const updatedUsers = await totalUserCountApi();
        setTotalUsers(updatedUsers?.count ?? 0);
        
        // Close modal after a short delay
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register user. Please try again.';
      setAlertMessage({ type: 'danger', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Button variant='info' onClick={handleShowUsersModal}>
                <Users size={16} className="me-1" />
                {totalUsers ?? 0} Total Users
              </Button>
            </div>
            <div>
              <Button variant='dark' onClick={handleShowModal}>
                Add User
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Users List Modal */}
      <Modal show={showUsersModal} onHide={handleCloseUsersModal} size="xl" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center gap-2">
            <Users size={24} className="text-primary" />
            All Users List
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-0">
          {usersError && (
            <Alert variant="danger" className="mx-3 mt-3 mb-0">
              {usersError}
            </Alert>
          )}

          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mx-3 mt-3 border-bottom-0"
            fill
          >
            <Tab 
              eventKey="admin" 
              title={
                <span className="d-flex align-items-center gap-2">
                  <Shield size={16} />
                  Admin Team ({adminUsers.length})
                </span>
              }
            >
              <div className="p-3">
                {/* Search Bar */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="search-box position-relative">
                      <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <Form.Control
                        type="text"
                        className="ps-5"
                        placeholder="Search admin users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <Shield size={16} className="text-info" />
                      <span className="fw-semibold">
                        {adminUsers.length} Admin{adminUsers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Users List */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {loadingUsers ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <Spinner animation="border" className="me-2" />
                      <span>Loading admin users...</span>
                    </div>
                  ) : adminUsers.length > 0 ? (
                    <div className="row g-2">
                      {adminUsers.map((user) => (
                        <UserCard key={user._id || user.email} user={user} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <XCircle size={48} className="mb-3 opacity-50" />
                      <h5>No Admin Users Found</h5>
                      <p className="mb-0">
                        {searchTerm 
                          ? 'Try adjusting your search terms' 
                          : 'No admin users are currently registered'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Tab>

            <Tab 
              eventKey="sales-agent" 
              title={
                <span className="d-flex align-items-center gap-2">
                  <UserCheck size={16} />
                  Sales Agents ({salesAgentUsers.length})
                </span>
              }
            >
              <div className="p-3">
                {/* Search Bar */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="search-box position-relative">
                      <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <Form.Control
                        type="text"
                        className="ps-5"
                        placeholder="Search sales agents by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <UserCheck size={16} className="text-success" />
                      <span className="fw-semibold">
                        {salesAgentUsers.length} Agent{salesAgentUsers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Users List */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {loadingUsers ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <Spinner animation="border" className="me-2" />
                      <span>Loading sales agents...</span>
                    </div>
                  ) : salesAgentUsers.length > 0 ? (
                    <div className="row g-2">
                      {salesAgentUsers.map((user) => (
                        <UserCard key={user._id || user.email} user={user} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <XCircle size={48} className="mb-3 opacity-50" />
                      <h5>No Sales Agents Found</h5>
                      <p className="mb-0">
                        {searchTerm 
                          ? 'Try adjusting your search terms' 
                          : 'No sales agents are currently registered'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        
        <Modal.Footer className="bg-light">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="text-muted small">
              Total Users: {allUsers.length} | 
              Showing: {currentUsers.length} {activeTab === 'admin' ? 'admins' : 'sales agents'}
            </div>
            <div>
              <Button variant="secondary" onClick={handleCloseUsersModal}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editAlertMessage.message && (
            <Alert variant={editAlertMessage.type} className="mb-3">
              {editAlertMessage.message}
            </Alert>
          )}
          
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditInputChange}
                placeholder="Enter full name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditInputChange}
                placeholder="Enter email address"
                required
              />
            </Form.Group>

            <div className="text-muted small mb-3">
              <strong>Current Role:</strong> {editingUser?.role || 'Unknown'}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal} disabled={isEditSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditSubmit} 
            disabled={isEditSubmitting}
          >
            {isEditSubmitting ? 'Updating...' : 'Update User'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <Trash2 size={48} className="text-danger mb-3" />
            <h5>Are you sure you want to delete this user?</h5>
            <p className="text-muted mb-3">This action cannot be undone.</p>
            
            {deletingUser && (
              <div className="border rounded p-3 bg-light">
                <div className="d-flex align-items-center gap-2 justify-content-center">
                  <div className="admin-avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{width: '32px', height: '32px'}}>
                    {deletingUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="fw-bold">{deletingUser.name}</div>
                    <small className="text-muted">{deletingUser.email}</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add User Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertMessage.message && (
            <Alert variant={alertMessage.type} className="mb-3">
              {alertMessage.message}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role *</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="sales agent">Sales Agent</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add User'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rest of your existing Overview component code... */}
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
        <div className="col-12 col-lg-6 card border-0 shadow-sm mb-4">
          <div className="card-header">
            <h5>Escalation Severity Distribution</h5>
          </div>
          <div className="card-body">
            {escalationSeverityData.length > 0 ? (
              <PieChart width={400} height={300}>
                <Pie
                  data={escalationSeverityData}
                  cx={200}
                  cy={150}
                  label
                  outerRadius={100}
                  fill="#FF8042"
                  dataKey="value"
                >
                  {escalationSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <p>Loading Escalation Chart...</p>
            )}
          </div>
        </div>
        
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
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
      </div> 
    </>
  );
};

export default Overview;