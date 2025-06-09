


// src/components/admin/NewsroomAdmin.js
import React, { useState, useEffect } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { 
  FaPlus, 
  FaTrash, 
  FaImage, 
  FaSpinner,
  FaSave,
  FaLink,
  FaTimes
} from 'react-icons/fa';
import '../../styles/components/admin/ContentEditor.css';

const NewsroomAdmin = ({ initialContent, onSave, onCancel, isSaving }) => {
  const [content, setContent] = useState(initialContent || {
    hero: {
      title: 'ZappCart Newsroom',
      subtitle: 'Latest news, announcements, and media resources'
    },
    comingSoon: {
      enabled: true,
      message: 'We\'re preparing a dedicated space to share our latest news, announcements, and media resources with you.',
      features: [
        'Latest ZappCart announcements and press releases',
        'Expansion updates as we grow across Bengaluru',
        'Media coverage and featured stories',
        'Downloadable resources for media partners',
        'Company milestones and achievements'
      ]
    },
    pressReleases: [], // Changed from articles to pressReleases to match the user-facing component
    socialLinks: [
      { platform: 'Twitter', url: 'https://x.com/zappcart' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/' },
      { platform: 'Instagram', url: 'https://www.instagram.com/_zappcart/' }
    ],
    mediaKit: {
      available: false,
      description: 'Media resources and brand assets will be available here soon.'
    }
  });
  
  const [uploadingImages, setUploadingImages] = useState({});
  const [deletingImages, setDeletingImages] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Update local content if initialContent changes
  useEffect(() => {
    if (initialContent) {
      // Convert old content format to new format if needed
      const updatedContent = { ...initialContent };
      
      // If initialContent has 'articles' but no 'pressReleases', convert them
      if (initialContent.articles && (!initialContent.pressReleases || initialContent.pressReleases.length === 0)) {
        updatedContent.pressReleases = initialContent.articles.map(article => ({
          title: article.title,
          date: article.date,
          excerpt: article.summary,
          content: article.content,
          imageUrl: article.imageUrl,
          link: article.source || '#'
        }));
      }
      
      setContent(updatedContent);
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

  // Extract image filename from URL
  const getFilenameFromUrl = (url) => {
    try {
      // Firebase storage URLs typically have a structure where the filename is after the last '/' and before '?'
      const path = url.split('?')[0];
      const filename = path.substring(path.lastIndexOf('/') + 1);
      return decodeURIComponent(filename);
    } catch (error) {
      console.error("Error extracting filename from URL:", error);
      return null;
    }
  };

  // Delete image from Firebase Storage
  const deleteImage = async (path, imageUrl) => {
    if (!imageUrl) return;
    
    try {
      // Set deleting state
      setDeletingImages(prev => ({
        ...prev,
        [path]: true
      }));
      
      // Extract the filename or path from the URL
      const fullPath = imageUrl.includes('newsroom/') 
        ? `newsroom/${getFilenameFromUrl(imageUrl)}`
        : getFilenameFromUrl(imageUrl);
      
      if (!fullPath) {
        throw new Error("Could not determine file path from URL");
      }
      
      // Create a reference to the image
      const imageRef = storageRef(storage, fullPath);
      
      // Delete the image
      await deleteObject(imageRef);
      
      // Update the content to remove the image URL
      const pathParts = path.split('.');
      if (pathParts.length > 2 && pathParts[0] === 'pressReleases') {
        // Handle press release image
        const releaseIndex = parseInt(pathParts[1].replace(/[^\d]/g, ''), 10);
        const release = { ...content.pressReleases[releaseIndex] };
        release.imageUrl = '';
        handleArrayChange('pressReleases', releaseIndex, release);
      } else {
        // Handle other images
        handleContentChange(path, '');
      }
      
      setSuccessMessage('Image deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(`Failed to delete image: ${err.message}`);
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeletingImages(prev => ({
        ...prev,
        [path]: false
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (path, file) => {
    if (!file) return;
    
    const imageName = `newsroom/${path.replace(/\./g, '-')}-${Date.now()}`;
    
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
      
      // Extract the path to determine if it's a press release image or hero
      const pathParts = path.split('.');
      if (pathParts.length > 2 && pathParts[0] === 'pressReleases') {
        // Handle press release image
        const releaseIndex = parseInt(pathParts[1].replace(/[^\d]/g, ''), 10);
        const release = { ...content.pressReleases[releaseIndex] };
        release.imageUrl = downloadURL;
        handleArrayChange('pressReleases', releaseIndex, release);
      } else {
        // Handle other images
        handleContentChange(path, downloadURL);
      }
      
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

  // Add new press release
  const addPressRelease = () => {
    addArrayItem('pressReleases', {
      id: `release-${Date.now()}`,
      title: 'New Press Release',
      excerpt: 'Enter a brief summary for this press release.',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '',
      content: '',
      link: '#'
    });
  };

  // Add new social link
  const addSocialLink = () => {
    addArrayItem('socialLinks', {
      platform: 'New Platform',
      url: ''
    });
  };

  // Add new feature to coming soon section
  const addFeature = () => {
    if (!content.comingSoon) {
      handleContentChange('comingSoon', {
        enabled: true,
        message: '',
        features: ['New feature']
      });
    } else if (!content.comingSoon.features) {
      handleContentChange('comingSoon.features', ['New feature']);
    } else {
      addArrayItem('comingSoon.features', 'New feature');
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

      {/* Hero Section */}
      <div className="editor-section">
        <h3>Newsroom Hero</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={content.hero?.title || ''}
            onChange={(e) => handleContentChange('hero.title', e.target.value)}
            placeholder="Newsroom title"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Subtitle:</label>
          <textarea
            value={content.hero?.subtitle || ''}
            onChange={(e) => handleContentChange('hero.subtitle', e.target.value)}
            placeholder="Newsroom subtitle"
            rows={2}
            disabled={isSaving}
          />
        </div>
        
        <div className="form-group">
          <label>Hero Image:</label>
          <div className="image-upload-container">
            {content.hero?.imageUrl && (
              <div className="image-preview">
                <img src={content.hero.imageUrl} alt="Newsroom hero" />
                <button 
                  className="delete-image-btn" 
                  onClick={() => deleteImage('hero.imageUrl', content.hero.imageUrl)}
                  disabled={isSaving || deletingImages['hero.imageUrl']}
                >
                  {deletingImages['hero.imageUrl'] ? <FaSpinner className="spinning" /> : <FaTimes />}
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('hero.imageUrl', e.target.files[0])}
              disabled={isSaving || uploadingImages['hero.imageUrl']}
              id="newsroomHeroImageUpload"
              style={{ display: 'none' }}
            />
            <label htmlFor="newsroomHeroImageUpload" className="upload-image-btn">
              {uploadingImages['hero.imageUrl'] ? (
                <>
                  <FaSpinner className="spinning" /> Uploading...
                </>
              ) : (
                <>
                  <FaImage /> {content.hero?.imageUrl ? 'Replace Hero Image' : 'Upload Hero Image'}
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Coming Soon Settings */}
      <div className="editor-section">
        <h3>Coming Soon Settings</h3>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={content.comingSoon?.enabled || false}
              onChange={(e) => handleContentChange('comingSoon.enabled', e.target.checked)}
              disabled={isSaving}
            />
            Enable Coming Soon Mode
          </label>
        </div>
        {content.comingSoon?.enabled && (
          <>
            <div className="form-group">
              <label>Coming Soon Message:</label>
              <textarea
                value={content.comingSoon?.message || ''}
                onChange={(e) => handleContentChange('comingSoon.message', e.target.value)}
                placeholder="Coming soon message"
                rows={3}
                disabled={isSaving}
              />
            </div>
            
            <h4>Expected Features:</h4>
            <div className="dynamic-list">
              {(content.comingSoon?.features || []).map((feature, index) => (
                <div key={index} className="list-item-editor simple">
                  <textarea
                    value={feature || ''}
                    onChange={(e) => handleArrayChange('comingSoon.features', index, e.target.value)}
                    placeholder="Feature description"
                    rows={2}
                    disabled={isSaving}
                  />
                  <button
                    className="remove-item-btn"
                    onClick={() => removeArrayItem('comingSoon.features', index)}
                    disabled={isSaving}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                className="add-item-btn"
                onClick={addFeature}
                disabled={isSaving}
              >
                <FaPlus /> Add Feature
              </button>
            </div>
          </>
        )}
      </div>

      {/* Press Releases */}
      <div className="editor-section">
        <h3>Press Releases</h3>
        <button
          className="add-item-btn"
          onClick={addPressRelease}
          disabled={isSaving}
        >
          <FaPlus /> Add Press Release
        </button>
        
        {(content.pressReleases || []).map((release, index) => (
          <div key={index} className="list-item-editor">
            <div className="form-group">
              <label>Release Title:</label>
              <input
                type="text"
                value={release.title || ''}
                onChange={(e) => handleArrayChange('pressReleases', index, { 
                  ...release, 
                  title: e.target.value 
                })}
                placeholder="Release title"
                disabled={isSaving}
              />
            </div>
            
            <div className="form-group">
              <label>Excerpt:</label>
              <textarea
                value={release.excerpt || ''}
                onChange={(e) => handleArrayChange('pressReleases', index, { 
                  ...release, 
                  excerpt: e.target.value 
                })}
                placeholder="Release excerpt"
                rows={2}
                disabled={isSaving}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label>Date:</label>
                <input
                  type="date"
                  value={release.date || ''}
                  onChange={(e) => handleArrayChange('pressReleases', index, { 
                    ...release, 
                    date: e.target.value 
                  })}
                  disabled={isSaving}
                />
              </div>
              
              <div className="form-group half">
                <label>Link:</label>
                <div className="url-input">
                  <FaLink className="url-icon" />
                  <input
                    type="url"
                    value={release.link || ''}
                    onChange={(e) => handleArrayChange('pressReleases', index, { 
                      ...release, 
                      link: e.target.value 
                    })}
                    placeholder="https://example.com/press-release"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Release Image:</label>
              <div className="image-upload-container">
                {release.imageUrl && (
                  <div className="image-preview">
                    <img src={release.imageUrl} alt={release.title} />
                    <button 
                      className="delete-image-btn" 
                      onClick={() => deleteImage(`pressReleases.${index}.imageUrl`, release.imageUrl)}
                      disabled={isSaving || deletingImages[`pressReleases.${index}.imageUrl`]}
                    >
                      {deletingImages[`pressReleases.${index}.imageUrl`] ? <FaSpinner className="spinning" /> : "X"}
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(`pressReleases.${index}.imageUrl`, e.target.files[0])}
                  disabled={isSaving || uploadingImages[`pressReleases.${index}.imageUrl`]}
                  id={`release-${index}-image`}
                  style={{ display: 'none' }}
                />
                <label htmlFor={`release-${index}-image`} className="upload-image-btn">
                  {uploadingImages[`pressReleases.${index}.imageUrl`] ? (
                    <>
                      <FaSpinner className="spinning" /> Uploading...
                    </>
                  ) : (
                    <>
                      <FaImage /> {release.imageUrl ? 'Replace Release Image' : 'Upload Release Image'}
                    </>
                  )}
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Content:</label>
              <textarea
                value={release.content || ''}
                onChange={(e) => handleArrayChange('pressReleases', index, { 
                  ...release, 
                  content: e.target.value 
                })}
                placeholder="Release content"
                rows={6}
                disabled={isSaving}
              />
            </div>
            
            <button
              className="remove-item-btn"
              onClick={() => removeArrayItem('pressReleases', index)}
              disabled={isSaving}
            >
              <FaTrash /> Remove Press Release
            </button>
          </div>
        ))}
      </div>

      {/* Media Kit Settings */}
      <div className="editor-section">
        <h3>Media Kit</h3>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={content.mediaKit?.available || false}
              onChange={(e) => handleContentChange('mediaKit.available', e.target.checked)}
              disabled={isSaving}
            />
            Media Kit Available
          </label>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={content.mediaKit?.description || ''}
            onChange={(e) => handleContentChange('mediaKit.description', e.target.value)}
            placeholder="Media kit description"
            rows={3}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="editor-section">
        <h3>Social Media Links</h3>
        {(content.socialLinks || []).map((link, index) => (
          <div key={index} className="list-item-editor social-link">
            <div className="form-row">
              <div className="form-group half">
                <label>Platform:</label>
                <input
                  type="text"
                  value={link.platform || ''}
                  onChange={(e) => handleArrayChange('socialLinks', index, { 
                    ...link, 
                    platform: e.target.value 
                  })}
                  placeholder="Social platform"
                  disabled={isSaving}
                />
              </div>
              
              <div className="form-group half">
                <label>URL:</label>
                <div className="url-input">
                  <FaLink className="url-icon" />
                  <input
                    type="url"
                    value={link.url || ''}
                    onChange={(e) => handleArrayChange('socialLinks', index, { 
                      ...link, 
                      url: e.target.value 
                    })}
                    placeholder="https://example.com"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
            
            <button
              className="remove-item-btn"
              onClick={() => removeArrayItem('socialLinks', index)}
              disabled={isSaving}
            >
              <FaTrash /> Remove Link
            </button>
          </div>
        ))}
        <button
          className="add-item-btn"
          onClick={addSocialLink}
          disabled={isSaving}
        >
          <FaPlus /> Add Social Link
        </button>
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

      <style jsx>{`
        /* Add these styles to your existing CSS file or include them here */
        .image-preview {
          position: relative;
          margin-bottom: 10px;
          display: inline-block;
          max-width: 200px;
        }
        
        .image-preview img {
          max-width: 100%;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        
        .delete-image-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          background-color: rgba(255, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s;
          font-weight: bold;
          font-size: 14px;
          line-height: 1;
        }
        
        .delete-image-btn:hover {
          background-color: rgba(255, 0, 0, 0.9);
        }
        
        .delete-image-btn:disabled {
          background-color: rgba(150, 150, 150, 0.7);
          cursor: not-allowed;
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

export default NewsroomAdmin;