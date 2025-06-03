// src/components/admin/UsefulLinksAdmin.js
import React, { useState, useEffect } from 'react';
import { 
  FaSave,
  FaSpinner
} from 'react-icons/fa';
import '../../styles/components/admin/ContentEditor.css';

const UsefulLinksAdmin = ({ initialLink, onSave, onCancel, isSaving }) => {
  const [link, setLink] = useState(initialLink || {
    title: '',
    enabled: true,
    url: '',
    contentType: 'generic'
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialLink) {
      setLink(initialLink);
    }
  }, [initialLink]);

  const handleChange = (field, value) => {
    setLink(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Simple validation
    if (!link.title.trim()) {
      setError('Link title is required');
      return;
    }
    
    // If external link, validate URL
    if (link.url && !link.url.startsWith('http://') && !link.url.startsWith('https://')) {
      setLink(prev => ({
        ...prev,
        url: `https://${prev.url}`
      }));
    }
    
    // Save the link
    onSave(link);
  };

  return (
    <div className="content-editor-body">
      {error && <div className="error-message">{error}</div>}
      
      <div className="editor-section">
        <h3>Link Settings</h3>
        
        <div className="form-group">
          <label>Link Title:</label>
          <input
            type="text"
            value={link.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter link title"
            disabled={isSaving}
          />
        </div>
        
        <div className="form-group">
          <label>Link URL:</label>
          <input
            type="text"
            value={link.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="Enter URL (leave empty for internal page)"
            disabled={isSaving}
          />
          <div className="hint-text">
            For external links, include full URL (https://example.com)
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={link.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              disabled={isSaving}
            />
            Enable Link
          </label>
        </div>
      </div>
      
      <div className="editor-actions">
        <button 
          className="save-btn" 
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <FaSpinner className="spinning" /> Saving...
            </>
          ) : (
            <>
              <FaSave /> Save Changes
            </>
          )}
        </button>
        
        <button 
          className="cancel-btn" 
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>
      </div>
      
      <style jsx>{`
        .hint-text {
          font-size: 0.85rem;
          color: #666;
          margin-top: 5px;
          font-style: italic;
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UsefulLinksAdmin;