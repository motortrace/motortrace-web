import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../layouts/DashboardHeader/DashboardHeader';
import { inspectionTemplatesApi } from '../../utils/inspectionTemplatesApi';
import type { InspectionTemplate } from '../../types/InspectionTemplate';
import './InspectionTemplates.scss';

const InspectionTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<InspectionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set());

  // Sample data for development
  const sampleTemplates: InspectionTemplate[] = [
    {
      id: '1',
      name: 'Engine (Mechanical Condition)',
      description: 'Comprehensive engine mechanical inspection covering all major components',
      category: 'Mechanical',
      isActive: true,
      sortOrder: 1,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      templateItems: [
        {
          id: '1-1',
          templateId: '1',
          name: 'Oil in air cleaner',
          description: 'Check for oil contamination in the air cleaner element',
          category: 'Engine Oil',
          sortOrder: 1,
          isRequired: true,
          allowsNotes: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '1-2',
          templateId: '1',
          name: 'Water in oil',
          description: 'Inspect for water contamination in engine oil',
          category: 'Engine Oil',
          sortOrder: 2,
          isRequired: true,
          allowsNotes: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '1-3',
          templateId: '1',
          name: 'Coolant level',
          description: 'Check coolant level and condition',
          category: 'Cooling System',
          sortOrder: 3,
          isRequired: true,
          allowsNotes: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        }
      ]
    },
    {
      id: '2',
      name: 'Cooling System',
      description: 'Complete cooling system inspection including radiator, hoses, and thermostat',
      category: 'Mechanical',
      isActive: true,
      sortOrder: 2,
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-16T10:00:00Z',
      templateItems: [
        {
          id: '2-1',
          templateId: '2',
          name: 'Radiator condition',
          description: 'Visual inspection of radiator for leaks and damage',
          category: 'Radiator',
          sortOrder: 1,
          isRequired: true,
          allowsNotes: true,
          createdAt: '2024-01-16T10:00:00Z',
          updatedAt: '2024-01-16T10:00:00Z'
        },
        {
          id: '2-2',
          templateId: '2',
          name: 'Hose condition',
          description: 'Check all coolant hoses for cracks and leaks',
          category: 'Hoses',
          sortOrder: 2,
          isRequired: true,
          allowsNotes: true,
          createdAt: '2024-01-16T10:00:00Z',
          updatedAt: '2024-01-16T10:00:00Z'
        }
      ]
    },
    {
      id: '3',
      name: 'Electrical System',
      description: 'Battery, alternator, and electrical component inspection',
      category: 'Electrical',
      isActive: true,
      sortOrder: 3,
      createdAt: '2024-01-17T10:00:00Z',
      updatedAt: '2024-01-17T10:00:00Z',
      templateItems: [
        {
          id: '3-1',
          templateId: '3',
          name: 'Battery voltage',
          description: 'Test battery voltage and charging system',
          category: 'Battery',
          sortOrder: 1,
          isRequired: true,
          allowsNotes: true,
          createdAt: '2024-01-17T10:00:00Z',
          updatedAt: '2024-01-17T10:00:00Z'
        }
      ]
    }
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        // For now, use sample data. Replace with actual API call later
        // const data = await inspectionTemplatesApi.getTemplates();
        setTemplates(sampleTemplates);
        setError(null);
      } catch (err) {
        setError('Failed to load inspection templates');
        console.error('Error fetching templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const toggleTemplateExpansion = (templateId: string) => {
    const newExpanded = new Set(expandedTemplates);
    if (newExpanded.has(templateId)) {
      newExpanded.delete(templateId);
    } else {
      newExpanded.add(templateId);
    }
    setExpandedTemplates(newExpanded);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(templates.map(t => t.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="inspection-templates-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading inspection templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inspection-templates-page">
        <div className="error-container">
          <div className="error-icon">
            <i className="bx bx-error-circle"></i>
          </div>
          <h3>Error Loading Templates</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            <i className="bx bx-refresh"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inspection-templates-page">
      
      <div className="templates-container">
        {/* Header Section */}
        <div className="templates-header">
          <div className="header-content">
            <h1></h1>
            <p></p>
          </div>

        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-box">
            <i className="bx bx-search"></i>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filter">
            <label htmlFor="category-select">Category:</label>
            <select
              id="category-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <button style={{ marginLeft: 'auto' }} className="create-template-btn">
            <i className="bx bx-plus"></i>
            Create Template
          </button>
        </div>

        {/* Templates List */}
        <div className="templates-list">
          {filteredTemplates.length === 0 ? (
            <div className="no-templates">
              <div className="no-templates-icon">
                <i className="bx bx-file-template"></i>
              </div>
              <h3>No Templates Found</h3>
              <p>No inspection templates match your current filters.</p>
            </div>
          ) : (
            filteredTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-header" onClick={() => toggleTemplateExpansion(template.id)}>
                  <div className="template-info">
                    <div className="template-title">
                      <h3>{template.name}</h3>
                      {template.category && (
                        <span className="category-badge">{template.category}</span>
                      )}
                    </div>
                    {template.description && (
                      <p className="template-description">{template.description}</p>
                    )}
                    <div className="template-meta">
                      <span className="items-count">
                        <i className="bx bx-list-ul"></i>
                        {template.templateItems.length} items
                      </span>
                      <span className="status-badge" data-status={template.isActive ? 'active' : 'inactive'}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="template-actions">
                    <button 
                      className="expand-btn"
                      aria-label={expandedTemplates.has(template.id) ? 'Collapse' : 'Expand'}
                    >
                      <i className={`bx ${expandedTemplates.has(template.id) ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedTemplates.has(template.id) && (
                  <div className="template-content">
                    <div className="template-items">
                      <h4>Template Items</h4>
                      {template.templateItems.length === 0 ? (
                        <div className="no-items">
                          <i className="bx bx-info-circle"></i>
                          <p>No items defined for this template</p>
                        </div>
                      ) : (
                        <div className="items-list">
                          {template.templateItems
                            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                            .map(item => (
                            <div key={item.id} className="template-item">
                              <div className="item-header">
                                <div className="item-info">
                                  <h5>{item.name}</h5>
                                  {item.description && (
                                    <p className="item-description">{item.description}</p>
                                  )}
                                  {item.category && (
                                    <span className="item-category">{item.category}</span>
                                  )}
                                </div>
                                <div className="item-meta">
                                  {item.isRequired && (
                                    <span className="required-badge">
                                      <i className="bx bx-check-circle"></i>
                                      Required
                                    </span>
                                  )}
                                  {item.allowsNotes && (
                                    <span className="notes-badge">
                                      <i className="bx bx-note"></i>
                                      Notes Allowed
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="template-actions-expanded">
                      <button className="action-btn edit-btn">
                        <i className="bx bx-edit"></i>
                        Edit Template
                      </button>
                      <button className="action-btn add-item-btn">
                        <i className="bx bx-plus"></i>
                        Add Item
                      </button>
                      <button className="action-btn duplicate-btn">
                        <i className="bx bx-copy"></i>
                        Duplicate
                      </button>
                      <button className="action-btn delete-btn">
                        <i className="bx bx-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionTemplates;
