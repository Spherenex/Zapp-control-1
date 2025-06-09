




// // src/pages/ManageFooter.js
// import React, { useState, useEffect } from 'react';
// import { 
//   ref as dbRef, 
//   onValue, 
//   update, 
//   set 
// } from 'firebase/database';
// import { db } from '../firebase/config';
// import { 
//   FaPlus, 
//   FaTrash, 
//   FaSpinner,
//   FaSave, 
//   FaEdit,
//   FaTimes
// } from 'react-icons/fa';

// // Import admin components
// import WhatWeStandForAdmin from '../components/admin/WhatWeStandForAdmin';
// import BlogAdmin from '../components/admin/BlogAdmin';
// import SupportAdmin from '../components/admin/SupportAdmin';
// import NewsroomAdmin from '../components/admin/NewsroomAdmin';
// import ContactAdmin from '../components/admin/ContactAdmin';
// import UsefulLinksAdmin from '../components/admin/UsefulLinksAdmin';
// import SocialLinksAdmin from '../components/admin/SocialLinksAdmin';

// import '../styles/pages/ManageFooter.css';

// const ManageFooter = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [sections, setSections] = useState({
//     company: [
//       { id: 1, title: 'Why Zappcart?', enabled: true, contentType: 'whyZappcart' },
//       { id: 2, title: 'What we stand for', enabled: true, contentType: 'whatWeStandFor' },
//       { id: 3, title: 'BLOG', enabled: true, contentType: 'blog' }
//     ],
//     usefulLinks: [
//       { id: 4, title: 'Support', enabled: true, contentType: 'support' },
//       { id: 5, title: 'Newsroom', enabled: true, contentType: 'newsroom' },
//       { id: 6, title: 'Contact', enabled: true, contentType: 'contact' }
//     ],
//     socialLinks: [
//       { id: 7, title: 'Twitter', enabled: true, contentType: 'social', url: 'https://x.com/zappcart' },
//       { id: 8, title: 'LinkedIn', enabled: true, contentType: 'social', url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/' },
//       { id: 9, title: 'Instagram', enabled: true, contentType: 'social', url: 'https://www.instagram.com/_zappcart/' }
//     ]
//   });

//   // Editor States
//   const [activeEditor, setActiveEditor] = useState(null);
//   const [isSavingContent, setIsSavingContent] = useState(false);
  
//   // Content Data for different sections
//   const [contentData, setContentData] = useState({
//     whyZappcart: {},
//     whatWeStandFor: {},
//     blog: {},
//     support: {},
//     newsroom: {},
//     contact: {}
//   });

//   useEffect(() => {
//     // Load all content from Firebase
//     loadAllContent();
    
//     // Load footer sections structure
//     loadFooterSections();
    
//     // Simulate loading completion after all data is loaded
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
//   }, []);

//   // Load footer sections structure
//   const loadFooterSections = () => {
//     const footerRef = dbRef(db, 'footerSections');
//     onValue(footerRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         setSections(data);
//       }
//     }, (error) => {
//       console.error('Error loading footer sections:', error);
//     });
//   };

//   // Load all content types
//   const loadAllContent = () => {
//     const contentTypes = ['whyZappcart', 'whatWeStandFor', 'blog', 'support', 'newsroom', 'contact'];
    
//     contentTypes.forEach(contentType => {
//       const contentRef = dbRef(db, `pages/${contentType}`);
//       onValue(contentRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const data = snapshot.val();
          
//           setContentData(prev => ({
//             ...prev,
//             [contentType]: data
//           }));
//         }
//       }, (error) => {
//         console.error(`Error loading ${contentType} content:`, error);
//       });
//     });
//   };

//   const handleDeleteItem = (sectionKey, itemId) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       setSections(prevSections => {
//         const updatedSection = prevSections[sectionKey].filter(item => item.id !== itemId);
        
//         return {
//           ...prevSections,
//           [sectionKey]: updatedSection
//         };
//       });
//     }
//   };

//   const handleEditItem = (sectionKey, itemId) => {
//     const item = sections[sectionKey].find(i => i.id === itemId);
//     if (!item) return;

//     const contentType = item.contentType;
    
//     // Set active editor
//     setActiveEditor({ sectionKey, itemId, contentType, item });
//     clearMessages();
//   };

//   const handleCloseEditor = () => {
//     setActiveEditor(null);
//     clearMessages();
//   };

//   const clearMessages = () => {
//     setError('');
//     setSuccessMessage('');
//   };

//   // Add new item to a section
//   const handleAddItem = (sectionKey) => {
//     const newId = sections[sectionKey].length > 0 
//       ? Math.max(...sections[sectionKey].map(item => item.id)) + 1 
//       : 1;
    
//     let newItem = {};
    
//     // Set default values based on section
//     switch(sectionKey) {
//       case 'company':
//         newItem = { id: newId, title: 'New Company Link', enabled: true, contentType: 'generic' };
//         break;
//       case 'usefulLinks':
//         newItem = { id: newId, title: 'New Useful Link', enabled: true, contentType: 'generic' };
//         break;
//       case 'socialLinks':
//         newItem = { id: newId, title: 'New Social Link', enabled: true, contentType: 'social', url: '' };
//         break;
//     }
    
//     // Add new item to section
//     setSections(prevSections => ({
//       ...prevSections,
//       [sectionKey]: [
//         ...prevSections[sectionKey],
//         newItem
//       ]
//     }));
    
//     // Open editor for the new item
//     handleEditItem(sectionKey, newId);
//   };

//   // Save content for a specific content type
//   const handleSaveContent = async (contentType, updatedContent) => {
//     setIsSavingContent(true);
//     clearMessages();

//     try {
//       // Check if contentType is valid
//       if (!contentType || contentType === 'generic') {
//         // For generic links, just update the item in the section
//         if (activeEditor) {
//           const { sectionKey, itemId } = activeEditor;
          
//           setSections(prevSections => {
//             const updatedSection = prevSections[sectionKey].map(item => 
//               item.id === itemId ? { ...item, ...updatedContent } : item
//             );
            
//             return {
//               ...prevSections,
//               [sectionKey]: updatedSection
//             };
//           });
//         }
//       } else if (contentType === 'social') {
//         // For social links, update the item in the section
//         if (activeEditor) {
//           const { sectionKey, itemId } = activeEditor;
          
//           setSections(prevSections => {
//             const updatedSection = prevSections[sectionKey].map(item => 
//               item.id === itemId ? { ...item, ...updatedContent } : item
//             );
            
//             return {
//               ...prevSections,
//               [sectionKey]: updatedSection
//             };
//           });
//         }
//       } else {
//         // For content pages, save to Firebase
//         const contentRef = dbRef(db, `pages/${contentType}`);
//         await set(contentRef, updatedContent);
        
//         // Update local state
//         setContentData(prev => ({
//           ...prev,
//           [contentType]: updatedContent
//         }));
//       }
      
//       setSuccessMessage(`Content saved successfully!`);
      
//       setTimeout(() => {
//         setActiveEditor(null);
//         clearMessages();
//       }, 1500);
//     } catch (error) {
//       console.error('Error saving content:', error);
//       setError(`Failed to save content: ${error.message}`);
//     } finally {
//       setIsSavingContent(false);
//     }
//   };

//   // Save all footer settings (sections structure)
//   const saveAllFooterSettings = async () => {
//     setIsSavingContent(true);
//     clearMessages();
    
//     try {
//       // Save footer sections structure
//       const footerRef = dbRef(db, 'footerSections');
//       await set(footerRef, sections);
      
//       setSuccessMessage('Footer settings saved successfully!');
//       setTimeout(() => clearMessages(), 3000);
//     } catch (error) {
//       console.error('Error saving footer settings:', error);
//       setError(`Failed to save footer settings: ${error.message}`);
//     } finally {
//       setIsSavingContent(false);
//     }
//   };

//   const renderSectionItems = (sectionKey, items) => {
//     return items.map(item => (
//       <div key={item.id} className="footer-item">
//         <span className="item-title">
//           {item.title}
//           {!item.enabled && <span className="item-disabled">(Disabled)</span>}
//         </span>
//         <div className="item-actions">
//           <button 
//             className="delete-btn"
//             onClick={() => handleDeleteItem(sectionKey, item.id)}
//           >
//             <FaTrash /> Delete
//           </button>
//           <button 
//             className="edit-btn"
//             onClick={() => handleEditItem(sectionKey, item.id)}
//           >
//             <FaEdit /> Edit
//           </button>
//         </div>
//       </div>
//     ));
//   };

//   // Render the appropriate editor based on content type
//   const renderEditor = () => {
//     if (!activeEditor) return null;
    
//     const { contentType, item } = activeEditor;
//     let editorComponent = null;
//     let title = "";
    
//     switch(contentType) {
//       case 'whatWeStandFor':
//         editorComponent = (
//           <WhatWeStandForAdmin 
//             initialContent={contentData.whatWeStandFor} 
//             onSave={(content) => handleSaveContent('whatWeStandFor', content)}
//             onCancel={handleCloseEditor}
//             isSaving={isSavingContent}
//           />
//         );
//         title = "What We Stand For Content";
//         break;
//       case 'whyZappcart':
//         editorComponent = (
//           <WhatWeStandForAdmin 
//             initialContent={contentData.whyZappcart}
//             onSave={(content) => handleSaveContent('whyZappcart', content)}
//             onCancel={handleCloseEditor}
//             isSaving={isSavingContent}
//           />
//         );
//         title = "Why ZappCart Content";
//         break;
//       case 'blog':
//         editorComponent = (
//           <BlogAdmin 
//             initialContent={contentData.blog}
//             onSave={(content) => handleSaveContent('blog', content)}
//             onCancel={handleCloseEditor}
//             isSaving={isSavingContent}
//           />
//         );
//         title = "Blog Content";
//         break;
//       case 'support':
//         editorComponent = (
//           <SupportAdmin 
//             initialContent={contentData.support}
//             onSave={(content) => handleSaveContent('support', content)}
//             onCancel={handleCloseEditor}
//             isSaving={isSavingContent}
//           />
//         );
//         title = "Support Content";
//         break;
//       case 'newsroom':
//         editorComponent = (
//           <NewsroomAdmin 
//             initialContent={contentData.newsroom}
//             onSave={(content) => handleSaveContent('newsroom', content)}
//             onCancel={handleCloseEditor}
//             isSaving={isSavingContent}
//           />
//         );
//         title = "Newsroom Content";
//         break;
//       case 'contact':
//         editorComponent = (
//           <ContactAdmin 
//             initialContent={contentData.contact}
//             onSave={(content) => handleSaveContent('contact', content)}
//             onCancel={handleCloseEditor}
//             isSaving={isSavingContent}
//           />
//         );
//         title = "Contact Content";
//         break;
//       case 'social':
//         editorComponent = (
//           <SocialLinksAdmin 
//             initialLink={item}
//             onSave={(content) => handleSaveContent('social', content)}
//             onCancel={handleCloseEditor}
//             isSaving={isSavingContent}
//           />
//         );
//         title = "Social Link Settings";
//         break;
//       default:
//         editorComponent = (
//           <UsefulLinksAdmin 
//             initialLink={item}
//             onSave={(content) => handleSaveContent('generic', content)}
//             onCancel={handleCloseEditor}
//             isSaving={isSavingContent}
//           />
//         );
//         title = "Footer Link Settings";
//     }
    
//     return (
//       <div className="editor-overlay">
//         <div className="editor-container">
//           <div className="editor-header">
//             <h2>{title}</h2>
//             <button className="close-editor-btn" onClick={handleCloseEditor}>
//               <FaTimes />
//             </button>
//           </div>
//           {editorComponent}
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="manage-footer-container">
//         <h1>Footer Management</h1>
//         <div className="loading-indicator">
//           <FaSpinner className="spinning" />
//           <p>Loading footer data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="manage-footer-container">
//       <h1>Footer Management</h1>
      
//       {(error || successMessage) && (
//         <div className="message-container">
//           {error && <div className="error-message">{error}</div>}
//           {successMessage && <div className="success-message">{successMessage}</div>}
//         </div>
//       )}
      
//       <div className="footer-editor">
//         <div className="footer-section">
//           <h3>Company</h3>
//           {renderSectionItems('company', sections.company)}
//           {/* <button 
//             className="add-item-btn footer-add-btn"
//             onClick={() => handleAddItem('company')}
//           >
//             <FaPlus /> Add Company Link
//           </button> */}
//         </div>
        
//         <div className="footer-section">
//           <h3>Useful Links</h3>
//           {renderSectionItems('usefulLinks', sections.usefulLinks)}
//           {/* <button 
//             className="add-item-btn footer-add-btn"
//             onClick={() => handleAddItem('usefulLinks')}
//           >
//             <FaPlus /> Add Useful Link
//           </button> */}
//         </div>
        
//         <div className="footer-section">
//           <h3>Keep in Touch</h3>
//           {renderSectionItems('socialLinks', sections.socialLinks)}
//           {/* <button 
//             className="add-item-btn footer-add-btn"
//             onClick={() => handleAddItem('socialLinks')}
//           >
//             <FaPlus /> Add Social Link
//           </button> */}
//         </div>
        
//         <div className="action-buttons">
//           <button 
//             className="save-btn" 
//             onClick={saveAllFooterSettings}
//             disabled={isSavingContent}
//           >
//             {isSavingContent ? (
//               <>
//                 <FaSpinner className="spinning" /> Saving...
//               </>
//             ) : (
//               <>
//                 <FaSave /> Save Footer Settings
//               </>
//             )}
//           </button>
//         </div>
//       </div>
      
//       {/* Render the active editor */}
//       {renderEditor()}
//     </div>
//   );
// };

// export default ManageFooter;





// src/pages/ManageFooter.js
import React, { useState, useEffect } from 'react';
import { 
  ref as dbRef, 
  onValue, 
  update, 
  set 
} from 'firebase/database';
import { db } from '../firebase/config';
import { 
  FaPlus, 
  FaTrash, 
  FaSpinner,
  FaSave, 
  FaEdit,
  FaTimes
} from 'react-icons/fa';

// Import admin components
import WhatWeStandForAdmin from '../components/admin/WhatWeStandForAdmin';
import BlogAdmin from '../components/admin/BlogAdmin';
import SupportAdmin from '../components/admin/SupportAdmin';
import NewsroomAdmin from '../components/admin/NewsroomAdmin';
import ContactAdmin from '../components/admin/ContactAdmin';
import UsefulLinksAdmin from '../components/admin/UsefulLinksAdmin';
import SocialLinksAdmin from '../components/admin/SocialLinksAdmin';

import '../styles/pages/ManageFooter.css';

const ManageFooter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [sections, setSections] = useState({
    company: [
      { id: 1, title: 'Why Zappcart?', enabled: true, contentType: 'whyZappcart' },
      { id: 2, title: 'What we stand for', enabled: true, contentType: 'whatWeStandFor' },
      { id: 3, title: 'BLOG', enabled: true, contentType: 'blog' }
    ],
    usefulLinks: [
      { id: 4, title: 'Support', enabled: true, contentType: 'support' },
      { id: 5, title: 'Newsroom', enabled: true, contentType: 'newsroom' },
      { id: 6, title: 'Contact', enabled: true, contentType: 'contact' }
    ],
    socialLinks: [
      { id: 7, title: 'Twitter', enabled: true, contentType: 'social', url: 'https://x.com/zappcart' },
      { id: 8, title: 'LinkedIn', enabled: true, contentType: 'social', url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/' },
      { id: 9, title: 'Instagram', enabled: true, contentType: 'social', url: 'https://www.instagram.com/_zappcart/' }
    ]
  });

  // Editor States
  const [activeEditor, setActiveEditor] = useState(null);
  const [isSavingContent, setIsSavingContent] = useState(false);
  
  // Content Data for different sections
  const [contentData, setContentData] = useState({
    whyZappcart: {},
    whatWeStandFor: {},
    blog: {},
    support: {},
    newsroom: {},
    contact: {}
  });

  useEffect(() => {
    // Load all content from Firebase
    loadAllContent();
    
    // Load footer sections structure
    loadFooterSections();
    
    // Simulate loading completion after all data is loaded
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Load footer sections structure
  const loadFooterSections = () => {
    const footerRef = dbRef(db, 'footerSections');
    onValue(footerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSections(data);
      }
    }, (error) => {
      console.error('Error loading footer sections:', error);
    });
  };

  // Load all content types
  const loadAllContent = () => {
    const contentTypes = ['whyZappcart', 'whatWeStandFor', 'blog', 'support', 'newsroom', 'contact'];
    
    contentTypes.forEach(contentType => {
      const contentRef = dbRef(db, `pages/${contentType}`);
      onValue(contentRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          
          setContentData(prev => ({
            ...prev,
            [contentType]: data
          }));
        }
      }, (error) => {
        console.error(`Error loading ${contentType} content:`, error);
      });
    });
  };

  const handleDeleteItem = (sectionKey, itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setSections(prevSections => {
        const updatedSection = prevSections[sectionKey].filter(item => item.id !== itemId);
        
        return {
          ...prevSections,
          [sectionKey]: updatedSection
        };
      });
    }
  };

  const handleEditItem = (sectionKey, itemId) => {
    const item = sections[sectionKey].find(i => i.id === itemId);
    if (!item) return;

    const contentType = item.contentType;
    
    // Set active editor
    setActiveEditor({ sectionKey, itemId, contentType, item });
    clearMessages();
  };

  const handleCloseEditor = () => {
    setActiveEditor(null);
    clearMessages();
  };

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  // Add new item to a section
  const handleAddItem = (sectionKey) => {
    const newId = sections[sectionKey].length > 0 
      ? Math.max(...sections[sectionKey].map(item => item.id)) + 1 
      : 1;
    
    let newItem = {};
    
    // Set default values based on section
    switch(sectionKey) {
      case 'company':
        newItem = { id: newId, title: 'New Company Link', enabled: true, contentType: 'generic' };
        break;
      case 'usefulLinks':
        newItem = { id: newId, title: 'New Useful Link', enabled: true, contentType: 'generic' };
        break;
      case 'socialLinks':
        newItem = { id: newId, title: 'New Social Link', enabled: true, contentType: 'social', url: '' };
        break;
    }
    
    // Add new item to section
    setSections(prevSections => ({
      ...prevSections,
      [sectionKey]: [
        ...prevSections[sectionKey],
        newItem
      ]
    }));
    
    // Open editor for the new item
    handleEditItem(sectionKey, newId);
  };

  // Save content for a specific content type
  const handleSaveContent = async (contentType, updatedContent) => {
    setIsSavingContent(true);
    clearMessages();

    try {
      // Check if contentType is valid
      if (!contentType || contentType === 'generic') {
        // For generic links, just update the item in the section
        if (activeEditor) {
          const { sectionKey, itemId } = activeEditor;
          
          setSections(prevSections => {
            const updatedSection = prevSections[sectionKey].map(item => 
              item.id === itemId ? { ...item, ...updatedContent } : item
            );
            
            return {
              ...prevSections,
              [sectionKey]: updatedSection
            };
          });
        }
      } else if (contentType === 'social') {
        // For social links, update the item in the section
        if (activeEditor) {
          const { sectionKey, itemId } = activeEditor;
          
          setSections(prevSections => {
            const updatedSection = prevSections[sectionKey].map(item => 
              item.id === itemId ? { ...item, ...updatedContent } : item
            );
            
            return {
              ...prevSections,
              [sectionKey]: updatedSection
            };
          });
        }
      } else {
        // For content pages, save to Firebase
        const contentRef = dbRef(db, `pages/${contentType}`);
        await set(contentRef, updatedContent);
        
        // Update local state
        setContentData(prev => ({
          ...prev,
          [contentType]: updatedContent
        }));
      }
      
      setSuccessMessage(`Content saved successfully!`);
      
      setTimeout(() => {
        setActiveEditor(null);
        clearMessages();
      }, 1500);
    } catch (error) {
      console.error('Error saving content:', error);
      setError(`Failed to save content: ${error.message}`);
    } finally {
      setIsSavingContent(false);
    }
  };

  // Save all footer settings (sections structure)
  const saveAllFooterSettings = async () => {
    setIsSavingContent(true);
    clearMessages();
    
    try {
      // Save footer sections structure
      const footerRef = dbRef(db, 'footerSections');
      await set(footerRef, sections);
      
      setSuccessMessage('Footer settings saved successfully!');
      setTimeout(() => clearMessages(), 3000);
    } catch (error) {
      console.error('Error saving footer settings:', error);
      setError(`Failed to save footer settings: ${error.message}`);
    } finally {
      setIsSavingContent(false);
    }
  };

  const renderSectionItems = (sectionKey, items) => {
    return items.map(item => (
      <div key={item.id} className="footer-item">
        <span className="item-title">
          {item.title}
          {!item.enabled && <span className="item-disabled">(Disabled)</span>}
        </span>
        <div className="item-actions">
          <button 
            className="delete-btn"
            onClick={() => handleDeleteItem(sectionKey, item.id)}
          >
            <FaTrash /> Delete
          </button>
          <button 
            className="edit-btn"
            onClick={() => handleEditItem(sectionKey, item.id)}
          >
            <FaEdit /> Edit
          </button>
        </div>
      </div>
    ));
  };

  // Render the appropriate editor based on content type
  const renderEditor = () => {
    if (!activeEditor) return null;
    
    const { contentType, item } = activeEditor;
    let editorComponent = null;
    let title = "";
    
    switch(contentType) {
      case 'whatWeStandFor':
        editorComponent = (
          <WhatWeStandForAdmin 
            initialContent={contentData.whatWeStandFor} 
            onSave={(content) => handleSaveContent('whatWeStandFor', content)}
            onCancel={handleCloseEditor}
            isSaving={isSavingContent}
          />
        );
        title = "What We Stand For Content";
        break;
      case 'whyZappcart':
        editorComponent = (
          <WhatWeStandForAdmin 
            initialContent={contentData.whyZappcart}
            onSave={(content) => handleSaveContent('whyZappcart', content)}
            onCancel={handleCloseEditor}
            isSaving={isSavingContent}
          />
        );
        title = "Why ZappCart Content";
        break;
      case 'blog':
        editorComponent = (
          <BlogAdmin 
            initialContent={contentData.blog}
            onSave={(content) => handleSaveContent('blog', content)}
            onCancel={handleCloseEditor}
            isSaving={isSavingContent}
          />
        );
        title = "Blog Content";
        break;
      case 'support':
        editorComponent = (
          <SupportAdmin 
            initialContent={contentData.support}
            onSave={(content) => handleSaveContent('support', content)}
            onCancel={handleCloseEditor}
            isSaving={isSavingContent}
          />
        );
        title = "Support Content";
        break;
      case 'newsroom':
        editorComponent = (
          <NewsroomAdmin 
            initialContent={contentData.newsroom}
            onSave={(content) => handleSaveContent('newsroom', content)}
            onCancel={handleCloseEditor}
            isSaving={isSavingContent}
          />
        );
        title = "Newsroom Content";
        break;
      case 'contact':
        editorComponent = (
          <ContactAdmin 
            initialContent={contentData.contact}
            onSave={(content) => handleSaveContent('contact', content)}
            onCancel={handleCloseEditor}
            isSaving={isSavingContent}
          />
        );
        title = "Contact Content";
        break;
      case 'social':
        editorComponent = (
          <SocialLinksAdmin 
            initialLink={item}
            onSave={(content) => handleSaveContent('social', content)}
            onCancel={handleCloseEditor}
            isSaving={isSavingContent}
          />
        );
        title = "Social Link Settings";
        break;
      default:
        editorComponent = (
          <UsefulLinksAdmin 
            initialLink={item}
            onSave={(content) => handleSaveContent('generic', content)}
            onCancel={handleCloseEditor}
            isSaving={isSavingContent}
          />
        );
        title = "Footer Link Settings";
    }
    
    return (
      <div className="editor-overlay">
        <div className="editor-container">
          <div className="editor-header">
            <h2>{title}</h2>
            <button className="close-editor-btn" onClick={handleCloseEditor}>
              <FaTimes />
            </button>
          </div>
          {editorComponent}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="manage-footer-container">
        <h1>Footer Management</h1>
        <div className="loading-indicator">
          <FaSpinner className="spinning" />
          <p>Loading footer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-footer-container">
      <h1>Footer Management</h1>
      
      {(error || successMessage) && (
        <div className="message-container">
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
      )}
      
      <div className="footer-editor">
        <div className="footer-section">
          <h3>Company</h3>
          {renderSectionItems('company', sections.company)}
          {/* <button 
            className="add-item-btn footer-add-btn"
            onClick={() => handleAddItem('company')}
          >
            <FaPlus /> Add Company Link
          </button> */}
        </div>
        
        <div className="footer-section">
          <h3>Useful Links</h3>
          {renderSectionItems('usefulLinks', sections.usefulLinks)}
          {/* <button 
            className="add-item-btn footer-add-btn"
            onClick={() => handleAddItem('usefulLinks')}
          >
            <FaPlus /> Add Useful Link
          </button> */}
        </div>
        
        <div className="footer-section">
          <h3>Keep in Touch</h3>
          {renderSectionItems('socialLinks', sections.socialLinks)}
          {/* <button 
            className="add-item-btn footer-add-btn"
            onClick={() => handleAddItem('socialLinks')}
          >
            <FaPlus /> Add Social Link
          </button> */}
        </div>
        
        <div className="action-buttons">
          <button 
            className="save-btn" 
            onClick={saveAllFooterSettings}
            disabled={isSavingContent}
          >
            {isSavingContent ? (
              <>
                <FaSpinner className="spinning" /> Saving...
              </>
            ) : (
              <>
                <FaSave /> Save Footer Settings
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Render the active editor */}
      {renderEditor()}
    </div>
  );
};

export default ManageFooter;