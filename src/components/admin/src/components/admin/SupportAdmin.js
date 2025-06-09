// src/components/admin/SupportAdmin.js
import React, { useState, useEffect } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { 
  FaPlus, 
  FaTrash, 
  FaImage, 
  FaSpinner,
  FaSave,
  FaQuestionCircle
} from 'react-icons/fa';
import '../../styles/components/admin/ContentEditor.css';

const SupportAdmin = ({ initialContent, onSave, onCancel, isSaving }) => {
  const [content, setContent] = useState(initialContent || {
    hero: {
      title: 'How Can We Help You?',
      subtitle: 'Find answers to frequently asked questions or reach out to our support team'
    },
    contactMethods: [
      {
        id: 'phone',
        title: 'Call Us',
        value: '+91 8722237574',
        description: '7 AM - 10 PM, All days',
        icon: 'phone'
      },
      {
        id: 'email',
        title: 'Email Support',
        value: 'official.tazatabutchers@gmail.com',
        description: 'Response within 24 hours',
        icon: 'email'
      },
      {
        id: 'whatsapp',
        title: 'WhatsApp',
        value: '+91 8722237574',
        description: 'Quick support via WhatsApp',
        icon: 'whatsapp'
      }
    ],
    faqCategories: [
      {
        id: 'ordering',
        name: 'Ordering',
        faqs: [
          {
            question: 'How do I place an order?',
            answer: 'Download our app, create an account, browse products, add to cart, and checkout.'
          }
        ]
      }
    ]
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
    
    const imageName = `support/${path.replace(/\./g, '-')}-${Date.now()}`;
    
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

  // Add new contact method
  const addContactMethod = () => {
    addArrayItem('contactMethods', {
      id: `contact-method-${Date.now()}`,
      title: 'New Contact Method',
      value: '',
      description: '',
      icon: 'contact'
    });
  };

  // Add new FAQ category
  const addFaqCategory = () => {
    addArrayItem('faqCategories', {
      id: `category-${Date.now()}`,
      name: 'New Category',
      faqs: []
    });
  };

  // Add new FAQ to a category
  const addFaq = (categoryIndex) => {
    const faqCategories = [...(content.faqCategories || [])];
    if (!faqCategories[categoryIndex].faqs) {
      faqCategories[categoryIndex].faqs = [];
    }
    
    faqCategories[categoryIndex].faqs.push({
      question: 'New Question',
      answer: 'Enter the answer here.'
    });
    
    handleContentChange('faqCategories', faqCategories);
  };

  // Update FAQ
  const updateFaq = (categoryIndex, faqIndex, field, value) => {
    const faqCategories = [...(content.faqCategories || [])];
    faqCategories[categoryIndex].faqs[faqIndex][field] = value;
    
    handleContentChange('faqCategories', faqCategories);
  };

  // Remove FAQ
  const removeFaq = (categoryIndex, faqIndex) => {
    const faqCategories = [...(content.faqCategories || [])];
    faqCategories[categoryIndex].faqs.splice(faqIndex, 1);
    
    handleContentChange('faqCategories', faqCategories);
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
        <h3>Support Hero Section</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={content.hero?.title || ''}
            onChange={(e) => handleContentChange('hero.title', e.target.value)}
            placeholder="Support page title"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Subtitle:</label>
          <textarea
            value={content.hero?.subtitle || ''}
            onChange={(e) => handleContentChange('hero.subtitle', e.target.value)}
            placeholder="Support page subtitle"
            rows={2}
            disabled={isSaving}
          />
        </div>
        
        {/* <div className="form-group">
          <label>Hero Image:</label>
          <div className="image-upload-container">
            {content.hero?.imageUrl && (
              <div className="image-preview">
                <img src={content.hero.imageUrl} alt="Support hero" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('hero.imageUrl', e.target.files[0])}
              disabled={isSaving || uploadingImages['hero.imageUrl']}
              id="heroImageUpload"
              style={{ display: 'none' }}
            />
            <label htmlFor="heroImageUpload" className="upload-image-btn">
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
        </div> */}
      </div>

      {/* Contact Methods */}
      <div className="editor-section">
        <h3>Contact Methods</h3>
        {(content.contactMethods || []).map((method, index) => (
          <div key={index} className="list-item-editor">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={method.title || ''}
                onChange={(e) => handleArrayChange('contactMethods', index, { ...method, title: e.target.value })}
                placeholder="Contact method title"
                disabled={isSaving}
              />
            </div>
            <div className="form-group">
              <label>Value (phone, email, etc.):</label>
              <input
                type="text"
                value={method.value || ''}
                onChange={(e) => handleArrayChange('contactMethods', index, { ...method, value: e.target.value })}
                placeholder="Contact value"
                disabled={isSaving}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <input
                type="text"
                value={method.description || ''}
                onChange={(e) => handleArrayChange('contactMethods', index, { ...method, description: e.target.value })}
                placeholder="Contact description"
                disabled={isSaving}
              />
            </div>
            <div className="form-group">
              <label>Icon:</label>
              <select
                value={method.icon || 'contact'}
                onChange={(e) => handleArrayChange('contactMethods', index, { ...method, icon: e.target.value })}
                disabled={isSaving}
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="location">Location</option>
                <option value="contact">Contact</option>
              </select>
            </div>
            <button
              className="remove-item-btn"
              onClick={() => removeArrayItem('contactMethods', index)}
              disabled={isSaving}
            >
              <FaTrash /> Remove Contact Method
            </button>
          </div>
        ))}
        <button
          className="add-item-btn"
          onClick={addContactMethod}
          disabled={isSaving}
        >
          <FaPlus /> Add Contact Method
        </button>
      </div>

      {/* FAQ Categories */}
      <div className="editor-section">
        <h3>FAQ Categories</h3>
        {(content.faqCategories || []).map((category, categoryIndex) => (
          <div key={categoryIndex} className="list-item-editor faq-category">
            <div className="form-group">
              <label>Category Name:</label>
              <input
                type="text"
                value={category.name || ''}
                onChange={(e) => handleArrayChange('faqCategories', categoryIndex, { ...category, name: e.target.value })}
                placeholder="Category name"
                disabled={isSaving}
              />
            </div>
            
            <h4>FAQs in this category:</h4>
            {(category.faqs || []).map((faq, faqIndex) => (
              <div key={faqIndex} className="faq-item">
                <div className="form-group">
                  <label>Question:</label>
                  <input
                    type="text"
                    value={faq.question || ''}
                    onChange={(e) => updateFaq(categoryIndex, faqIndex, 'question', e.target.value)}
                    placeholder="FAQ question"
                    disabled={isSaving}
                  />
                </div>
                <div className="form-group">
                  <label>Answer:</label>
                  <textarea
                    value={faq.answer || ''}
                    onChange={(e) => updateFaq(categoryIndex, faqIndex, 'answer', e.target.value)}
                    placeholder="FAQ answer"
                    rows={3}
                    disabled={isSaving}
                  />
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => removeFaq(categoryIndex, faqIndex)}
                  disabled={isSaving}
                >
                  <FaTrash /> Remove FAQ
                </button>
              </div>
            ))}
            
            <div className="faq-category-actions">
              <button
                className="add-item-btn"
                onClick={() => addFaq(categoryIndex)}
                disabled={isSaving}
              >
                <FaQuestionCircle /> Add FAQ
              </button>
              <button
                className="remove-item-btn"
                onClick={() => removeArrayItem('faqCategories', categoryIndex)}
                disabled={isSaving}
              >
                <FaTrash /> Remove Category
              </button>
            </div>
          </div>
        ))}
        <button
          className="add-item-btn"
          onClick={addFaqCategory}
          disabled={isSaving}
        >
          <FaPlus /> Add FAQ Category
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
    </div>
  );
};

export default SupportAdmin;