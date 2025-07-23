import React, { useState } from 'react';
import { Search, MapPin, MoreHorizontal, Check, X, Plus } from 'lucide-react';
import './SupplierConnectionPage.scss';

const SupplierConnectionPage = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for connected suppliers
  const connectedSuppliers = [
    { id: 1, name: "O'Reilly", logo: 'https://marvel-b1-cdn.bc0a.com/f00000000270502/s19538.pcdn.co/wp-content/uploads/2015/04/OReilly-Logo-e1540487806549.png', approved: true },
    { id: 2, name: "AutoZone", logo: 'https://surprisetcmp.com/wp-content/uploads/sites/13/2019/09/AutoZone-Logo.png', approved: true },
    { id: 3, name: "Advance Auto Parts", logo: 'https://marvel-b1-cdn.bc0a.com/f00000000270508/s19526.pcdn.co/wp-content/uploads/2019/07/advance-auto-parts-729.jpg', approved: true },
    { id: 4, name: "NAPA", logo: 'https://marvel-b1-cdn.bc0a.com/f00000000270502/s19538.pcdn.co/wp-content/uploads/2022/02/NAPA-2022-logo-1024x512.jpg', approved: true },
    { id: 5, name: "WORLDPAC", logo: 'https://billmurrayassociates.com/wp-content/uploads/worldpac-2-e1739136815992-1024x539.png', approved: true },
    { id: 6, name: "Factory Motor Parts", logo: 'https://img.vehicleservicepros.com/files/base/cygnus/vspc/image/2022/10/16x9/Factory_Motor_Parts.6352e542907f1.png?auto=format%2Ccompress&w=640&width=640', approved: true }
  ];

  // Mock data for available suppliers matching the image
  const availableSuppliers = [
    { 
      id: 1, 
      name: "Alliant Power (Epicor) - Massachusetts", 
      address: "604 Silver Street, AGAWAM, MA 01001-2987",
      logo: 'https://www.aftermarketnews.com/wp-content/uploads/2015/05/Bosch-Logo.png', 
      type: "parts", 
      buttonType: "add"
    },
    { 
      id: 2, 
      name: "Alliant Power - Massachusetts", 
      address: "604 Silver Street, AGAWAM, MA 01001-2987",
      logo: 'https://www.aftermarketnews.com/wp-content/uploads/2015/05/Bosch-Logo.png', 
      type: "parts",
      buttonType: "add"
    },
    { 
      id: 3, 
      name: "Fisher Auto Parts / KOI Auto Parts", 
      address: "10 locations",
      logo: 'https://www.aftermarketnews.com/wp-content/uploads/2015/05/Bosch-Logo.png', 
      type: "parts",
      buttonType: "choose"
    },
    { 
      id: 4, 
      name: "Prostock Automotive Warehouse", 
      address: "652 Watertown Avenue, Waterbury, CT 06708",
      logo: 'https://www.aftermarketnews.com/wp-content/uploads/2015/05/Bosch-Logo.png', 
      type: "parts",
      buttonType: "add"
    },
    { 
      id: 5, 
      name: "Canaan Auto Supply - Canaan", 
      address: "462 Ashley Falls Road, CANAAN, CT 06018-2016",
      logo: 'https://www.aftermarketnews.com/wp-content/uploads/2015/05/Bosch-Logo.png', 
      type: "parts",
      buttonType: "add"
    },
    { 
      id: 6, 
      name: "ABW Undercar Parts, Inc. - Hopedale", 
      address: "5 Airport Road, HOPEDALE, MA 01747-1547",
      logo: 'https://www.aftermarketnews.com/wp-content/uploads/2015/05/Bosch-Logo.png', 
      type: "parts",
      buttonType: "add"
    },
    { 
      id: 7, 
      name: "Action Auto Parts", 
      address: "2 locations",
      logo: 'https://www.aftermarketnews.com/wp-content/uploads/2015/05/Bosch-Logo.png', 
      type: "parts",
      buttonType: "choose"
    },
    { 
      id: 8, 
      name: "National Auto Parts Warehouse", 
      address: "111 Commerce Drive, WARWICK, RI 02886-2429",
      logo: 'https://www.aftermarketnews.com/wp-content/uploads/2015/05/Bosch-Logo.png', 
      type: "parts",
      buttonType: "add"
    },
    { 
      id: 9, 
      name: "Poughkeepsie Imported Car Parts", 
      address: "250 South Avenue, POUGHKEEPSIE, NY 12601-4838",
      logo: 'https://www.aftermarketnews.com/wp-content/uploads/2015/05/Bosch-Logo.png', 
      type: "parts",
      buttonType: "add"
    },
    { 
      id: 10, 
      name: "1-800-Radiator & AC - STAGING", 
      address: "108 South Water St, NEWBURGH, NY 12550",
      logo: 'https://www.aftermarketnews.com/wp-content/uploads/2015/05/Bosch-Logo.png', 
      type: "parts",
      buttonType: "add"
    }
  ];

  const filterOptions = [
    { key: 'ALL', label: 'ALL' },
    { key: 'PARTS', label: 'PARTS' },
    { key: 'TIRES', label: 'TIRES' },
    { key: 'DEALER', label: 'DEALER' }
  ];

  const filteredSuppliers = availableSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || supplier.type.toUpperCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSupplierAction = (supplierId: number, action: string) => {
    console.log(`${action} supplier with ID: ${supplierId}`);
  };

  return (
    <div className="supplier-page">
      {/* Header */}
      <div className="supplier-header">
        <div className="supplier-header-content">
          <div></div>
          <div>
            <div className="supplier-search-container">
              <Search className="supplier-search-icon" />
              <input
                type="text"
                placeholder="Search by supplier name or zip code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="supplier-search-input"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="supplier-main-layout">
        {/* Sidebar */}
        <div className="supplier-sidebar">
          <div className="supplier-sidebar-content">
            <h2 className="supplier-sidebar-title">My suppliers</h2>
            <div className="supplier-suppliers-list">
              {connectedSuppliers.map((supplier) => (
                <div key={supplier.id} className="supplier-connected-supplier">
                  <div className="supplier-supplier-logo">
                    <img
                      src={supplier.logo}
                      alt={supplier.name + ' logo'}
                      className="supplier-supplier-logo-img"
                      onError={e => (e.currentTarget.src = 'https://via.placeholder.com/40x40/0066cc/ffffff?text=' + supplier.name.charAt(0))}
                    />
                  </div>
                  <span className="supplier-supplier-name">{supplier.name}</span>
                  <div className="supplier-supplier-actions">
                    {supplier.approved && (
                      <div className="supplier-approved-badge">
                        <Check className="supplier-approved-icon" />
                        <span className="supplier-approved-text">Approved</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="supplier-main-content">
          {/* Map Section */}
          <div className="supplier-map-section">
            <iframe
              title="Hartford Shop Location"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '100%', minWidth: '100%' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=20+Church+St,+Mezzanine+Level,+Hartford,+CT+06103&output=embed"
            ></iframe>
            <button className="supplier-recenter-button">
              <MapPin className="supplier-recenter-icon" />
              Recenter to shop
            </button>
          </div>
          {/* Filters */}
          <div className="supplier-filters-section">
            <div className="supplier-filters-content">
              <span className="supplier-filters-label">Only show:</span>
              {filterOptions.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`supplier-filter-button${activeFilter === filter.key ? ' supplier-filter-button-active' : ''}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          {/* Supplier Cards */}
          <div className="supplier-suppliers-section">
            <h3 className="supplier-suppliers-title">Part suppliers</h3>
            <div className="supplier-suppliers-grid">
              {filteredSuppliers.map((supplier) => (
                <div key={supplier.id} className="supplier-supplier-card">
                  <div className="supplier-card-logo-wrapper">
                    <img
                      src={supplier.logo}
                      alt={supplier.name + ' logo'}
                      className="supplier-card-logo-img"
                      onError={e => (e.currentTarget.src = 'https://via.placeholder.com/280x120/0066cc/ffffff?text=' + supplier.name.substring(0, 3))}
                    />
                  </div>
                  <div className="supplier-card-details">
                    <h4 className="supplier-card-title">{supplier.name}</h4>
                    <p className="supplier-card-address">{supplier.address}</p>
                  </div>
                  <button
                    onClick={() => handleSupplierAction(supplier.id, supplier.buttonType)}
                    className={`supplier-action-button${supplier.buttonType === 'choose' ? ' choose' : ''}`}
                  >
                    {supplier.buttonType === 'choose' ? (
                      <>
                        <MapPin className="supplier-action-icon" />
                        Choose location
                      </>
                    ) : (
                      <>
                        <Plus className="supplier-action-icon" />
                        Add
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
            {filteredSuppliers.length === 0 && (
              <div className="supplier-no-suppliers">
                <div className="supplier-no-suppliers-icon-wrapper">
                  <Search className="supplier-no-suppliers-icon" />
                </div>
                <h3 className="supplier-no-suppliers-title">
                  No suppliers found
                </h3>
                <p className="supplier-no-suppliers-desc">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierConnectionPage;