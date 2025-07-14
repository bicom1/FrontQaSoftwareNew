import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getallusersApi } from '../features/userApis';

const UserManagement = () => {
  const [getUser, setGetUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await getallusersApi();
        console.log("Fetched all users:", res.data);
        setGetUser(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUserDetail();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = getUser.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(getUser.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Users Management</h4>
        <button className="btn btn-primary">+ Add User</button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white p-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={18} />
                </span>
                <input type="text" className="form-control border-start-0 bg-light" placeholder="Search users..." />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select">
                <option>All Roles</option>
                <option>Administrator</option>
                <option>Agent</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <button className="btn btn-outline-secondary w-100">Filter</button>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                  </th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td className="ps-3">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id={`select${index}`} />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{ width: '40px', height: '40px' }}
                        >
                          <span className="fw-bold">{user.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="fw-bold">{user.name}</div>
                          <div className="text-muted small">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-info text-capitalize">{user.role}</span>
                    </td>
                    <td>
                      <span className={`badge ${user.isVerified ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {user.isVerified ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="text-end pe-3">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary">Edit</button>
                        <button className="btn btn-outline-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer bg-white p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, getUser.length)} of {getUser.length} entries
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                </li>
                {[...Array(totalPages)].map((_, idx) => (
                  <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(idx + 1)}>{idx + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
