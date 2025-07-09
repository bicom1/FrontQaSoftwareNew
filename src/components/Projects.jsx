import React from 'react';
import { Settings } from 'lucide-react';

const Projects = () => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Projects</h4>
        <button className="btn btn-primary">+ New Project</button>
      </div>

      <div className="row g-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className={`badge ${i % 3 === 0 ? 'bg-success' : i % 3 === 1 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                    {i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'In Progress' : 'Delayed'}
                  </span>
                  <div className="dropdown">
                    <button className="btn btn-sm btn-light" type="button">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
                
                <h5 className="card-title">{`Project ${i}: ${['Website Redesign', 'Mobile App', 'Cloud Migration', 'E-commerce Platform', 'CRM Implementation', 'Marketing Dashboard'][i-1]}`}</h5>
                <p className="text-muted small">
                  {`This project involves ${['redesigning the company website with modern UI/UX principles', 'developing a cross-platform mobile application', 'migrating on-premise systems to cloud infrastructure', 'building a comprehensive e-commerce solution', 'implementing a customer relationship management system', 'creating a marketing analytics dashboard'][i-1]}.`}
                </p>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1 small">
                    <span>Progress</span>
                    <span>{`${[75, 45, 90, 30, 60, 15][i-1]}%`}</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className={`progress-bar ${i % 3 === 0 ? 'bg-success' : i % 3 === 1 ? 'bg-warning' : 'bg-danger'}`} 
                      role="progressbar" 
                      style={{ width: `${[75, 45, 90, 30, 60, 15][i-1]}%` }}
                      aria-valuenow={[75, 45, 90, 30, 60, 15][i-1]} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="text-muted small me-3">
                      <strong>Due:</strong> {`${new Date().getDate() + i}/${new Date().getMonth() + 1}/2025`}
                    </div>
                    <div className="text-muted small">
                      <strong>Budget:</strong> ${`${(i * 15000).toLocaleString()}`}
                    </div>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    {[...Array(3)].map((_, idx) => (
                      <div 
                        key={idx} 
                        className="rounded-circle border border-white bg-primary text-white d-flex align-items-center justify-content-center" 
                        style={{ width: '30px', height: '30px', marginLeft: idx > 0 ? '-10px' : '0' }}
                      >
                        <span className="small fw-bold">{`T${idx+1}`}</span>
                      </div>
                    ))}
                    <div 
                      className="rounded-circle border border-white bg-light text-dark d-flex align-items-center justify-content-center" 
                      style={{ width: '30px', height: '30px', marginLeft: '-10px' }}
                    >
                      <span className="small">+2</span>
                    </div>
                  </div>
                  
                  <div className="ms-auto">
                    <button className="btn btn-sm btn-outline-primary">Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Projects;