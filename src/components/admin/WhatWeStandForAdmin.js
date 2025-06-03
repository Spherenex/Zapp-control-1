// src/components/admin/WhatWeStandForAdmin.js
import React, { useState, useEffect } from 'react';
import { ref as dbRef, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { 
  FaPlus, 
  FaTrash, 
  FaImage, 
  FaSpinner,
  FaSave
} from 'react-icons/fa';
import '../../styles/components/admin/ContentEditor.css';

const WhatWeStandForAdmin = ({ initialContent, onSave, onCancel, isSaving }) => {
  const [content, setContent] = useState(initialContent || {
    intro: {
      title: 'What We Stand For',
      tagline: 'At ZappCart, we connect customers with trusted local meat vendors, ensuring freshness, quality, and convenience without compromise.'
    },
    coreValues: {
      title: 'Our Core Values',
      values: []
    },
    commitment: {
      title: 'Our Commitment',
      commitments: []
    },
    community: {
      title: 'What this means for our community:',
      points: [],
      note: ''
    },
    contact: {
      title: 'Have questions or suggestions?',
      description: 'We\'d love to hear from you! Contact us at',
      email: 'official.tazatabutchers@gmail.com'
    },
    footer: {
      text: 'Thank you for supporting a ZappCart that supports local.'
    },
    images: {
      supportImage: '',
      qualityImage: ''
    }
  });
  
  const [uploadingImages, setUploadingImages] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Update local content if initialContent changes
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  // Handle content change
  const handleContentChange = (path, value) => {
    const keys = path.split('.');
    
    setContent(prev => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // Handle array change
  const handleArrayChange = (path, index, value) => {
    const keys = path.split('.');
    
    setContent(prev => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      if (!current[keys[keys.length - 1]]) current[keys[keys.length - 1]] = [];
      current[keys[keys.length - 1]][index] = value;
      return updated;
    });
  };

  // Add item to array
  const addArrayItem = (path, newItem) => {
    const keys = path.split('.');
    
    setContent(prev => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      if (!current[keys[keys.length - 1]]) current[keys[keys.length - 1]] = [];
      current[keys[keys.length - 1]].push(newItem);
      return updated;
    });
  };

  // Remove item from array
  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    
    setContent(prev => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) return prev; // Path doesn't exist
        current = current[keys[i]];
      }
      
      if (!current[keys[keys.length - 1]] || !Array.isArray(current[keys[keys.length - 1]])) {
        return prev; // Not an array
      }
      
      current[keys[keys.length - 1]].splice(index, 1);
      return updated;
    });
  };

  // Handle image upload
  const handleImageUpload = async (path, file) => {
    if (!file) return;
    
    const imageName = `whatWeStandFor/${path.replace(/\./g, '-')}-${Date.now()}`;
    
    try {
      // Set uploading state
      setUploadingImages(prev => ({
        ...prev,
        [path]: true
      }));
      
      // Create a reference to the image
      const imageRef = storageRef(storage, imageName);
      
      // Upload the image
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update content with the image URL
      handleContentChange(path, downloadURL);
      
      setSuccessMessage('Image uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(`Failed to upload image: ${err.message}`);
      setTimeout(() => setError(''), 3000);
    } finally {
      setUploadingImages(prev => ({
        ...prev,
        [path]: false
      }));
    }
  };

  // Handle save
  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="content-editor-body">
      {(error || successMessage) && (
        <div className="message-container">
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
      )}

      {/* Introduction Section */}
      <div className="editor-section">
        <h3>Introduction</h3>
        <div className="form-group">
          <label>Page Title:</label>
          <input
            type="text"
            value={content.intro?.title || ''}
            onChange={(e) => handleContentChange('intro.title', e.target.value)}
            placeholder="Page title"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Tagline:</label>
          <textarea
            value={content.intro?.tagline || ''}
            onChange={(e) => handleContentChange('intro.tagline', e.target.value)}
            placeholder="Page tagline"
            rows={3}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Core Values Section */}
      <div className="editor-section">
        <h3>Core Values</h3>
        <div className="form-group">
          <label>Section Title:</label>
          <input
            type="text"
            value={content.coreValues?.title || ''}
            onChange={(e) => handleContentChange('coreValues.title', e.target.value)}
            placeholder="Core Values section title"
            disabled={isSaving}
          />
        </div>
        
        <div className="dynamic-list">
          <h4>Values:</h4>
          {(content.coreValues?.values || []).map((value, index) => (
            <div key={index} className="list-item-editor">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={value.title || ''}
                  onChange={(e) => {
                    const updatedValue = { ...value, title: e.target.value };
                    handleArrayChange('coreValues.values', index, updatedValue);
                  }}
                  placeholder="Value title"
                  disabled={isSaving}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={value.description || ''}
                  onChange={(e) => {
                    const updatedValue = { ...value, description: e.target.value };
                    handleArrayChange('coreValues.values', index, updatedValue);
                  }}
                  placeholder="Value description"
                  rows={4}
                  disabled={isSaving}
                />
              </div>
              <button
                className="remove-item-btn"
                onClick={() => removeArrayItem('coreValues.values', index)}
                disabled={isSaving}
              >
                <FaTrash /> Remove Value
              </button>
            </div>
          ))}
          <button
            className="add-item-btn"
            onClick={() => addArrayItem('coreValues.values', { 
              id: `value-${Date.now()}`, 
              title: '', 
              description: '' 
            })}
            disabled={isSaving}
          >
            <FaPlus /> Add New Value
          </button>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="editor-section">
        <h3>Our Commitment</h3>
        <div className="form-group">
          <label>Section Title:</label>
          <input
            type="text"
            value={content.commitment?.title || ''}
            onChange={(e) => handleContentChange('commitment.title', e.target.value)}
            placeholder="Commitment section title"
            disabled={isSaving}
          />
        </div>
        
        <div className="dynamic-list">
          <h4>Commitments:</h4>
          {(content.commitment?.commitments || []).map((commitment, index) => (
            <div key={index} className="list-item-editor">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={commitment.title || ''}
                  onChange={(e) => {
                    const updatedCommitment = { ...commitment, title: e.target.value };
                    handleArrayChange('commitment.commitments', index, updatedCommitment);
                  }}
                  placeholder="Commitment title"
                  disabled={isSaving}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={commitment.description || ''}
                  onChange={(e) => {
                    const updatedCommitment = { ...commitment, description: e.target.value };
                    handleArrayChange('commitment.commitments', index, updatedCommitment);
                  }}
                  placeholder="Commitment description"
                  rows={4}
                  disabled={isSaving}
                />
              </div>
              <button
                className="remove-item-btn"
                onClick={() => removeArrayItem('commitment.commitments', index)}
                disabled={isSaving}
              >
                <FaTrash /> Remove Commitment
              </button>
            </div>
          ))}
          <button
            className="add-item-btn"
            onClick={() => addArrayItem('commitment.commitments', { 
              id: `commitment-${Date.now()}`, 
              title: '', 
              description: '' 
            })}
            disabled={isSaving}
          >
            <FaPlus /> Add New Commitment
          </button>
        </div>
      </div>

      {/* Community Section */}
      <div className="editor-section">
        <h3>Community Section</h3>
        <div className="form-group">
          <label>Section Title:</label>
          <input
            type="text"
            value={content.community?.title || ''}
            onChange={(e) => handleContentChange('community.title', e.target.value)}
            placeholder="Community section title"
            disabled={isSaving}
          />
        </div>
        
        <div className="dynamic-list">
          <h4>Community Points:</h4>
          {(content.community?.points || []).map((point, index) => (
            <div key={index} className="list-item-editor simple">
              <textarea
                value={point || ''}
                onChange={(e) => handleArrayChange('community.points', index, e.target.value)}
                placeholder="Community point"
                rows={2}
                disabled={isSaving}
              />
              <button
                className="remove-item-btn"
                onClick={() => removeArrayItem('community.points', index)}
                disabled={isSaving}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            className="add-item-btn"
            onClick={() => addArrayItem('community.points', '')}
            disabled={isSaving}
          >
            <FaPlus /> Add Community Point
          </button>
        </div>

        <div className="form-group">
          <label>Community Note:</label>
          <textarea
            value={content.community?.note || ''}
            onChange={(e) => handleContentChange('community.note', e.target.value)}
            placeholder="Community section note"
            rows={4}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Contact Section */}
      <div className="editor-section">
        <h3>Contact Section</h3>
        <div className="form-group">
          <label>Contact Title:</label>
          <input
            type="text"
            value={content.contact?.title || ''}
            onChange={(e) => handleContentChange('contact.title', e.target.value)}
            placeholder="Contact section title"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Contact Description:</label>
          <input
            type="text"
            value={content.contact?.description || ''}
            onChange={(e) => handleContentChange('contact.description', e.target.value)}
            placeholder="Contact description"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={content.contact?.email || ''}
            onChange={(e) => handleContentChange('contact.email', e.target.value)}
            placeholder="Contact email"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="editor-section">
        <h3>Footer Text</h3>
        <div className="form-group">
          <label>Footer Message:</label>
          <input
            type="text"
            value={content.footer?.text || ''}
            onChange={(e) => handleContentChange('footer.text', e.target.value)}
            placeholder="Footer message"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Image Management Section */}
      <div className="editor-section image-management-section">
        <h3>Image Management</h3>
        
        <div className="form-group">
          <label>Support Image:</label>
          <div className="image-upload-container">
            {content.images?.supportImage && (
              <div className="image-preview">
                <img src={content.images.supportImage} alt="Support" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('images.supportImage', e.target.files[0])}
              disabled={isSaving || uploadingImages['images.supportImage']}
              id="supportImageUpload"
              style={{ display: 'none' }}
            />
            <label htmlFor="supportImageUpload" className="upload-image-btn">
              {uploadingImages['images.supportImage'] ? (
                <>
                  <FaSpinner className="spinning" /> Uploading...
                </>
              ) : (
                <>
                  <FaImage /> {content.images?.supportImage ? 'Replace Support Image' : 'Upload Support Image'}
                </>
              )}
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label>Quality Image:</label>
          <div className="image-upload-container">
            {content.images?.qualityImage && (
              <div className="image-preview">
                <img src={content.images.qualityImage} alt="Quality" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('images.qualityImage', e.target.files[0])}
              disabled={isSaving || uploadingImages['images.qualityImage']}
              id="qualityImageUpload"
              style={{ display: 'none' }}
            />
            <label htmlFor="qualityImageUpload" className="upload-image-btn">
              {uploadingImages['images.qualityImage'] ? (
                <>
                  <FaSpinner className="spinning" /> Uploading...
                </>
              ) : (
                <>
                  <FaImage /> {content.images?.qualityImage ? 'Replace Quality Image' : 'Upload Quality Image'}
                </>
              )}
            </label>
          </div>
        </div>
        
        <div className="image-tips">
          <h4>Image Guidelines:</h4>
          <ul>
            <li>Recommended size: 800x600px or larger</li>
            <li>Supported formats: JPG, PNG, WebP</li>
            <li>Maximum file size: 5MB</li>
            <li>Images will be displayed responsively</li>
          </ul>
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

export default WhatWeStandForAdmin;