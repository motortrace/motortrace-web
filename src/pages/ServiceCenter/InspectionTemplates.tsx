import React, { useState, useEffect } from 'react';
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


  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await inspectionTemplatesApi.getTemplates();
        setTemplates(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load inspection templates';
        setError(errorMessage);
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
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Inspection Templates</h1>
          <p className="page-subtitle">Create and manage inspection templates</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="category-filter">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button className="action-btn primary">
            <i className="bx bx-plus"></i>
            Create Template
          </button>
        </div>
      </div>

      <div className="templates-container">
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
                  {template.imageUrl && (
                    <div className="template-thumbnail">
                      <img src={template.imageUrl} alt={template.name} />
                    </div>
                  )}
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
