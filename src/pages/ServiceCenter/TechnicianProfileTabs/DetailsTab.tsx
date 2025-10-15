import React from 'react';

interface TechnicianDetails {
  id: string;
  userProfileId: string;
  employeeId: string;
  specialization: string;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
  userProfile: {
    id: string;
    name: string;
    phone: string;
    profileImage?: string;
    role: string;
  };
  inspectionsCount: number;
  qcChecksCount: number;
  laborItemsCount: number;
  partInstallationsCount: number;
}

interface DetailsTabProps {
  technician: TechnicianDetails;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ technician }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="details-tab">
      <div className="details-grid">
        {/* Basic Information */}
        <div className="card contact-info-card">
          <div className="card-header">
            <h3>Basic Information</h3>
          </div>
          <div className="card-body">
            <div className="info-grid-horizontal">
              <div className="info-item">
                <i className="bx bx-user"></i>
                <div>
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{technician.userProfile.name}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="bx bx-id-card"></i>
                <div>
                  <span className="info-label">Employee ID</span>
                  <span className="info-value">{technician.employeeId}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="bx bx-phone"></i>
                <div>
                  <span className="info-label">Phone</span>
                  <span className="info-value">{technician.userProfile.phone}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="bx bx-briefcase"></i>
                <div>
                  <span className="info-label">Role</span>
                  <span className="info-value">{technician.userProfile.role}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="bx bx-wrench"></i>
                <div>
                  <span className="info-label">Specialization</span>
                  <span className="info-value">{technician.specialization || 'Not specified'}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="bx bx-calendar"></i>
                <div>
                  <span className="info-label">Joined Date</span>
                  <span className="info-value">{formatDate(technician.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="card contact-info-card">
          <div className="card-header">
            <h3>Certifications</h3>
          </div>
          <div className="card-body">
            {technician.certifications && technician.certifications.length > 0 ? (
              <div className="certifications-list">
                {technician.certifications.map((cert, index) => (
                  <span key={index} className="certification-badge">
                    {cert}
                  </span>
                ))}
              </div>
            ) : (
              <p className="no-data">No certifications listed</p>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="card contact-info-card">
          <div className="card-header">
            <h3>Performance Summary</h3>
          </div>
          <div className="card-body">
            <div className="performance-grid">
              <div className="performance-item">
                <div className="performance-value">{technician.inspectionsCount}</div>
                <div className="performance-label">Inspections</div>
              </div>
              <div className="performance-item">
                <div className="performance-value">{technician.laborItemsCount}</div>
                <div className="performance-label">Labor Items</div>
              </div>
              <div className="performance-item">
                <div className="performance-value">{technician.partInstallationsCount}</div>
                <div className="performance-label">Parts Installed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;