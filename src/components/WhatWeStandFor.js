// // src/components/WhatWeStandFor.js///control panel
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ref as dbRef, onValue } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/components/WhatWeStandFor.css';
// import logoImage from '../assets/images/logo1.png';
// import supportImage from '../assets/images/support.png';
// import qualityImage from '../assets/images/quality.jpg';
// import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

// const WhatWeStandFor = () => {
//   const [content, setContent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Default content as fallback
//   const defaultContent = {
//     intro: {
//       title: 'What We Stand For',
//       tagline: 'At ZappCart, we connect customers with trusted local meat vendors, ensuring freshness, quality, and convenience without compromise.'
//     },
//     coreValues: {
//       title: 'Our Core Values',
//       values: [
//         {
//           id: 'fresh-not-frozen',
//           title: 'Fresh, Not Frozen',
//           description: 'We believe that fresh is always best. Unlike others, we don\'t keep meat in deep freezers or store it for days. Your meat is cleaned, cut, and packed only after you place your order, just like your neighborhood butcher, but faster.'
//         },
//         {
//           id: 'hygiene-first',
//           title: 'Hygiene First',
//           description: 'We prioritize health and safety above all. Our partner shops follow strict cleanliness protocols. All meat is handled with gloves, masks, and sealed in leak-proof, food-safe packaging to ensure the highest standards of hygiene.'
//         },
//         {
//           id: 'supporting-local',
//           title: 'Supporting Local',
//           description: 'We\'re proud to partner with carefully selected local shops in your neighborhood. We empower local meat vendors through our platform while ensuring customers receive premium service with a local touch.'
//         }
//       ]
//     },
//     commitment: {
//       title: 'Our Commitment',
//       commitments: [
//         {
//           id: 'super-fast-delivery',
//           title: 'Super-Fast Delivery',
//           description: 'We understand that time is valuable. Your meat is packed and out the door within minutes of cutting, reaching you in under 60 minutes in most areas. No waiting, no compromises.'
//         },
//         {
//           id: 'satisfaction-guaranteed',
//           title: 'Satisfaction Guaranteed',
//           description: 'Your happiness is our priority. Not happy with your order? We\'ll make it right with a replacement or refund based on our refund policy - no hassle, no stress.'
//         },
//         {
//           id: 'customer-centric-approach',
//           title: 'Customer-Centric Approach',
//           description: 'We\'re building ZappCart around you. From our easy-to-use app to our responsive customer support, we\'re dedicated to creating an experience that makes ordering meat simple, reliable, and stress-free.'
//         }
//       ]
//     },
//     community: {
//       title: 'What this means for our community:',
//       points: [
//         'We verify and regularly audit all partner vendors for quality and hygiene',
//         'We ensure timely delivery and transparent communication',
//         'We maintain the highest standards for food safety and handling',
//         'We actively listen to customer feedback to continuously improve our service',
//         'We support the growth of local businesses in the communities we serve'
//       ],
//       note: 'Our goal is to build a great experience for all our customers and partners - and we mean everyone. We\'re committed to offering the freshest meat with a focus on customer convenience, supporting local vendors, and ensuring the highest quality standards.'
//     },
//     contact: {
//       title: 'Have questions or suggestions?',
//       description: 'We\'d love to hear from you! Contact us at',
//       email: 'official.tazatabutchers@gmail.com'
//     },
//     footer: {
//       text: 'Thank you for supporting a ZappCart that supports local.'
//     }
//   };

//   useEffect(() => {
//     const loadContent = () => {
//       try {
//         const contentRef = dbRef(db, 'pages/whatWeStandFor');
//         const unsubscribe = onValue(contentRef, (snapshot) => {
//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             setContent(data);
//           } else {
//             // Use default content if no data exists in Firebase
//             setContent(defaultContent);
//           }
//           setLoading(false);
//         }, (error) => {
//           console.error("Error loading content:", error);
//           setError(error.message);
//           setContent(defaultContent); // Fallback to default content
//           setLoading(false);
//         });

//         return unsubscribe;
//       } catch (error) {
//         console.error("Error setting up content listener:", error);
//         setError(error.message);
//         setContent(defaultContent); // Fallback to default content
//         setLoading(false);
//       }
//     };

//     const unsubscribe = loadContent();
    
//     // Cleanup subscription on unmount
//     return () => {
//       if (unsubscribe && typeof unsubscribe === 'function') {
//         unsubscribe();
//       }
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="values-container loading-container">
//         <div className="values-header">
//           <Link to="/" className="back-link">
//             <FaArrowLeft /> Back to Home
//           </Link>
//         </div>
//         <div className="loading-section">
//           <div className="loading-spinner">
//             <FaSpinner className="spinner-icon" />
//           </div>
//           <p>Loading content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !content) {
//     return (
//       <div className="values-container error-container">
//         <div className="values-header">
//           <Link to="/" className="back-link">
//             <FaArrowLeft /> Back to Home
//           </Link>
//         </div>
//         <div className="error-section">
//           <h2>Error Loading Content</h2>
//           <p>We're having trouble loading the content. Please try refreshing the page.</p>
//           <button onClick={() => window.location.reload()}>Refresh Page</button>
//         </div>
//       </div>
//     );
//   }

//   // Use content from Firebase or fallback to default
//   const displayContent = content || defaultContent;

//   return (
//     <div className="values-container">
//       <div className="values-header">
//         <Link to="/" className="back-link">
//           <FaArrowLeft /> Back to Home
//         </Link>
//       </div>

//       <div className="values-content">
//         {/* Introduction Section */}
//         {displayContent.intro && (
//           <div className="values-intro">
//             <h1>{displayContent.intro.title}</h1>
//             <p className="values-tagline">
//               {displayContent.intro.tagline}
//             </p>
//           </div>
//         )}

//         {/* Core Values Section */}
//         {displayContent.coreValues && (
//           <div className="values-section">
//             <h2>{displayContent.coreValues.title}</h2>
            
//             {displayContent.coreValues.values && displayContent.coreValues.values.map((value, index) => (
//               <div key={value.id || index} className="value-item">
//                 <h3>{value.title}</h3>
//                 <p>{value.description}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Support Image */}
//         <div className="values-image-section">
//           <img src={supportImage} alt="ZappCart supporting local vendors" className="values-image" />
//         </div>

//         {/* Commitment Section */}
//         {displayContent.commitment && (
//           <div className="values-section">
//             <h2>{displayContent.commitment.title}</h2>
            
//             {displayContent.commitment.commitments && displayContent.commitment.commitments.map((commitment, index) => (
//               <div key={commitment.id || index} className="value-item">
//                 <h3>{commitment.title}</h3>
//                 <p>{commitment.description}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Quality Image */}
//         <div className="values-image-section">
//           <img src={qualityImage} alt="ZappCart quality assurance" className="values-image" />
//         </div>

//         {/* Community Section */}
//         {displayContent.community && (
//           <div className="values-respect-section">
//             <h2>{displayContent.community.title}</h2>
            
//             {displayContent.community.points && displayContent.community.points.length > 0 && (
//               <ul className="respect-list">
//                 {displayContent.community.points.map((point, index) => (
//                   <li key={index}>{point}</li>
//                 ))}
//               </ul>
//             )}
            
//             {displayContent.community.note && (
//               <p className="respect-note">
//                 {displayContent.community.note}
//               </p>
//             )}
//           </div>
//         )}

//         {/* Contact Section */}
//         {displayContent.contact && (
//           <div className="values-contact">
//             <h3>{displayContent.contact.title}</h3>
//             <p>
//               {displayContent.contact.description}{' '}
//               <a href={`mailto:${displayContent.contact.email}`}>
//                 {displayContent.contact.email}
//               </a>
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Footer Section */}
//       {displayContent.footer && (
//         <div className="values-footer">
//           <p>{displayContent.footer.text}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WhatWeStandFor;





// src/components/admin/WhatWeStandForAdmin.js
import React, { useState, useEffect } from 'react';
import { ref as dbRef, onValue, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config'; // Adjust the path as needed
import { 
  FaSave, 
  FaPlus, 
  FaTrash, 
  FaImage, 
  FaSpinner, 
  FaEye, 
  FaEdit,
  FaUpload,
  FaCloudUploadAlt 
} from 'react-icons/fa';
import '../../styles/components/admin/WhatWeStandForAdmin.css'; // Adjust the path as needed

const WhatWeStandForAdmin = () => {
  const [content, setContent] = useState({
    intro: {
      title: '',
      tagline: ''
    },
    coreValues: {
      title: '',
      values: []
    },
    commitment: {
      title: '',
      commitments: []
    },
    community: {
      title: '',
      points: [],
      note: ''
    },
    contact: {
      title: '',
      description: '',
      email: ''
    },
    footer: {
      text: ''
    },
    images: {
      supportImage: '',
      qualityImage: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({
    supportImage: false,
    qualityImage: false
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewMode, setPreviewMode] = useState(false);

  // Load existing content
  useEffect(() => {
    const contentRef = dbRef(db, 'pages/whatWeStandFor');
    const unsubscribe = onValue(contentRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setContent(prevContent => ({
          ...prevContent,
          ...data
        }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show message helper
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Handle input changes
  const handleInputChange = (section, field, value, index = null, subField = null) => {
    setContent(prevContent => {
      const newContent = { ...prevContent };
      
      if (index !== null) {
        // Handling array items
        if (subField) {
          newContent[section][field][index][subField] = value;
        } else {
          newContent[section][field][index] = value;
        }
      } else {
        // Handling direct properties
        newContent[section][field] = value;
      }
      
      return newContent;
    });
  };

  // Add new item to array
  const addArrayItem = (section, field, template) => {
    setContent(prevContent => ({
      ...prevContent,
      [section]: {
        ...prevContent[section],
        [field]: [...prevContent[section][field], template]
      }
    }));
  };

  // Remove item from array
  const removeArrayItem = (section, field, index) => {
    setContent(prevContent => ({
      ...prevContent,
      [section]: {
        ...prevContent[section],
        [field]: prevContent[section][field].filter((_, i) => i !== index)
      }
    }));
  };

  // Handle image upload
  const handleImageUpload = async (imageType, file) => {
    if (!file) return;

    try {
      setUploadingImages(prev => ({ ...prev, [imageType]: true }));
      
      // Create a reference to the image
      const imageRef = storageRef(storage, `whatWeStandFor/${imageType}_${Date.now()}`);
      
      // Upload the image
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update content with new image URL
      setContent(prevContent => ({
        ...prevContent,
        images: {
          ...prevContent.images,
          [imageType]: downloadURL
        }
      }));
      
      showMessage('success', `${imageType} uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', `Failed to upload ${imageType}: ${error.message}`);
    } finally {
      setUploadingImages(prev => ({ ...prev, [imageType]: false }));
    }
  };

  // Save content to Firebase
  const saveContent = async () => {
    try {
      setSaving(true);
      await set(dbRef(db, 'pages/whatWeStandFor'), content);
      showMessage('success', 'Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      showMessage('error', 'Failed to save content: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-section">
          <FaSpinner className="spinner-icon spinning" />
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>What We Stand For - Admin Panel</h1>
        <div className="admin-actions">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className="preview-btn"
          >
            <FaEye /> {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button 
            onClick={saveContent} 
            disabled={saving}
            className="save-btn"
          >
            {saving ? <FaSpinner className="spinning" /> : <FaSave />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-content">
        {/* Introduction Section */}
        <div className="admin-section">
          <h2><FaEdit /> Introduction</h2>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={content.intro.title}
              onChange={(e) => handleInputChange('intro', 'title', e.target.value)}
              placeholder="Main title"
            />
          </div>
          <div className="form-group">
            <label>Tagline:</label>
            <textarea
              value={content.intro.tagline}
              onChange={(e) => handleInputChange('intro', 'tagline', e.target.value)}
              placeholder="Tagline description"
              rows="3"
            />
          </div>
        </div>

        {/* Core Values Section */}
        <div className="admin-section">
          <h2><FaEdit /> Core Values</h2>
          <div className="form-group">
            <label>Section Title:</label>
            <input
              type="text"
              value={content.coreValues.title}
              onChange={(e) => handleInputChange('coreValues', 'title', e.target.value)}
              placeholder="Core Values section title"
            />
          </div>
          
          <div className="array-section">
            <div className="array-header">
              <h3>Values</h3>
              <button
                onClick={() => addArrayItem('coreValues', 'values', {
                  id: `value-${Date.now()}`,
                  title: '',
                  description: ''
                })}
                className="add-btn"
              >
                <FaPlus /> Add Value
              </button>
            </div>
            
            {content.coreValues.values.map((value, index) => (
              <div key={value.id || index} className="array-item">
                <div className="form-group">
                  <label>ID:</label>
                  <input
                    type="text"
                    value={value.id}
                    onChange={(e) => handleInputChange('coreValues', 'values', e.target.value, index, 'id')}
                    placeholder="Unique ID"
                  />
                </div>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => handleInputChange('coreValues', 'values', e.target.value, index, 'title')}
                    placeholder="Value title"
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={value.description}
                    onChange={(e) => handleInputChange('coreValues', 'values', e.target.value, index, 'description')}
                    placeholder="Value description"
                    rows="3"
                  />
                </div>
                <button
                  onClick={() => removeArrayItem('coreValues', 'values', index)}
                  className="remove-btn"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images Management Section - With fixed styling */}
        <div className="admin-section image-management-section" style={{ display: 'block', margin: '24px 0' }}>
          <h2 style={{ color: 'white', borderBottom: '2px solid rgba(255, 255, 255, 0.3)', paddingBottom: '12px' }}>
            <FaCloudUploadAlt /> Image Management
          </h2>
          <p className="section-description">Upload and manage images that appear on the "What We Stand For" page</p>
          
          <div className="images-grid">
            {/* Support Image */}
            <div className="image-upload-card">
              <div className="image-card-header">
                <h3><FaImage /> Support Image</h3>
                <span className="image-status">
                  {content.images?.supportImage ? '✅ Uploaded' : '📷 No Image'}
                </span>
              </div>
              
              <div className="image-preview-container">
                {content.images?.supportImage ? (
                  <div className="image-preview">
                    <img 
                      src={content.images.supportImage} 
                      alt="Support" 
                      className="preview-image"
                    />
                    <div className="image-overlay">
                      <span>Click to replace</span>
                    </div>
                  </div>
                ) : (
                  <div className="no-image-placeholder">
                    <FaImage size={48} />
                    <p>No support image uploaded</p>
                  </div>
                )}
              </div>
              
              <div className="upload-controls">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('supportImage', e.target.files[0])}
                  id="supportImageUpload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="supportImageUpload" className="upload-btn primary" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '16px'
                }}>
                  {uploadingImages.supportImage ? (
                    <>
                      <FaSpinner className="spinning" /> Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload /> {content.images?.supportImage ? 'Replace Image' : 'Upload Image'}
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Quality Image */}
            <div className="image-upload-card">
              <div className="image-card-header">
                <h3><FaImage /> Quality Image</h3>
                <span className="image-status">
                  {content.images?.qualityImage ? '✅ Uploaded' : '📷 No Image'}
                </span>
              </div>
              
              <div className="image-preview-container">
                {content.images?.qualityImage ? (
                  <div className="image-preview">
                    <img 
                      src={content.images.qualityImage} 
                      alt="Quality" 
                      className="preview-image"
                    />
                    <div className="image-overlay">
                      <span>Click to replace</span>
                    </div>
                  </div>
                ) : (
                  <div className="no-image-placeholder">
                    <FaImage size={48} />
                    <p>No quality image uploaded</p>
                  </div>
                )}
              </div>
              
              <div className="upload-controls">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('qualityImage', e.target.files[0])}
                  id="qualityImageUpload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="qualityImageUpload" className="upload-btn primary" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '16px'
                }}>
                  {uploadingImages.qualityImage ? (
                    <>
                      <FaSpinner className="spinning" /> Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload /> {content.images?.qualityImage ? 'Replace Image' : 'Upload Image'}
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="image-tips">
            <h4>📋 Image Guidelines:</h4>
            <ul>
              <li>Recommended size: 800x600px or larger</li>
              <li>Supported formats: JPG, PNG, WebP</li>
              <li>Maximum file size: 5MB</li>
              <li>Images will be displayed responsively</li>
            </ul>
          </div>
        </div>

        {/* Commitment Section */}
        <div className="admin-section">
          <h2><FaEdit /> Our Commitment</h2>
          <div className="form-group">
            <label>Section Title:</label>
            <input
              type="text"
              value={content.commitment.title}
              onChange={(e) => handleInputChange('commitment', 'title', e.target.value)}
              placeholder="Commitment section title"
            />
          </div>
          
          <div className="array-section">
            <div className="array-header">
              <h3>Commitments</h3>
              <button
                onClick={() => addArrayItem('commitment', 'commitments', {
                  id: `commitment-${Date.now()}`,
                  title: '',
                  description: ''
                })}
                className="add-btn"
              >
                <FaPlus /> Add Commitment
              </button>
            </div>
            
            {content.commitment.commitments.map((commitment, index) => (
              <div key={commitment.id || index} className="array-item">
                <div className="form-group">
                  <label>ID:</label>
                  <input
                    type="text"
                    value={commitment.id}
                    onChange={(e) => handleInputChange('commitment', 'commitments', e.target.value, index, 'id')}
                    placeholder="Unique ID"
                  />
                </div>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={commitment.title}
                    onChange={(e) => handleInputChange('commitment', 'commitments', e.target.value, index, 'title')}
                    placeholder="Commitment title"
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={commitment.description}
                    onChange={(e) => handleInputChange('commitment', 'commitments', e.target.value, index, 'description')}
                    placeholder="Commitment description"
                    rows="3"
                  />
                </div>
                <button
                  onClick={() => removeArrayItem('commitment', 'commitments', index)}
                  className="remove-btn"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="admin-section">
          <h2><FaEdit /> Community</h2>
          <div className="form-group">
            <label>Section Title:</label>
            <input
              type="text"
              value={content.community.title}
              onChange={(e) => handleInputChange('community', 'title', e.target.value)}
              placeholder="Community section title"
            />
          </div>
          
          <div className="array-section">
            <div className="array-header">
              <h3>Community Points</h3>
              <button
                onClick={() => addArrayItem('community', 'points', '')}
                className="add-btn"
              >
                <FaPlus /> Add Point
              </button>
            </div>
            
            {content.community.points.map((point, index) => (
              <div key={index} className="array-item">
                <div className="form-group">
                  <label>Point:</label>
                  <textarea
                    value={point}
                    onChange={(e) => handleInputChange('community', 'points', e.target.value, index)}
                    placeholder="Community point"
                    rows="2"
                  />
                </div>
                <button
                  onClick={() => removeArrayItem('community', 'points', index)}
                  className="remove-btn"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Community Note:</label>
            <textarea
              value={content.community.note}
              onChange={(e) => handleInputChange('community', 'note', e.target.value)}
              placeholder="Community note"
              rows="4"
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="admin-section">
          <h2><FaEdit /> Contact</h2>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={content.contact.title}
              onChange={(e) => handleInputChange('contact', 'title', e.target.value)}
              placeholder="Contact title"
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              value={content.contact.description}
              onChange={(e) => handleInputChange('contact', 'description', e.target.value)}
              placeholder="Contact description"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={content.contact.email}
              onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
              placeholder="Contact email"
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="admin-section">
          <h2><FaEdit /> Footer</h2>
          <div className="form-group">
            <label>Footer:</label>
            <textarea
              value={content.footer.text}
              onChange={(e) => handleInputChange('footer', 'text', e.target.value)}
              placeholder="Footer text"
              rows="2"
            />
          </div>
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="admin-footer">
        <button 
          onClick={saveContent} 
          disabled={saving}
          className="save-btn large"
        >
          {saving ? <FaSpinner className="spinning" /> : <FaSave />}
          {saving ? 'Saving Changes...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default WhatWeStandForAdmin;