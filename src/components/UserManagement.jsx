import React from 'react';
import { Search } from 'lucide-react';

const UserManagement = () => {
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
                <option>Editor</option>
                <option>Viewer</option>
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
                  <th scope="col" className="ps-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="selectAll" />
                    </div>
                  </th>
                  <th scope="col">User</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Last Login</th>
                  <th scope="col" className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td className="ps-3">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id={`select${i}`} />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                          style={{ width: '40px', height: '40px' }}
                        >
                          <span className="fw-bold">{`U${i}`}</span>
                        </div>
                        <div>
                          <div className="fw-bold">{`User ${i}`}</div>
                          <div className="text-muted small">{`user${i}@example.com`}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-info' : 'bg-secondary'}`}>
                        {i % 3 === 0 ? 'Administrator' : i % 3 === 1 ? 'Editor' : 'Viewer'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${i % 2 === 0 ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {i % 2 === 0 ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td>{`${i} ${i === 1 ? 'hour' : 'hours'} ago`}</td>
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
            <div>Showing 1 to 5 of 42 entries</div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled">
                  <a className="page-link" href="#" tabIndex="-1">Previous</a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">1</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">2</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">3</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">Next</a>
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