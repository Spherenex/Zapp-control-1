// src/components/admin/SocialLinksAdmin.js
import React, { useState, useEffect } from 'react';
import { FaLink, FaSave, FaSpinner, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPinterest, FaTiktok } from 'react-icons/fa';
import '../../styles/components/admin/ContentEditor.css';

const SocialLinksAdmin = ({ initialLink, onSave, onCancel, isSaving }) => {
  const [link, setLink] = useState(initialLink || {
    id: Date.now(),
    title: 'New Social Link',
    enabled: true,
    contentType: 'social',
    url: '',
    platform: 'Twitter',
    icon: 'twitter'
  });
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Platform icons mapping
  const platformIcons = {
    'Twitter': <FaTwitter />,
    'Facebook': <FaFacebook />,
    'Instagram': <FaInstagram />,
    'LinkedIn': <FaLinkedin />,
    'YouTube': <FaYoutube />,
    'Pinterest': <FaPinterest />,
    'TikTok': <FaTiktok />
  };

  // Platform to icon name mapping
  const platformToIcon = {
    'Twitter': 'twitter',
    'Facebook': 'facebook',
    'Instagram': 'instagram',
    'LinkedIn': 'linkedin',
    'YouTube': 'youtube',
    'Pinterest': 'pinterest',
    'TikTok': 'tiktok'
  };

  // Update local content if initialLink changes
  useEffect(() => {
    if (initialLink) {
      setLink(initialLink);
    }
  }, [initialLink]);

  // Handle input change
  const handleInputChange = (field, value) => {
    setLink(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle platform change and update icon accordingly
  const handlePlatformChange = (platform) => {
    setLink(prev => ({
      ...prev,
      title: platform,
      platform,
      icon: platformToIcon[platform] || 'link'
    }));
  };

  // Handle save
  const handleSave = () => {
    if (!link.title.trim()) {
      setError('Social platform name is required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!link.url.trim()) {
      setError('URL is required for social links');
      setTimeout(() => setError(''), 3000);
      return;
    }

    onSave(link);
  };

  return (
    <div className="content-editor-body">
      {(error || successMessage) && (
        <div className="message-container">
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
      )}

      <div className="editor-section">
        <h3>Social Link Settings</h3>
        
        <div className="form-group">
          <label>Social Platform:</label>
          <select
            value={link.platform || 'Twitter'}
            onChange={(e) => handlePlatformChange(e.target.value)}
            disabled={isSaving}
          >
            <option value="Twitter">Twitter</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="YouTube">YouTube</option>
            <option value="Pinterest">Pinterest</option>
            <option value="TikTok">TikTok</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        
        {link.platform === 'Custom' && (
          <div className="form-group">
            <label>Custom Platform Name:</label>
            <input
              type="text"
              value={link.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Custom platform name"
              disabled={isSaving}
            />
          </div>
        )}

        <div className="form-group">
          <label>URL:</label>
          <div className="url-input">
            {platformIcons[link.platform] || <FaLink />}
            <input
              type="url"
              value={link.url || ''}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://example.com"
              disabled={isSaving}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={link.enabled}
              onChange={(e) => handleInputChange('enabled', e.target.checked)}
              disabled={isSaving}
            />
            Enable Link
          </label>
        </div>

        <div className="social-preview">
          <h4>Preview:</h4>
          <div className="social-button">
            <span className="social-icon">
              {platformIcons[link.platform] || <FaLink />}
            </span>
            <span className="social-name">{link.title}</span>
          </div>
        </div>
      </div>

      <div className="editor-actions">
        <button 
          className="save-btn" 
          onClick={handleSave}
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
    </div>
  );
};

export default SocialLinksAdmin;