// src/components/admin/BlogAdmin.js
import React, { useState, useEffect } from 'react';
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

const BlogAdmin = ({ initialContent, onSave, onCancel, isSaving }) => {
  const [content, setContent] = useState(initialContent || {
    intro: {
      title: 'ZappCart Blog',
      subtitle: 'Fresh insights, recipes, and meat knowledge',
      description: 'Discover the latest news, cooking tips, and meat expertise from ZappCart.'
    },
    categories: ['Recipes', 'Meat Guide', 'Health & Nutrition', 'Company News'],
    featuredPosts: [],
    comingSoon: {
      enabled: true,
      message: 'Our blog is coming soon! Stay tuned for amazing content about meat, recipes, and more.',
      launchDate: '2025-02-01'
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
    
    const imageName = `blog/${path.replace(/\./g, '-')}-${Date.now()}`;
    
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
      
      // Extract the path to determine if it's a post image or header
      const pathParts = path.split('.');
      if (pathParts.length > 2 && pathParts[0] === 'featuredPosts') {
        // Handle post image
        const postIndex = parseInt(pathParts[1].replace(/[^\d]/g, ''), 10);
        const post = { ...content.featuredPosts[postIndex] };
        post.imageUrl = downloadURL;
        handleArrayChange('featuredPosts', postIndex, post);
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

  // Handle category change
  const handleCategoryChange = (index, value) => {
    const categories = [...(content.categories || [])];
    categories[index] = value;
    handleContentChange('categories', categories);
  };

  // Add new category
  const addCategory = () => {
    const categories = [...(content.categories || []), 'New Category'];
    handleContentChange('categories', categories);
  };

  // Remove category
  const removeCategory = (index) => {
    const categories = [...(content.categories || [])];
    categories.splice(index, 1);
    handleContentChange('categories', categories);
  };

  // Add new blog post
  const addBlogPost = () => {
    addArrayItem('featuredPosts', {
      id: `post-${Date.now()}`,
      title: 'New Blog Post',
      excerpt: 'Enter a brief excerpt for this blog post.',
      category: content.categories?.[0] || 'Uncategorized',
      readTime: '3 min read',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '',
      content: ''
    });
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

      {/* Blog Introduction */}
      <div className="editor-section">
        <h3>Blog Introduction</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={content.intro?.title || ''}
            onChange={(e) => handleContentChange('intro.title', e.target.value)}
            placeholder="Blog title"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Subtitle:</label>
          <input
            type="text"
            value={content.intro?.subtitle || ''}
            onChange={(e) => handleContentChange('intro.subtitle', e.target.value)}
            placeholder="Blog subtitle"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={content.intro?.description || ''}
            onChange={(e) => handleContentChange('intro.description', e.target.value)}
            placeholder="Blog description"
            rows={3}
            disabled={isSaving}
          />
        </div>
        
        <div className="form-group">
          <label>Header Image:</label>
          <div className="image-upload-container">
            {content.intro?.imageUrl && (
              <div className="image-preview">
                <img src={content.intro.imageUrl} alt="Blog header" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('intro.imageUrl', e.target.files[0])}
              disabled={isSaving || uploadingImages['intro.imageUrl']}
              id="headerImageUpload"
              style={{ display: 'none' }}
            />
            <label htmlFor="headerImageUpload" className="upload-image-btn">
              {uploadingImages['intro.imageUrl'] ? (
                <>
                  <FaSpinner className="spinning" /> Uploading...
                </>
              ) : (
                <>
                  <FaImage /> {content.intro?.imageUrl ? 'Replace Header Image' : 'Upload Header Image'}
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Blog Categories */}
      <div className="editor-section">
        <h3>Blog Categories</h3>
        <div className="dynamic-list">
          {(content.categories || []).map((category, index) => (
            <div key={index} className="list-item-editor simple">
              <input
                type="text"
                value={category || ''}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                placeholder="Category name"
                disabled={isSaving}
              />
              <button
                className="remove-item-btn"
                onClick={() => removeCategory(index)}
                disabled={isSaving}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            className="add-item-btn"
            onClick={addCategory}
            disabled={isSaving}
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="editor-section">
        <h3>Blog Posts</h3>
        <button
          className="add-item-btn"
          onClick={addBlogPost}
          disabled={isSaving}
        >
          <FaPlus /> Add New Blog Post
        </button>
        
        {(content.featuredPosts || []).map((post, index) => (
          <div key={index} className="list-item-editor blog-post-editor">
            <div className="form-group">
              <label>Post Title:</label>
              <input
                type="text"
                value={post.title || ''}
                onChange={(e) => handleArrayChange('featuredPosts', index, { 
                  ...post, 
                  title: e.target.value 
                })}
                placeholder="Post title"
                disabled={isSaving}
              />
            </div>
            
            <div className="form-group">
              <label>Excerpt:</label>
              <textarea
                value={post.excerpt || ''}
                onChange={(e) => handleArrayChange('featuredPosts', index, { 
                  ...post, 
                  excerpt: e.target.value 
                })}
                placeholder="Post excerpt"
                rows={2}
                disabled={isSaving}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label>Category:</label>
                <select
                  value={post.category || ''}
                  onChange={(e) => handleArrayChange('featuredPosts', index, { 
                    ...post, 
                    category: e.target.value 
                  })}
                  disabled={isSaving}
                >
                  {content.categories?.map((category, catIndex) => (
                    <option key={catIndex} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group half">
                <label>Read Time:</label>
                <input
                  type="text"
                  value={post.readTime || ''}
                  onChange={(e) => handleArrayChange('featuredPosts', index, { 
                    ...post, 
                    readTime: e.target.value 
                  })}
                  placeholder="Read time"
                  disabled={isSaving}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={post.date || ''}
                onChange={(e) => handleArrayChange('featuredPosts', index, { 
                  ...post, 
                  date: e.target.value 
                })}
                disabled={isSaving}
              />
            </div>
            
            <div className="form-group">
              <label>Featured Image:</label>
              <div className="image-upload-container">
                {post.imageUrl && (
                  <div className="image-preview">
                    <img src={post.imageUrl} alt={post.title} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(`featuredPosts.${index}.imageUrl`, e.target.files[0])}
                  disabled={isSaving || uploadingImages[`featuredPosts.${index}.imageUrl`]}
                  id={`post-${index}-image`}
                  style={{ display: 'none' }}
                />
                <label htmlFor={`post-${index}-image`} className="upload-image-btn">
                  {uploadingImages[`featuredPosts.${index}.imageUrl`] ? (
                    <>
                      <FaSpinner className="spinning" /> Uploading...
                    </>
                  ) : (
                    <>
                      <FaImage /> {post.imageUrl ? 'Replace Post Image' : 'Upload Post Image'}
                    </>
                  )}
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Content:</label>
              <textarea
                value={post.content || ''}
                onChange={(e) => handleArrayChange('featuredPosts', index, { 
                  ...post, 
                  content: e.target.value 
                })}
                placeholder="Post content"
                rows={6}
                disabled={isSaving}
              />
            </div>
            
            <button
              className="remove-item-btn"
              onClick={() => removeArrayItem('featuredPosts', index)}
              disabled={isSaving}
            >
              <FaTrash /> Remove Post
            </button>
          </div>
        ))}
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
            <div className="form-group">
              <label>Launch Date:</label>
              <input
                type="date"
                value={content.comingSoon?.launchDate || ''}
                onChange={(e) => handleContentChange('comingSoon.launchDate', e.target.value)}
                disabled={isSaving}
              />
            </div>
          </>
        )}
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

export default BlogAdmin;