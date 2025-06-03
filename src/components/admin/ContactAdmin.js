// // src/components/admin/ContactAdmin.js
// import React, { useState, useEffect } from 'react';
// import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../../firebase/config';
// import { 
//   FaPlus, 
//   FaTrash, 
//   FaImage, 
//   FaSpinner,
//   FaSave,
//   FaLink,
//   FaMapMarkerAlt
// } from 'react-icons/fa';
// import '../../styles/components/admin/ContentEditor.css';

// const ContactAdmin = ({ initialContent, onSave, onCancel, isSaving }) => {
//   const [content, setContent] = useState(initialContent || {
//     hero: {
//       title: 'Contact Us',
//       subtitle: 'We\'d love to hear from you. Get in touch with the ZappCart team.'
//     },
//     contactInfo: {
//       address: {
//         title: 'Our Location',
//         line1: 'Sri kalabhairaveshwara chicken center,',
//         line2: 'Rajeev Gandhi circle, kebbehala sunkadakatte',
//         line3: 'Bangalore - 560091'
//       },
//       phone: {
//         title: 'Phone Contact',
//         customer: '+91 8722237574',
//         hours: '7:00 AM - 10:00 PM, All days'
//       },
//       email: {
//         title: 'Email Us',
//         general: 'official.tazatabutchers@gmail.com',
//         partnership: 'official.tazatabutchers@gmail.com',
//         security: 'official.tazatabutchers@gmail.com'
//       }
//     },
//     socialLinks: [
//       { platform: 'Twitter', url: 'https://x.com/zappcart' },
//       { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/' },
//       { platform: 'Instagram', url: 'https://www.instagram.com/_zappcart/' }
//     ],
//     mapLocation: {
//       lat: '12.9895',
//       lng: '77.5090',
//       embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497.2672663551975!2d77.50879767534478!3d12.989511169948475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU5JzIxLjUiTiA3N8KwMzAnMzIuNSJF!5e0!3m2!1sen!2sin!4v1715705423853!5m2!1sen!2sin'
//     }
//   });
  
//   const [uploadingImages, setUploadingImages] = useState({});
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Update local content if initialContent changes
//   useEffect(() => {
//     if (initialContent) {
//       setContent(initialContent);
//     }
//   }, [initialContent]);

//   // Handle content change
//   const handleContentChange = (path, value) => {
//     const keys = path.split('.');
    
//     setContent(prev => {
//       const updated = { ...prev };
//       let current = updated;
      
//       for (let i = 0; i < keys.length - 1; i++) {
//         if (!current[keys[i]]) current[keys[i]] = {};
//         current = current[keys[i]];
//       }
      
//       current[keys[keys.length - 1]] = value;
//       return updated;
//     });
//   };

//   // Handle array change
//   const handleArrayChange = (path, index, value) => {
//     const keys = path.split('.');
    
//     setContent(prev => {
//       const updated = { ...prev };
//       let current = updated;
      
//       for (let i = 0; i < keys.length - 1; i++) {
//         if (!current[keys[i]]) current[keys[i]] = {};
//         current = current[keys[i]];
//       }
      
//       if (!current[keys[keys.length - 1]]) current[keys[keys.length - 1]] = [];
//       current[keys[keys.length - 1]][index] = value;
//       return updated;
//     });
//   };

//   // Add item to array
//   const addArrayItem = (path, newItem) => {
//     const keys = path.split('.');
    
//     setContent(prev => {
//       const updated = { ...prev };
//       let current = updated;
      
//       for (let i = 0; i < keys.length - 1; i++) {
//         if (!current[keys[i]]) current[keys[i]] = {};
//         current = current[keys[i]];
//       }
      
//       if (!current[keys[keys.length - 1]]) current[keys[keys.length - 1]] = [];
//       current[keys[keys.length - 1]].push(newItem);
//       return updated;
//     });
//   };

//   // Remove item from array
//   const removeArrayItem = (path, index) => {
//     const keys = path.split('.');
    
//     setContent(prev => {
//       const updated = { ...prev };
//       let current = updated;
      
//       for (let i = 0; i < keys.length - 1; i++) {
//         if (!current[keys[i]]) return prev; // Path doesn't exist
//         current = current[keys[i]];
//       }
      
//       if (!current[keys[keys.length - 1]] || !Array.isArray(current[keys[keys.length - 1]])) {
//         return prev; // Not an array
//       }
      
//       current[keys[keys.length - 1]].splice(index, 1);
//       return updated;
//     });
//   };

//   // Handle image upload
//   const handleImageUpload = async (path, file) => {
//     if (!file) return;
    
//     const imageName = `contact/${path.replace(/\./g, '-')}-${Date.now()}`;
    
//     try {
//       // Set uploading state
//       setUploadingImages(prev => ({
//         ...prev,
//         [path]: true
//       }));
      
//       // Create a reference to the image
//       const imageRef = storageRef(storage, imageName);
      
//       // Upload the image
//       const snapshot = await uploadBytes(imageRef, file);
//       const downloadURL = await getDownloadURL(snapshot.ref);
      
//       // Update content with the image URL
//       handleContentChange(path, downloadURL);
      
//       setSuccessMessage('Image uploaded successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (err) {
//       console.error('Error uploading image:', err);
//       setError(`Failed to upload image: ${err.message}`);
//       setTimeout(() => setError(''), 3000);
//     } finally {
//       setUploadingImages(prev => ({
//         ...prev,
//         [path]: false
//       }));
//     }
//   };

//   // Add new social link
//   const addSocialLink = () => {
//     addArrayItem('socialLinks', {
//       platform: 'New Platform',
//       url: ''
//     });
//   };

//   // Handle save
//   const handleSave = () => {
//     onSave(content);
//   };

//   return (
//     <div className="content-editor-body">
//       {(error || successMessage) && (
//         <div className="message-container">
//           {error && <div className="error-message">{error}</div>}
//           {successMessage && <div className="success-message">{successMessage}</div>}
//         </div>
//       )}

//       {/* Hero Section */}
//       <div className="editor-section">
//         <h3>Contact Hero</h3>
//         <div className="form-group">
//           <label>Title:</label>
//           <input
//             type="text"
//             value={content.hero?.title || ''}
//             onChange={(e) => handleContentChange('hero.title', e.target.value)}
//             placeholder="Contact page title"
//             disabled={isSaving}
//           />
//         </div>
//         <div className="form-group">
//           <label>Subtitle:</label>
//           <textarea
//             value={content.hero?.subtitle || ''}
//             onChange={(e) => handleContentChange('hero.subtitle', e.target.value)}
//             placeholder="Contact page subtitle"
//             rows={2}
//             disabled={isSaving}
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Hero Image:</label>
//           <div className="image-upload-container">
//             {content.hero?.imageUrl && (
//               <div className="image-preview">
//                 <img src={content.hero.imageUrl} alt="Contact hero" />
//               </div>
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleImageUpload('hero.imageUrl', e.target.files[0])}
//               disabled={isSaving || uploadingImages['hero.imageUrl']}
//               id="contactHeroImageUpload"
//               style={{ display: 'none' }}
//             />
//             <label htmlFor="contactHeroImageUpload" className="upload-image-btn">
//               {uploadingImages['hero.imageUrl'] ? (
//                 <>
//                   <FaSpinner className="spinning" /> Uploading...
//                 </>
//               ) : (
//                 <>
//                   <FaImage /> {content.hero?.imageUrl ? 'Replace Hero Image' : 'Upload Hero Image'}
//                 </>
//               )}
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Address Section */}
//       <div className="editor-section">
//         <h3>Address Information</h3>
//         <div className="form-group">
//           <label>Address Title:</label>
//           <input
//             type="text"
//             value={content.contactInfo?.address?.title || ''}
//             onChange={(e) => handleContentChange('contactInfo.address.title', e.target.value)}
//             placeholder="Address section title"
//             disabled={isSaving}
//           />
//         </div>
//         <div className="form-group">
//           <label>Address Line 1:</label>
//           <input
//             type="text"
//             value={content.contactInfo?.address?.line1 || ''}
//             onChange={(e) => handleContentChange('contactInfo.address.line1', e.target.value)}
//             placeholder="Address line 1"
//             disabled={isSaving}
//           />
//         </div>
//         <div className="form-group">
//           <label>Address Line 2:</label>
//           <input
//             type="text"
//             value={content.contactInfo?.address?.line2 || ''}
//             onChange={(e) => handleContentChange('contactInfo.address.line2', e.target.value)}
//             placeholder="Address line 2"
//             disabled={isSaving}
//           />
//         </div>
//         <div className="form-group">
//           <label>Address Line 3:</label>
//           <input
//             type="text"
//             value={content.contactInfo?.address?.line3 || ''}
//             onChange={(e) => handleContentChange('contactInfo.address.line3', e.target.value)}
//             placeholder="Address line 3"
//             disabled={isSaving}
//           />
//         </div>
//       </div>

//       {/* Phone Section */}
//       <div className="editor-section">
//         <h3>Phone Information</h3>
//         <div className="form-group">
//           <label>Phone Section Title:</label>
//           <input
//             type="text"
//             value={content.contactInfo?.phone?.title || ''}
//             onChange={(e) => handleContentChange('contactInfo.phone.title', e.target.value)}
//             placeholder="Phone section title"
//             disabled={isSaving}
//           />
//         </div>
//         <div className="form-group">
//           <label>Customer Service Number:</label>
//           <input
//             type="text"
//             value={content.contactInfo?.phone?.customer || ''}
//             onChange={(e) => handleContentChange('contactInfo.phone.customer', e.target.value)}
//             placeholder="Customer service phone number"
//             disabled={isSaving}
//           />
//         </div>
//         <div className="form-group">
//           <label>Business Hours:</label>
//           <input
//             type="text"
//             value={content.contactInfo?.phone?.hours || ''}
//             onChange={(e) => handleContentChange('contactInfo.phone.hours', e.target.value)}
//             placeholder="Business hours"
//             disabled={isSaving}
//           />
//         </div>
//       </div>

//       {/* Email Section */}
//       <div className="editor-section">
//         <h3>Email Information</h3>
//         <div className="form-group">
//           <label>Email Section Title:</label>
//           <input
//             type="text"
//             value={content.contactInfo?.email?.title || ''}
//             onChange={(e) => handleContentChange('contactInfo.email.title', e.target.value)}
//             placeholder="Email section title"
//             disabled={isSaving}
//           />
//         </div>
//         <div className="form-group">
//           <label>General Email:</label>
//           <input
//             type="email"
//             value={content.contactInfo?.email?.general || ''}
//             onChange={(e) => handleContentChange('contactInfo.email.general', e.target.value)}
//             placeholder="General email address"
//             disabled={isSaving}
//           />
//         </div>
//         <div className="form-group">
//           <label>Partnership Email:</label>
//           <input
//             type="email"
//             value={content.contactInfo?.email?.partnership || ''}
//             onChange={(e) => handleContentChange('contactInfo.email.partnership', e.target.value)}
//             placeholder="Partnership email address"
//             disabled={isSaving}
//           />
//         </div>
//         <div className="form-group">
//           <label>Security Email:</label>
//           <input
//             type="email"
//             value={content.contactInfo?.email?.security || ''}
//             onChange={(e) => handleContentChange('contactInfo.email.security', e.target.value)}
//             placeholder="Security email address"
//             disabled={isSaving}
//           />
//         </div>
//       </div>

//       {/* Social Links */}
//       <div className="editor-section">
//         <h3>Social Media Links</h3>
//         {(content.socialLinks || []).map((link, index) => (
//           <div key={index} className="list-item-editor social-link">
//             <div className="form-row">
//               <div className="form-group half">
//                 <label>Platform:</label>
//                 <input
//                   type="text"
//                   value={link.platform || ''}
//                   onChange={(e) => handleArrayChange('socialLinks', index, { 
//                     ...link, 
//                     platform: e.target.value 
//                   })}
//                   placeholder="Social platform"
//                   disabled={isSaving}
//                 />
//               </div>
              
//               <div className="form-group half">
//                 <label>URL:</label>
//                 <div className="url-input">
//                   <FaLink className="url-icon" />
//                   <input
//                     type="url"
//                     value={link.url || ''}
//                     onChange={(e) => handleArrayChange('socialLinks', index, { 
//                       ...link, 
//                       url: e.target.value 
//                     })}
//                     placeholder="https://example.com"
//                     disabled={isSaving}
//                   />
//                 </div>
//               </div>
//             </div>
            
//             <button
//               className="remove-item-btn"
//               onClick={() => removeArrayItem('socialLinks', index)}
//               disabled={isSaving}
//             >
//               <FaTrash /> Remove Link
//             </button>
//           </div>
//         ))}
//         <button
//           className="add-item-btn"
//           onClick={addSocialLink}
//           disabled={isSaving}
//         >
//           <FaPlus /> Add Social Link
//         </button>
//       </div>

//       {/* Map Location */}
//       <div className="editor-section">
//         <h3>Map Location</h3>
//         <div className="form-group">
//           <label>Latitude:</label>
//           <div className="coordinate-input">
//             <FaMapMarkerAlt className="coordinate-icon" />
//             <input
//               type="text"
//               value={content.mapLocation?.lat || ''}
//               onChange={(e) => handleContentChange('mapLocation.lat', e.target.value)}
//               placeholder="e.g., 12.9895"
//               disabled={isSaving}
//             />
//           </div>
//         </div>
//         <div className="form-group">
//           <label>Longitude:</label>
//           <div className="coordinate-input">
//             <FaMapMarkerAlt className="coordinate-icon" />
//             <input
//               type="text"
//               value={content.mapLocation?.lng || ''}
//               onChange={(e) => handleContentChange('mapLocation.lng', e.target.value)}
//               placeholder="e.g., 77.5090"
//               disabled={isSaving}
//             />
//           </div>
//         </div>
//         <div className="form-group">
//           <label>Google Maps Embed URL:</label>
//           <textarea
//             value={content.mapLocation?.embedUrl || ''}
//             onChange={(e) => handleContentChange('mapLocation.embedUrl', e.target.value)}
//             placeholder="Paste Google Maps embed URL here"
//             rows={3}
//             disabled={isSaving}
//           />
//           <div className="hint-text">
//             Get this URL from Google Maps by clicking "Share" > "Embed a map" > Copy HTML
//           </div>
//         </div>
        
//         {content.mapLocation?.embedUrl && (
//           <div className="map-preview">
//             <h4>Map Preview:</h4>
//             <div className="map-container">
//               <iframe
//                 src={content.mapLocation.embedUrl}
//                 width="100%"
//                 height="300"
//                 style={{ border: 0 }}
//                 allowFullScreen=""
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//                 title="Location Map"
//               ></iframe>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="editor-actions">
//         <button 
//           className="save-btn" 
//           onClick={handleSave}
//           disabled={isSaving}
//         >
//           {isSaving ? (
//             <>
//               <FaSpinner className="spinning" /> Saving...
//             </>
//           ) : (
//             <>
//               <FaSave /> Save Changes
//             </>
//           )}
//         </button>
//         <button 
//           className="cancel-btn" 
//           onClick={onCancel}
//           disabled={isSaving}
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ContactAdmin;




// src/components/admin/ContactAdmin.js
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
  FaMapMarkerAlt
} from 'react-icons/fa';
import '../../styles/components/admin/ContentEditor.css';

const ContactAdmin = ({ initialContent, onSave, onCancel, isSaving }) => {
  const [content, setContent] = useState(initialContent || {
    hero: {
      title: 'Contact Us',
      subtitle: 'We\'d love to hear from you. Get in touch with the ZappCart team.'
    },
    contactInfo: {
      address: {
        title: 'Our Location',
        line1: 'Sri kalabhairaveshwara chicken center,',
        line2: 'Rajeev Gandhi circle, kebbehala sunkadakatte',
        line3: 'Bangalore - 560091'
      },
      phone: {
        title: 'Phone Contact',
        customer: '+91 8722237574',
        hours: '7:00 AM - 10:00 PM, All days'
      },
      email: {
        title: 'Email Us',
        general: 'official.tazatabutchers@gmail.com',
        partnership: 'official.tazatabutchers@gmail.com',
        security: 'official.tazatabutchers@gmail.com'
      }
    },
    socialLinks: [
      { platform: 'Twitter', url: 'https://x.com/zappcart' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/' },
      { platform: 'Instagram', url: 'https://www.instagram.com/_zappcart/' }
    ],
    mapLocation: {
      lat: '12.9895',
      lng: '77.5090',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497.2672663551975!2d77.50879767534478!3d12.989511169948475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU5JzIxLjUiTiA3N8KwMzAnMzIuNSJF!5e0!3m2!1sen!2sin!4v1715705423853!5m2!1sen!2sin'
    }
  });
  
  const [uploadingImages, setUploadingImages] = useState({});
  const [deletingImages, setDeletingImages] = useState({});
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
      const fullPath = imageUrl.includes('contact/') 
        ? `contact/${getFilenameFromUrl(imageUrl)}`
        : getFilenameFromUrl(imageUrl);
      
      if (!fullPath) {
        throw new Error("Could not determine file path from URL");
      }
      
      // Create a reference to the image
      const imageRef = storageRef(storage, fullPath);
      
      // Delete the image
      await deleteObject(imageRef);
      
      // Update content with the image URL
      handleContentChange(path, '');
      
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
    
    const imageName = `contact/${path.replace(/\./g, '-')}-${Date.now()}`;
    
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

  // Add new social link
  const addSocialLink = () => {
    addArrayItem('socialLinks', {
      platform: 'New Platform',
      url: ''
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

      {/* Hero Section */}
      <div className="editor-section">
        <h3>Contact Hero</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={content.hero?.title || ''}
            onChange={(e) => handleContentChange('hero.title', e.target.value)}
            placeholder="Contact page title"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Subtitle:</label>
          <textarea
            value={content.hero?.subtitle || ''}
            onChange={(e) => handleContentChange('hero.subtitle', e.target.value)}
            placeholder="Contact page subtitle"
            rows={2}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="editor-section">
        <h3>Address Information</h3>
        <div className="form-group">
          <label>Address Title:</label>
          <input
            type="text"
            value={content.contactInfo?.address?.title || ''}
            onChange={(e) => handleContentChange('contactInfo.address.title', e.target.value)}
            placeholder="Address section title"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Address Line 1:</label>
          <input
            type="text"
            value={content.contactInfo?.address?.line1 || ''}
            onChange={(e) => handleContentChange('contactInfo.address.line1', e.target.value)}
            placeholder="Address line 1"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Address Line 2:</label>
          <input
            type="text"
            value={content.contactInfo?.address?.line2 || ''}
            onChange={(e) => handleContentChange('contactInfo.address.line2', e.target.value)}
            placeholder="Address line 2"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Address Line 3:</label>
          <input
            type="text"
            value={content.contactInfo?.address?.line3 || ''}
            onChange={(e) => handleContentChange('contactInfo.address.line3', e.target.value)}
            placeholder="Address line 3"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Phone Section */}
      <div className="editor-section">
        <h3>Phone Information</h3>
        <div className="form-group">
          <label>Phone Section Title:</label>
          <input
            type="text"
            value={content.contactInfo?.phone?.title || ''}
            onChange={(e) => handleContentChange('contactInfo.phone.title', e.target.value)}
            placeholder="Phone section title"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Customer Service Number:</label>
          <input
            type="text"
            value={content.contactInfo?.phone?.customer || ''}
            onChange={(e) => handleContentChange('contactInfo.phone.customer', e.target.value)}
            placeholder="Customer service phone number"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Business Hours:</label>
          <input
            type="text"
            value={content.contactInfo?.phone?.hours || ''}
            onChange={(e) => handleContentChange('contactInfo.phone.hours', e.target.value)}
            placeholder="Business hours"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Email Section */}
      <div className="editor-section">
        <h3>Email Information</h3>
        <div className="form-group">
          <label>Email Section Title:</label>
          <input
            type="text"
            value={content.contactInfo?.email?.title || ''}
            onChange={(e) => handleContentChange('contactInfo.email.title', e.target.value)}
            placeholder="Email section title"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>General Email:</label>
          <input
            type="email"
            value={content.contactInfo?.email?.general || ''}
            onChange={(e) => handleContentChange('contactInfo.email.general', e.target.value)}
            placeholder="General email address"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Partnership Email:</label>
          <input
            type="email"
            value={content.contactInfo?.email?.partnership || ''}
            onChange={(e) => handleContentChange('contactInfo.email.partnership', e.target.value)}
            placeholder="Partnership email address"
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label>Security Email:</label>
          <input
            type="email"
            value={content.contactInfo?.email?.security || ''}
            onChange={(e) => handleContentChange('contactInfo.email.security', e.target.value)}
            placeholder="Security email address"
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

      {/* Map Location */}
      <div className="editor-section">
        <h3>Map Location</h3>
        <div className="form-group">
          <label>Latitude:</label>
          <div className="coordinate-input">
            <FaMapMarkerAlt className="coordinate-icon" />
            <input
              type="text"
              value={content.mapLocation?.lat || ''}
              onChange={(e) => handleContentChange('mapLocation.lat', e.target.value)}
              placeholder="e.g., 12.9895"
              disabled={isSaving}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Longitude:</label>
          <div className="coordinate-input">
            <FaMapMarkerAlt className="coordinate-icon" />
            <input
              type="text"
              value={content.mapLocation?.lng || ''}
              onChange={(e) => handleContentChange('mapLocation.lng', e.target.value)}
              placeholder="e.g., 77.5090"
              disabled={isSaving}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Google Maps Embed URL:</label>
          <textarea
            value={content.mapLocation?.embedUrl || ''}
            onChange={(e) => handleContentChange('mapLocation.embedUrl', e.target.value)}
            placeholder="Paste Google Maps embed URL here"
            rows={3}
            disabled={isSaving}
          />
          <div className="hint-text">
            Get this URL from Google Maps by clicking "Share" > "Embed a map" > Copy HTML
          </div>
        </div>
        
        {content.mapLocation?.embedUrl && (
          <div className="map-preview">
            <h4>Map Preview:</h4>
            <div className="map-container">
              <iframe
                src={content.mapLocation.embedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              ></iframe>
            </div>
          </div>
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
          background-color: rgba(255, 0, 0, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;  /* Increased size */
          height: 30px;  /* Increased size */
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s;
          font-weight: bold;
          font-size: 18px;  /* Larger font */
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

        .coordinate-input {
          position: relative;
        }
        
        .coordinate-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }
        
        .coordinate-input input {
          padding-left: 35px;
        }
        
        .hint-text {
          font-size: 0.85rem;
          color: #666;
          margin-top: 5px;
          font-style: italic;
        }
        
        .map-preview {
          margin-top: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          background-color: #f9f9f9;
        }
        
        .map-preview h4 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #333;
        }
        
        .map-container {
          border-radius: 5px;
          overflow: hidden;
          border: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
};

export default ContactAdmin;