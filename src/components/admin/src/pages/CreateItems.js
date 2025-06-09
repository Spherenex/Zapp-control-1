





// import React, { useState, useEffect } from 'react';
// import { ref, push, set, get, remove } from 'firebase/database';
// import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../firebase/config';
// import '../styles/pages/CreateItems.css';

// const CreateItems = () => {
//   const defaultCategories = [
//     "Bestsellers",
//     "Shop by categories",
//     "Match Day Essentials",
//     "Premium fish & seafood selection"
//   ];
  
//   const [categories, setCategories] = useState(defaultCategories);
//   const [showNewSectionForm, setShowNewSectionForm] = useState(false);
//   const [newSectionName, setNewSectionName] = useState('');
//   const [isDeletingSection, setIsDeletingSection] = useState(false);
  
//   // Dynamic display categories - will be fetched from Firebase
//   const [displayCategories, setDisplayCategories] = useState([]);
  
//   // Add new display category form state
//   const [showNewDisplayCategoryForm, setShowNewDisplayCategoryForm] = useState(false);
//   const [newDisplayCategoryData, setNewDisplayCategoryData] = useState({
//     name: '',
//     description: '',
//     image: null
//   });
  
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [activeDisplayCategory, setActiveDisplayCategory] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     weight: '',
//     price: '',
//     originalPrice: '',
//     discount: '',
//     deliveryTime: '30',
//     image: null,
//     featured: false,
//     meatCut: 'jc-jatka'
//   });

//   // Store section keys for deletion
//   const [sectionKeys, setSectionKeys] = useState({});

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         // Fetch display categories from Firebase
//         const displayCategoriesRef = ref(db, 'displayCategories');
//         const displaySnapshot = await get(displayCategoriesRef);
        
//         if (displaySnapshot.exists()) {
//           const displayCategoriesData = displaySnapshot.val();
//           const displayCategoriesArray = Object.keys(displayCategoriesData).map(key => ({
//             ...displayCategoriesData[key],
//             firebaseKey: key
//           }));
//           setDisplayCategories(displayCategoriesArray);
//         } else {
//           // Initialize with default display categories if none exist
//           const defaultDisplayCategories = [
//             { id: "chicken", name: "Chicken", description: "Fresh chicken products" },
//             { id: "fish-seafood", name: "Fish & Seafood", description: "Fresh fish and seafood" },
//             { id: "mutton", name: "Mutton", description: "Premium mutton cuts" },
//             { id: "liver-more", name: "Liver & More", description: "Liver and organ meat" },
//             { id: "prawns-crabs", name: "Prawns & Crabs", description: "Fresh prawns and crabs" },
//             { id: "eggs", name: "Eggs", description: "Farm fresh eggs" },
//             { id: "combos", name: "Combos", description: "Value combo packages" }
//           ];
          
//           // Save default categories to Firebase
//           for (const category of defaultDisplayCategories) {
//             const newCategoryRef = push(displayCategoriesRef);
//             await set(newCategoryRef, {
//               ...category,
//               createdAt: Date.now(),
//               isActive: true
//             });
//           }
          
//           // Fetch again after initialization
//           const updatedSnapshot = await get(displayCategoriesRef);
//           if (updatedSnapshot.exists()) {
//             const updatedData = updatedSnapshot.val();
//             const updatedArray = Object.keys(updatedData).map(key => ({
//               ...updatedData[key],
//               firebaseKey: key
//             }));
//             setDisplayCategories(updatedArray);
//           }
//         }

//         // Fetch dynamic sections
//         const sectionsRef = ref(db, 'sections');
//         const sectionsSnapshot = await get(sectionsRef);
        
//         if (sectionsSnapshot.exists()) {
//           const sectionsData = sectionsSnapshot.val();
//           const sectionKeysMap = {};
//           const dynamicSections = Object.entries(sectionsData).map(([key, section]) => {
//             sectionKeysMap[section.name] = key;
//             return section.name;
//           });
//           const allCategories = [...defaultCategories, ...dynamicSections];
//           setCategories(allCategories);
//           setSectionKeys(sectionKeysMap);
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };
    
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (formData.originalPrice && formData.discount) {
//       const original = parseFloat(formData.originalPrice);
//       const discountPercent = parseFloat(formData.discount);
      
//       if (!isNaN(original) && !isNaN(discountPercent) && discountPercent >= 0 && discountPercent <= 100) {
//         const discountedPrice = original - (original * (discountPercent / 100));
//         setFormData(prev => ({
//           ...prev,
//           price: Math.round(discountedPrice).toString()
//         }));
//       }
//     }
//   }, [formData.originalPrice, formData.discount]);

//   useEffect(() => {
//     if (formData.originalPrice && formData.price && !formData.discount) {
//       const original = parseFloat(formData.originalPrice);
//       const current = parseFloat(formData.price);
      
//       if (!isNaN(original) && !isNaN(current) && original > current) {
//         const discountPercent = Math.round(((original - current) / original) * 100);
//         setFormData(prev => ({
//           ...prev,
//           discount: discountPercent.toString()
//         }));
//       }
//     }
//   }, [formData.originalPrice, formData.price, formData.discount]);

//   const handleAddNewSection = async () => {
//     if (!newSectionName.trim()) {
//       setMessage({
//         type: 'error',
//         text: 'Please enter a section name'
//       });
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       const sectionId = newSectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
      
//       const sectionsRef = ref(db, 'sections');
//       const newSectionRef = push(sectionsRef);
      
//       await set(newSectionRef, {
//         id: sectionId,
//         name: newSectionName.trim(),
//         displayName: newSectionName.trim(),
//         createdAt: Date.now(),
//         isActive: true
//       });

//       // Add to section keys for deletion
//       setSectionKeys(prev => ({
//         ...prev,
//         [newSectionName.trim()]: newSectionRef.key
//       }));

//       setCategories(prev => [...prev, newSectionName.trim()]);
//       setNewSectionName('');
//       setShowNewSectionForm(false);
      
//       setMessage({
//         type: 'success',
//         text: `New section "${newSectionName.trim()}" created successfully!`
//       });
      
//     } catch (error) {
//       console.error('Error creating new section:', error);
//       setMessage({
//         type: 'error',
//         text: 'Error creating new section'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteSection = async (sectionName) => {
//     if (!window.confirm(`Are you sure you want to delete the "${sectionName}" section?`)) {
//       return;
//     }

//     // Don't allow deleting default categories
//     if (defaultCategories.includes(sectionName)) {
//       alert("Default sections cannot be deleted.");
//       return;
//     }

//     try {
//       setIsDeletingSection(true);
      
//       // Get the Firebase key for this section
//       const sectionKey = sectionKeys[sectionName];
      
//       if (!sectionKey) {
//         throw new Error("Section key not found");
//       }
      
//       // Delete from Firebase
//       await remove(ref(db, `sections/${sectionKey}`));
      
//       // Update local state
//       setCategories(prev => prev.filter(cat => cat !== sectionName));
//       setSectionKeys(prev => {
//         const updated = { ...prev };
//         delete updated[sectionName];
//         return updated;
//       });
      
//       // If currently selected section is deleted, reset active category
//       if (activeCategory === sectionName) {
//         setActiveCategory(null);
//       }
      
//       setMessage({
//         type: 'success',
//         text: `Section "${sectionName}" deleted successfully!`
//       });
      
//     } catch (error) {
//       console.error('Error deleting section:', error);
//       setMessage({
//         type: 'error',
//         text: 'Error deleting section'
//       });
//     } finally {
//       setIsDeletingSection(false);
//     }
//   };

//   // New function to handle adding display categories
//   const handleAddNewDisplayCategory = async () => {
//     if (!newDisplayCategoryData.name.trim()) {
//       setMessage({
//         type: 'error',
//         text: 'Please enter a display category name'
//       });
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       const categoryId = newDisplayCategoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
      
//       let imageUrl = '';
//       if (newDisplayCategoryData.image) {
//         const imageStorageRef = storageRef(storage, `displayCategories/${Date.now()}_${newDisplayCategoryData.image.name}`);
//         const snapshot = await uploadBytes(imageStorageRef, newDisplayCategoryData.image);
//         imageUrl = await getDownloadURL(snapshot.ref);
//       }

//       const displayCategoriesRef = ref(db, 'displayCategories');
//       const newDisplayCategoryRef = push(displayCategoriesRef);
      
//       const newDisplayCategory = {
//         id: categoryId,
//         name: newDisplayCategoryData.name.trim(),
//         description: newDisplayCategoryData.description.trim() || `${newDisplayCategoryData.name.trim()} products`,
//         image: imageUrl,
//         productCount: 0,
//         createdAt: Date.now(),
//         isActive: true
//       };

//       await set(newDisplayCategoryRef, newDisplayCategory);

//       // Update local state
//       setDisplayCategories(prev => [...prev, {
//         ...newDisplayCategory,
//         firebaseKey: newDisplayCategoryRef.key
//       }]);
      
//       // Reset form
//       setNewDisplayCategoryData({
//         name: '',
//         description: '',
//         image: null
//       });
//       setShowNewDisplayCategoryForm(false);
      
//       setMessage({
//         type: 'success',
//         text: `New display category "${newDisplayCategoryData.name.trim()}" created successfully!`
//       });
      
//       // Clear file input
//       const fileInput = document.getElementById('displayCategoryImage');
//       if (fileInput) fileInput.value = '';
      
//     } catch (error) {
//       console.error('Error creating new display category:', error);
//       setMessage({
//         type: 'error',
//         text: 'Error creating new display category'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDisplayCategoryInputChange = (e) => {
//     const { name, value, type, files } = e.target;
    
//     if (type === 'file') {
//       setNewDisplayCategoryData(prev => ({
//         ...prev,
//         [name]: files[0]
//       }));
//     } else {
//       setNewDisplayCategoryData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleCategoryClick = (category) => {
//     setActiveCategory(category);
//     setActiveDisplayCategory(null);
//     setFormData(prev => ({
//       ...prev,
//       featured: category === "Bestsellers"
//     }));
//     setMessage({ type: '', text: '' });
//   };

//   const handleDisplayCategoryClick = (category) => {
//     setActiveDisplayCategory(category);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
    
//     if (type === 'file') {
//       setFormData({
//         ...formData,
//         [name]: files[0]
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: type === 'checkbox' ? checked : value
//       });
//     }
//   };

//   const handleSaveItem = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       if (!formData.name || !formData.weight || !formData.price || !formData.originalPrice) {
//         throw new Error('Please fill in all required fields');
//       }

//       if (!activeCategory) {
//         throw new Error('Please select a main category');
//       }

//       if (activeCategory === "Shop by categories" && !activeDisplayCategory) {
//         throw new Error('Please select a display category when adding to Shop by categories');
//       }
      
//       if (!formData.meatCut) {
//         throw new Error('Please select a meat cut type');
//       }

//       let imageUrl = '';
      
//       if (formData.image) {
//         const folderPath = activeCategory === "Shop by categories" && activeDisplayCategory 
//           ? `items/${activeDisplayCategory.id}/${formData.meatCut}` 
//           : `items/${activeCategory.replace(/\s+/g, '-').toLowerCase()}/${formData.meatCut}`;
          
//         const imageStorageRef = storageRef(storage, `${folderPath}/${Date.now()}_${formData.image.name}`);
//         const snapshot = await uploadBytes(imageStorageRef, formData.image);
//         imageUrl = await getDownloadURL(snapshot.ref);
//       } else {
//         throw new Error('Please select an image for the product');
//       }

//       const itemId = formData.name
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/-$/, '');

//       const itemData = {
//         id: itemId,
//         name: formData.name,
//         description: formData.description || '',
//         weight: formData.weight,
//         price: Number(formData.price),
//         originalPrice: Number(formData.originalPrice),
//         discount: Number(formData.discount) || 0,
//         deliveryTime: Number(formData.deliveryTime) || 30,
//         category: activeCategory,
//         featured: activeCategory === "Bestsellers" ? true : formData.featured,
//         meatCut: formData.meatCut,
//         isActive: true,
//         createdAt: Date.now(),
//         image: imageUrl
//       };

//       if (activeCategory === "Shop by categories" && activeDisplayCategory) {
//         itemData.displayCategory = activeDisplayCategory.id;
//       }

//       const itemsRef = ref(db, 'items');
//       const newItemRef = push(itemsRef);
      
//       await set(newItemRef, itemData);
      
//       if (activeCategory === "Shop by categories" && activeDisplayCategory) {
//         try {
//           // Update display category product count
//           const displayCategoriesRef = ref(db, 'displayCategories');
//           const snapshot = await get(displayCategoriesRef);
          
//           if (snapshot.exists()) {
//             const displayCategoriesData = snapshot.val();
//             let categoryToUpdate = null;
//             let categoryKey = null;
            
//             Object.keys(displayCategoriesData).forEach(key => {
//               if (displayCategoriesData[key].id === activeDisplayCategory.id) {
//                 categoryToUpdate = displayCategoriesData[key];
//                 categoryKey = key;
//               }
//             });
            
//             if (categoryToUpdate && categoryKey) {
//               const currentCount = categoryToUpdate.productCount || 0;
//               await set(ref(db, `displayCategories/${categoryKey}/productCount`), currentCount + 1);
              
//               // Update local state
//               setDisplayCategories(prev => 
//                 prev.map(cat => 
//                   cat.firebaseKey === categoryKey 
//                     ? { ...cat, productCount: currentCount + 1 }
//                     : cat
//                 )
//               );
//             }
//           }

//           // Also update the categories collection for backward compatibility
//           const categoriesRef = ref(db, 'categories');
//           const categoriesSnapshot = await get(categoriesRef);
          
//           if (categoriesSnapshot.exists()) {
//             const categoriesData = categoriesSnapshot.val();
//             let categoryToUpdate = null;
//             let categoryKey = null;
            
//             Object.keys(categoriesData).forEach(key => {
//               if (categoriesData[key].id === activeDisplayCategory.id) {
//                 categoryToUpdate = categoriesData[key];
//                 categoryKey = key;
//               }
//             });
            
//             if (categoryToUpdate && categoryKey) {
//               const currentCount = categoryToUpdate.productCount || 0;
//               await set(ref(db, `categories/${categoryKey}/productCount`), currentCount + 1);
//             } else {
//               const newCategoryRef = push(ref(db, 'categories'));
//               await set(newCategoryRef, {
//                 id: activeDisplayCategory.id,
//                 name: activeDisplayCategory.name,
//                 description: `${activeDisplayCategory.name} products`,
//                 productCount: 1,
//                 createdAt: Date.now(),
//                 image: imageUrl
//               });
//             }
//           } else {
//             const newCategoryRef = push(ref(db, 'categories'));
//             await set(newCategoryRef, {
//               id: activeDisplayCategory.id,
//               name: activeDisplayCategory.name,
//               description: `${activeDisplayCategory.name} products`,
//               productCount: 1,
//               createdAt: Date.now(),
//               image: imageUrl
//             });
//           }
//         } catch (error) {
//           console.error('Error updating category product count:', error);
//         }
//       }
      
//       setFormData({
//         name: '',
//         description: '',
//         weight: '',
//         price: '',
//         originalPrice: '',
//         discount: '',
//         deliveryTime: '30',
//         image: null,
//         featured: activeCategory === "Bestsellers",
//         meatCut: 'jc-jatka'
//       });
      
//       setMessage({
//         type: 'success',
//         text: activeDisplayCategory 
//           ? `Item successfully added to ${activeDisplayCategory.name} in ${activeCategory} (${formData.meatCut === 'jc-jatka' ? 'JC Jatka' : formData.meatCut === 'halal-cut' ? 'Halal Cut' : 'Common Cut'})!`
//           : `Item successfully added to ${activeCategory} (${formData.meatCut === 'jc-jatka' ? 'JC Jatka' : formData.meatCut === 'halal-cut' ? 'Halal Cut' : 'Common Cut'})!`
//       });
      
//       const fileInput = document.getElementById('image');
//       if (fileInput) fileInput.value = '';
      
//     } catch (error) {
//       console.error('Error adding item:', error);
//       setMessage({
//         type: 'error',
//         text: `Error: ${error.message}`
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getAvailableDisplayCategories = () => {
//     if (activeCategory !== "Shop by categories") return [];
//     return displayCategories.filter(cat => cat.isActive !== false);
//   };

//   const availableDisplayCategories = getAvailableDisplayCategories();

//   // Close form function
//   const handleCloseForm = () => {
//     setActiveCategory(null);
//     setActiveDisplayCategory(null);
//     setMessage({ type: '', text: '' });
//   };

//   return (
//     <div className="create-items-container">
//       <h1>Add Items</h1>
      
//       <div className="category-selection">
//         <div className="category-section">
//           <h3>Step 1: Select Main Category</h3>
//           <div className="category-buttons">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 className={`category-btn ${activeCategory === category ? 'active' : ''} ${!defaultCategories.includes(category) ? 'custom-section' : ''}`}
//                 onClick={() => handleCategoryClick(category)}
//               >
//                 {category}
//                 {!defaultCategories.includes(category) && (
//                   <span 
//                     className="delete-category-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDeleteSection(category);
//                     }}
//                     title={`Delete ${category} section`}
//                   >
//                     ×
//                   </span>
//                 )}
//               </button>
//             ))}
//             <button
//               className="add-section-btn"
//               onClick={() => setShowNewSectionForm(true)}
//             >
//                Add New Section
//             </button>
//           </div>
          
//           {showNewSectionForm && (
//             <div className="new-section-form">
//               <h4>Create New Section</h4>
//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={newSectionName}
//                   onChange={(e) => setNewSectionName(e.target.value)}
//                   placeholder="Enter section name (e.g., Fresh Fruits)"
//                   className="section-name-input"
//                 />
//               </div>
//               <div className="form-buttons">
//                 <button
//                   type="button"
//                   onClick={handleAddNewSection}
//                   disabled={isLoading}
//                   className="create-section-btn"
//                 >
//                   {isLoading ? 'Creating...' : 'Create Section'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowNewSectionForm(false);
//                     setNewSectionName('');
//                   }}
//                   className="cancel-btn"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
        
//         {activeCategory === "Shop by categories" && (
//           <div className="category-section">
//             <h3>Step 2: Select Display Category</h3>
//             <div className="display-category-info">
//               <p>This determines where the item will appear in the "Shop by categories" section</p>
//             </div>
//             <div className="category-buttons">
//               {availableDisplayCategories.map((category) => (
//                 <button
//                   key={category.id}
//                   className={`category-btn ${activeDisplayCategory?.id === category.id ? 'active' : ''}`}
//                   onClick={() => handleDisplayCategoryClick(category)}
//                 >
//                   {category.name}
//                   {category.productCount !== undefined && (
//                     // <span className="product-count">({category.productCount})</span>
//                         <span className="product-count"></span>
//                   )}
//                 </button>
//               ))}
//               <button
//                 className="category-btn add-new-btn"
//                 onClick={() => setShowNewDisplayCategoryForm(true)}
//               >
//                 + Add New Display Category
//               </button>
//             </div>
            
//             {showNewDisplayCategoryForm && (
//               <div className="new-section-form">
//                 <h4>Create New Display Category</h4>
//                 <div className="form-group">
//                   <label htmlFor="displayCategoryName">Category Name*</label>
//                   <input
//                     type="text"
//                     id="displayCategoryName"
//                     name="name"
//                     value={newDisplayCategoryData.name}
//                     onChange={handleDisplayCategoryInputChange}
//                     placeholder="Enter category name (e.g., Poultry, Seafood)"
//                     className="section-name-input"
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="displayCategoryDescription">Description</label>
//                   <input
//                     type="text"
//                     id="displayCategoryDescription"
//                     name="description"
//                     value={newDisplayCategoryData.description}
//                     onChange={handleDisplayCategoryInputChange}
//                     placeholder="Enter category description"
//                     className="section-name-input"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="displayCategoryImage">Category Image</label>
//                   <input
//                     type="file"
//                     id="displayCategoryImage"
//                     name="image"
//                     accept="image/*"
//                     onChange={handleDisplayCategoryInputChange}
//                     className="section-name-input"
//                   />
//                 </div>
//                 <div className="form-buttons">
//                   <button
//                     type="button"
//                     onClick={handleAddNewDisplayCategory}
//                     disabled={isLoading}
//                     className="create-section-btn"
//                   >
//                     {isLoading ? 'Creating...' : 'Create Display Category'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowNewDisplayCategoryForm(false);
//                       setNewDisplayCategoryData({
//                         name: '',
//                         description: '',
//                         image: null
//                       });
//                     }}
//                     className="cancel-btn"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {activeCategory && (activeCategory !== "Shop by categories" || activeDisplayCategory) && (
//         <div className="item-form-container">
//           <div className="form-header">
//             <h2>
//               Add Item to {activeCategory}
//               {activeDisplayCategory && ` (${activeDisplayCategory.name})`}
//             </h2>
//             <button className="close-form-btn" onClick={handleCloseForm} aria-label="Close form">
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <line x1="18" y1="6" x2="6" y2="18"></line>
//                 <line x1="6" y1="6" x2="18" y2="18"></line>
//               </svg>
//             </button>
//           </div>
          
//           {message.text && (
//             <div className={`message ${message.type}`}>
//               {message.text}
//             </div>
//           )}
          
//           <form className="item-form" onSubmit={handleSaveItem}>
//             <div className="form-group">
//               <label htmlFor="name">Item Name*</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., Chicken Curry Cut - Small Pieces"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="description">Description</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Product description"
//               />
//             </div>

//             <div className="form-group meat-cut-options">
//               <label>Meat Cut Type*</label>
//               <div className="radio-group">
//                 <div className="radio-option">
//                   <input
//                     type="radio"
//                     id="jc-jatka"
//                     name="meatCut"
//                     value="jc-jatka"
//                     checked={formData.meatCut === 'jc-jatka'}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   <label htmlFor="jc-jatka">JC Jatka</label>
//                 </div>
//                 <div className="radio-option">
//                   <input
//                     type="radio"
//                     id="halal-cut"
//                     name="meatCut"
//                     value="halal-cut"
//                     checked={formData.meatCut === 'halal-cut'}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   <label htmlFor="halal-cut">Halal Cut</label>
//                 </div>
//                 <div className="radio-option">
//                   <input
//                     type="radio"
//                     id="common-cut"
//                     name="meatCut"
//                     value="common-cut"
//                     checked={formData.meatCut === 'common-cut'}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   <label htmlFor="common-cut">Common Cut</label>
//                 </div>
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="weight">Weight*</label>
//               <input
//                 type="text"
//                 id="weight"
//                 name="weight"
//                 value={formData.weight}
//                 onChange={handleInputChange}
//                 placeholder="e.g., 500 g"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="originalPrice">Original Price* (₹)</label>
//               <input
//                 type="number"
//                 id="originalPrice"
//                 name="originalPrice"
//                 min="0"
//                 step="0.01"
//                 value={formData.originalPrice}
//                 onChange={handleInputChange}
//                 placeholder="e.g., 195"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="discount">Discount % (Auto-calculates selling price)</label>
//               <input
//                 type="number"
//                 id="discount"
//                 name="discount"
//                 min="0"
//                 max="100"
//                 value={formData.discount}
//                 onChange={handleInputChange}
//                 placeholder="e.g., 18"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="price">Selling Price* (₹) (Auto-calculated from discount)</label>
//               <input
//                 type="number"
//                 id="price"
//                 name="price"
//                 min="0"
//                 step="0.01"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 placeholder="e.g., 160"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="deliveryTime">Delivery Time (minutes)</label>
//               <input
//                 type="number"
//                 id="deliveryTime"
//                 name="deliveryTime"
//                 min="1"
//                 value={formData.deliveryTime}
//                 onChange={handleInputChange}
//                 placeholder="e.g., 30"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="image">Image*</label>
//               <input
//                 type="file"
//                 id="image"
//                 name="image"
//                 accept="image/*"
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>

//             {activeCategory !== "Bestsellers" && (
//               <div className="form-group checkbox">
//                 <input
//                   type="checkbox"
//                   id="featured"
//                   name="featured"
//                   checked={formData.featured}
//                   onChange={handleInputChange}
//                 />
//                 <label htmlFor="featured">Featured Item (Appears in Bestsellers)</label>
//               </div>
//             )}

//             <div className="button-group">
//               <button 
//                 type="submit" 
//                 className={`submit-btn ${activeCategory === "Bestsellers" ? "bestseller-btn" : ""} ${activeCategory === "Shop by categories" ? "category-btn" : ""}`}
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Saving...' : `Add to ${activeDisplayCategory ? activeDisplayCategory.name : activeCategory}`}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateItems;





import React, { useState, useEffect } from 'react';
import { ref, push, set, get, remove, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import '../styles/pages/CreateItems.css';

const CreateItems = () => {
  const defaultCategories = [
    "Bestsellers",
    "Shop by categories",
    "Match Day Essentials",
    "Premium fish & seafood selection"
  ];
  
  const [categories, setCategories] = useState([]);
  const [categoryStatus, setCategoryStatus] = useState({});
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [isDeletingSection, setIsDeletingSection] = useState(false);
  
  // Dynamic display categories - will be fetched from Firebase
  const [displayCategories, setDisplayCategories] = useState([]);
  
  // Add new display category form state
  const [showNewDisplayCategoryForm, setShowNewDisplayCategoryForm] = useState(false);
  const [newDisplayCategoryData, setNewDisplayCategoryData] = useState({
    name: '',
    description: '',
    image: null
  });
  
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeDisplayCategory, setActiveDisplayCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight: '',
    price: '',
    originalPrice: '',
    discount: '',
    deliveryTime: '30',
    image: null,
    featured: false,
    meatCut: 'jc-jatka'
  });

  // Store section keys for deletion
  const [sectionKeys, setSectionKeys] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch display categories from Firebase
        const displayCategoriesRef = ref(db, 'displayCategories');
        const displaySnapshot = await get(displayCategoriesRef);
        
        if (displaySnapshot.exists()) {
          const displayCategoriesData = displaySnapshot.val();
          const displayCategoriesArray = Object.keys(displayCategoriesData).map(key => ({
            ...displayCategoriesData[key],
            firebaseKey: key
          }));
          setDisplayCategories(displayCategoriesArray);
        } else {
          // Initialize with default display categories if none exist
          const defaultDisplayCategories = [
            { id: "chicken", name: "Chicken", description: "Fresh chicken products" },
            { id: "fish-seafood", name: "Fish & Seafood", description: "Fresh fish and seafood" },
            { id: "mutton", name: "Mutton", description: "Premium mutton cuts" },
            { id: "liver-more", name: "Liver & More", description: "Liver and organ meat" },
            { id: "prawns-crabs", name: "Prawns & Crabs", description: "Fresh prawns and crabs" },
            { id: "eggs", name: "Eggs", description: "Farm fresh eggs" },
            { id: "combos", name: "Combos", description: "Value combo packages" }
          ];
          
          // Save default categories to Firebase
          for (const category of defaultDisplayCategories) {
            const newCategoryRef = push(displayCategoriesRef);
            await set(newCategoryRef, {
              ...category,
              createdAt: Date.now(),
              isActive: true
            });
          }
          
          // Fetch again after initialization
          const updatedSnapshot = await get(displayCategoriesRef);
          if (updatedSnapshot.exists()) {
            const updatedData = updatedSnapshot.val();
            const updatedArray = Object.keys(updatedData).map(key => ({
              ...updatedData[key],
              firebaseKey: key
            }));
            setDisplayCategories(updatedArray);
          }
        }

        // Fetch main categories and their active status
        const mainCategoriesRef = ref(db, 'mainCategories');
        const mainCategoriesSnapshot = await get(mainCategoriesRef);
        
        let mainCategoriesData = {};
        let statusMap = {};
        
        if (mainCategoriesSnapshot.exists()) {
          mainCategoriesData = mainCategoriesSnapshot.val();
          // Build status map and keys map
          Object.entries(mainCategoriesData).forEach(([key, category]) => {
            statusMap[category.name] = {
              isActive: category.isActive !== false, // default to true if not specified
              key: key
            };
          });
          
          // Check if all default categories exist in Firebase
          const existingCategories = Object.values(mainCategoriesData).map(cat => cat.name);
          const missingCategories = defaultCategories.filter(cat => !existingCategories.includes(cat));
          
          // Add any missing default categories to Firebase
          for (const categoryName of missingCategories) {
            const newCategoryRef = push(mainCategoriesRef);
            await set(newCategoryRef, {
              name: categoryName,
              isActive: true,
              createdAt: Date.now(),
              isDefault: true
            });
            
            statusMap[categoryName] = {
              isActive: true,
              key: newCategoryRef.key
            };
          }
        } else {
          // Initialize main categories in Firebase if they don't exist
          for (const categoryName of defaultCategories) {
            const newCategoryRef = push(mainCategoriesRef);
            await set(newCategoryRef, {
              name: categoryName,
              isActive: true,
              createdAt: Date.now(),
              isDefault: true
            });
            
            statusMap[categoryName] = {
              isActive: true,
              key: newCategoryRef.key
            };
          }
        }
        
        // Set category status
        setCategoryStatus(statusMap);

        // Fetch dynamic sections
        const sectionsRef = ref(db, 'sections');
        const sectionsSnapshot = await get(sectionsRef);
        
        if (sectionsSnapshot.exists()) {
          const sectionsData = sectionsSnapshot.val();
          const sectionKeysMap = {};
          const dynamicSections = Object.entries(sectionsData).map(([key, section]) => {
            sectionKeysMap[section.name] = key;
            
            // Add to status map
            statusMap[section.name] = {
              isActive: section.isActive !== false,
              key: key
            };
            
            return section.name;
          });
          
          // Set section keys
          setSectionKeys(sectionKeysMap);
          
          // Combine default and dynamic categories
          const allCategories = [...defaultCategories, ...dynamicSections];
          setCategories(allCategories);
          
          // Update status map with all categories
          setCategoryStatus(statusMap);
        } else {
          // If no custom sections, just use default categories
          setCategories([...defaultCategories]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.originalPrice && formData.discount) {
      const original = parseFloat(formData.originalPrice);
      const discountPercent = parseFloat(formData.discount);
      
      if (!isNaN(original) && !isNaN(discountPercent) && discountPercent >= 0 && discountPercent <= 100) {
        const discountedPrice = original - (original * (discountPercent / 100));
        setFormData(prev => ({
          ...prev,
          price: Math.round(discountedPrice).toString()
        }));
      }
    }
  }, [formData.originalPrice, formData.discount]);

  useEffect(() => {
    if (formData.originalPrice && formData.price && !formData.discount) {
      const original = parseFloat(formData.originalPrice);
      const current = parseFloat(formData.price);
      
      if (!isNaN(original) && !isNaN(current) && original > current) {
        const discountPercent = Math.round(((original - current) / original) * 100);
        setFormData(prev => ({
          ...prev,
          discount: discountPercent.toString()
        }));
      }
    }
  }, [formData.originalPrice, formData.price, formData.discount]);

  const handleAddNewSection = async () => {
    if (!newSectionName.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter a section name'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const sectionId = newSectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
      
      const sectionsRef = ref(db, 'sections');
      const newSectionRef = push(sectionsRef);
      
      await set(newSectionRef, {
        id: sectionId,
        name: newSectionName.trim(),
        displayName: newSectionName.trim(),
        createdAt: Date.now(),
        isActive: true
      });

      // Add to section keys for deletion
      setSectionKeys(prev => ({
        ...prev,
        [newSectionName.trim()]: newSectionRef.key
      }));

      // Add to category status
      setCategoryStatus(prev => ({
        ...prev,
        [newSectionName.trim()]: {
          isActive: true,
          key: newSectionRef.key
        }
      }));

      setCategories(prev => [...prev, newSectionName.trim()]);
      setNewSectionName('');
      setShowNewSectionForm(false);
      
      setMessage({
        type: 'success',
        text: `New section "${newSectionName.trim()}" created successfully!`
      });
      
    } catch (error) {
      console.error('Error creating new section:', error);
      setMessage({
        type: 'error',
        text: 'Error creating new section'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSection = async (sectionName) => {
    if (!window.confirm(`Are you sure you want to delete the "${sectionName}" section?`)) {
      return;
    }

    // Don't allow deleting default categories
    if (defaultCategories.includes(sectionName)) {
      alert("Default sections cannot be deleted. You can deactivate them instead.");
      return;
    }

    try {
      setIsDeletingSection(true);
      
      // Get the Firebase key for this section
      const sectionKey = sectionKeys[sectionName];
      
      if (!sectionKey) {
        throw new Error("Section key not found");
      }
      
      // Delete from Firebase
      await remove(ref(db, `sections/${sectionKey}`));
      
      // Update local state
      setCategories(prev => prev.filter(cat => cat !== sectionName));
      setSectionKeys(prev => {
        const updated = { ...prev };
        delete updated[sectionName];
        return updated;
      });
      
      // Update category status
      setCategoryStatus(prev => {
        const updated = { ...prev };
        delete updated[sectionName];
        return updated;
      });
      
      // If currently selected section is deleted, reset active category
      if (activeCategory === sectionName) {
        setActiveCategory(null);
      }
      
      setMessage({
        type: 'success',
        text: `Section "${sectionName}" deleted successfully!`
      });
      
    } catch (error) {
      console.error('Error deleting section:', error);
      setMessage({
        type: 'error',
        text: 'Error deleting section'
      });
    } finally {
      setIsDeletingSection(false);
    }
  };

  // New function to toggle category active status
  const toggleCategoryStatus = async (categoryName) => {
    try {
      setIsLoading(true);
      
      // Get current status and key
      const { isActive, key } = categoryStatus[categoryName] || {};
      
      if (!key) {
        throw new Error("Category key not found");
      }
      
      const newStatus = !isActive;
      
      // Check which collection this category belongs to
      let categoryPath = '';
      if (defaultCategories.includes(categoryName)) {
        categoryPath = `mainCategories/${key}`;
      } else {
        categoryPath = `sections/${key}`;
      }
      
      // Update in Firebase
      await update(ref(db, categoryPath), {
        isActive: newStatus
      });
      
      // Update local state
      setCategoryStatus(prev => ({
        ...prev,
        [categoryName]: {
          ...prev[categoryName],
          isActive: newStatus
        }
      }));
      
      setMessage({
        type: 'success',
        text: `Category "${categoryName}" ${newStatus ? 'activated' : 'deactivated'} successfully!`
      });
      
    } catch (error) {
      console.error('Error toggling category status:', error);
      setMessage({
        type: 'error',
        text: 'Error updating category status'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // New function to handle adding display categories
  const handleAddNewDisplayCategory = async () => {
    if (!newDisplayCategoryData.name.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter a display category name'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const categoryId = newDisplayCategoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
      
      let imageUrl = '';
      if (newDisplayCategoryData.image) {
        const imageStorageRef = storageRef(storage, `displayCategories/${Date.now()}_${newDisplayCategoryData.image.name}`);
        const snapshot = await uploadBytes(imageStorageRef, newDisplayCategoryData.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const displayCategoriesRef = ref(db, 'displayCategories');
      const newDisplayCategoryRef = push(displayCategoriesRef);
      
      const newDisplayCategory = {
        id: categoryId,
        name: newDisplayCategoryData.name.trim(),
        description: newDisplayCategoryData.description.trim() || `${newDisplayCategoryData.name.trim()} products`,
        image: imageUrl,
        productCount: 0,
        createdAt: Date.now(),
        isActive: true
      };

      await set(newDisplayCategoryRef, newDisplayCategory);

      // Update local state
      setDisplayCategories(prev => [...prev, {
        ...newDisplayCategory,
        firebaseKey: newDisplayCategoryRef.key
      }]);
      
      // Reset form
      setNewDisplayCategoryData({
        name: '',
        description: '',
        image: null
      });
      setShowNewDisplayCategoryForm(false);
      
      setMessage({
        type: 'success',
        text: `New display category "${newDisplayCategoryData.name.trim()}" created successfully!`
      });
      
      // Clear file input
      const fileInput = document.getElementById('displayCategoryImage');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error creating new display category:', error);
      setMessage({
        type: 'error',
        text: 'Error creating new display category'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisplayCategoryInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setNewDisplayCategoryData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setNewDisplayCategoryData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setActiveDisplayCategory(null);
    setFormData(prev => ({
      ...prev,
      featured: category === "Bestsellers"
    }));
    setMessage({ type: '', text: '' });
  };

  const handleDisplayCategoryClick = (category) => {
    setActiveDisplayCategory(category);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.name || !formData.weight || !formData.price || !formData.originalPrice) {
        throw new Error('Please fill in all required fields');
      }

      if (!activeCategory) {
        throw new Error('Please select a main category');
      }

      if (activeCategory === "Shop by categories" && !activeDisplayCategory) {
        throw new Error('Please select a display category when adding to Shop by categories');
      }
      
      if (!formData.meatCut) {
        throw new Error('Please select a meat cut type');
      }

      let imageUrl = '';
      
      if (formData.image) {
        const folderPath = activeCategory === "Shop by categories" && activeDisplayCategory 
          ? `items/${activeDisplayCategory.id}/${formData.meatCut}` 
          : `items/${activeCategory.replace(/\s+/g, '-').toLowerCase()}/${formData.meatCut}`;
          
        const imageStorageRef = storageRef(storage, `${folderPath}/${Date.now()}_${formData.image.name}`);
        const snapshot = await uploadBytes(imageStorageRef, formData.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      } else {
        throw new Error('Please select an image for the product');
      }

      const itemId = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-$/, '');

      const itemData = {
        id: itemId,
        name: formData.name,
        description: formData.description || '',
        weight: formData.weight,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discount: Number(formData.discount) || 0,
        deliveryTime: Number(formData.deliveryTime) || 30,
        category: activeCategory,
        featured: activeCategory === "Bestsellers" ? true : formData.featured,
        meatCut: formData.meatCut,
        isActive: true,
        createdAt: Date.now(),
        image: imageUrl
      };

      if (activeCategory === "Shop by categories" && activeDisplayCategory) {
        itemData.displayCategory = activeDisplayCategory.id;
      }

      const itemsRef = ref(db, 'items');
      const newItemRef = push(itemsRef);
      
      await set(newItemRef, itemData);
      
      if (activeCategory === "Shop by categories" && activeDisplayCategory) {
        try {
          // Update display category product count
          const displayCategoriesRef = ref(db, 'displayCategories');
          const snapshot = await get(displayCategoriesRef);
          
          if (snapshot.exists()) {
            const displayCategoriesData = snapshot.val();
            let categoryToUpdate = null;
            let categoryKey = null;
            
            Object.keys(displayCategoriesData).forEach(key => {
              if (displayCategoriesData[key].id === activeDisplayCategory.id) {
                categoryToUpdate = displayCategoriesData[key];
                categoryKey = key;
              }
            });
            
            if (categoryToUpdate && categoryKey) {
              const currentCount = categoryToUpdate.productCount || 0;
              await set(ref(db, `displayCategories/${categoryKey}/productCount`), currentCount + 1);
              
              // Update local state
              setDisplayCategories(prev => 
                prev.map(cat => 
                  cat.firebaseKey === categoryKey 
                    ? { ...cat, productCount: currentCount + 1 }
                    : cat
                )
              );
            }
          }

          // Also update the categories collection for backward compatibility
          const categoriesRef = ref(db, 'categories');
          const categoriesSnapshot = await get(categoriesRef);
          
          if (categoriesSnapshot.exists()) {
            const categoriesData = categoriesSnapshot.val();
            let categoryToUpdate = null;
            let categoryKey = null;
            
            Object.keys(categoriesData).forEach(key => {
              if (categoriesData[key].id === activeDisplayCategory.id) {
                categoryToUpdate = categoriesData[key];
                categoryKey = key;
              }
            });
            
            if (categoryToUpdate && categoryKey) {
              const currentCount = categoryToUpdate.productCount || 0;
              await set(ref(db, `categories/${categoryKey}/productCount`), currentCount + 1);
            } else {
              const newCategoryRef = push(ref(db, 'categories'));
              await set(newCategoryRef, {
                id: activeDisplayCategory.id,
                name: activeDisplayCategory.name,
                description: `${activeDisplayCategory.name} products`,
                productCount: 1,
                createdAt: Date.now(),
                image: imageUrl
              });
            }
          } else {
            const newCategoryRef = push(ref(db, 'categories'));
            await set(newCategoryRef, {
              id: activeDisplayCategory.id,
              name: activeDisplayCategory.name,
              description: `${activeDisplayCategory.name} products`,
              productCount: 1,
              createdAt: Date.now(),
              image: imageUrl
            });
          }
        } catch (error) {
          console.error('Error updating category product count:', error);
        }
      }
      
      setFormData({
        name: '',
        description: '',
        weight: '',
        price: '',
        originalPrice: '',
        discount: '',
        deliveryTime: '30',
        image: null,
        featured: activeCategory === "Bestsellers",
        meatCut: 'jc-jatka'
      });
      
      setMessage({
        type: 'success',
        text: activeDisplayCategory 
          ? `Item successfully added to ${activeDisplayCategory.name} in ${activeCategory} (${formData.meatCut === 'jc-jatka' ? 'JC Jatka' : formData.meatCut === 'halal-cut' ? 'Halal Cut' : 'Common Cut'})!`
          : `Item successfully added to ${activeCategory} (${formData.meatCut === 'jc-jatka' ? 'JC Jatka' : formData.meatCut === 'halal-cut' ? 'Halal Cut' : 'Common Cut'})!`
      });
      
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error adding item:', error);
      setMessage({
        type: 'error',
        text: `Error: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableDisplayCategories = () => {
    if (activeCategory !== "Shop by categories") return [];
    return displayCategories.filter(cat => cat.isActive !== false);
  };

  const availableDisplayCategories = getAvailableDisplayCategories();

  // Close form function
  const handleCloseForm = () => {
    setActiveCategory(null);
    setActiveDisplayCategory(null);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="create-items-container">
      <h1>Add Items</h1>
      
      <div className="category-selection">
        <div className="category-section">
          <h3>Step 1: Select Main Category</h3>
          <div className="category-buttons">
            {categories.map((category) => {
              const isActive = categoryStatus[category]?.isActive !== false;
              return (
                <button
                  key={category}
                  className={`category-btn ${activeCategory === category ? 'active' : ''} ${!isActive ? 'inactive' : ''} ${!defaultCategories.includes(category) ? 'custom-section' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                  <div className="category-actions">
                    {/* Status toggle button for all categories */}
                    <span 
                      className={`toggle-status-btn ${isActive ? 'active' : 'inactive'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategoryStatus(category);
                      }}
                      title={isActive ? `Deactivate ${category}` : `Activate ${category}`}
                    >
                      {isActive ? 'Activate✓' : 'Deactivte✕'}
                    </span>
                    
                    {/* Delete button only for custom categories */}
                    {!defaultCategories.includes(category) && (
                      <span 
                        className="delete-category-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(category);
                        }}
                        title={`Delete ${category} section`}
                      >
                        🗑️
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            <button
              className="add-section-btn"
              onClick={() => setShowNewSectionForm(true)}
            >
               Add New Section
            </button>
          </div>
          
          {showNewSectionForm && (
            <div className="new-section-form">
              <h4>Create New Section</h4>
              <div className="form-group">
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Enter section name (e.g., Fresh Fruits)"
                  className="section-name-input"
                />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={handleAddNewSection}
                  disabled={isLoading}
                  className="create-section-btn"
                >
                  {isLoading ? 'Creating...' : 'Create Section'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewSectionForm(false);
                    setNewSectionName('');
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        {activeCategory === "Shop by categories" && (
          <div className="category-section">
            <h3>Step 2: Select Display Category</h3>
            <div className="display-category-info">
              <p>This determines where the item will appear in the "Shop by categories" section</p>
            </div>
            <div className="category-buttons">
              {availableDisplayCategories.map((category) => (
                <button
                  key={category.id}
                  className={`category-btn ${activeDisplayCategory?.id === category.id ? 'active' : ''}`}
                  onClick={() => handleDisplayCategoryClick(category)}
                >
                  {category.name}
                  {category.productCount !== undefined && (
                    <span className="product-count"></span>
                  )}
                </button>
              ))}
              <button
                className="category-btn add-new-btn"
                onClick={() => setShowNewDisplayCategoryForm(true)}
              >
                + Add New Display Category
              </button>
            </div>
            
            {showNewDisplayCategoryForm && (
              <div className="new-section-form">
                <h4>Create New Display Category</h4>
                <div className="form-group">
                  <label htmlFor="displayCategoryName">Category Name*</label>
                  <input
                    type="text"
                    id="displayCategoryName"
                    name="name"
                    value={newDisplayCategoryData.name}
                    onChange={handleDisplayCategoryInputChange}
                    placeholder="Enter category name (e.g., Poultry, Seafood)"
                    className="section-name-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="displayCategoryDescription">Description</label>
                  <input
                    type="text"
                    id="displayCategoryDescription"
                    name="description"
                    value={newDisplayCategoryData.description}
                    onChange={handleDisplayCategoryInputChange}
                    placeholder="Enter category description"
                    className="section-name-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="displayCategoryImage">Category Image</label>
                  <input
                    type="file"
                    id="displayCategoryImage"
                    name="image"
                    accept="image/*"
                    onChange={handleDisplayCategoryInputChange}
                    className="section-name-input"
                  />
                </div>
                <div className="form-buttons">
                  <button
                    type="button"
                    onClick={handleAddNewDisplayCategory}
                    disabled={isLoading}
                    className="create-section-btn"
                  >
                    {isLoading ? 'Creating...' : 'Create Display Category'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewDisplayCategoryForm(false);
                      setNewDisplayCategoryData({
                        name: '',
                        description: '',
                        image: null
                      });
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activeCategory && (activeCategory !== "Shop by categories" || activeDisplayCategory) && (
        <div className="item-form-container">
          <div className="form-header">
            <h2>
              Add Item to {activeCategory}
              {activeDisplayCategory && ` (${activeDisplayCategory.name})`}
            </h2>
            <button className="close-form-btn" onClick={handleCloseForm} aria-label="Close form">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <form className="item-form" onSubmit={handleSaveItem}>
            <div className="form-group">
              <label htmlFor="name">Item Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Chicken Curry Cut - Small Pieces"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description"
              />
            </div>

            <div className="form-group meat-cut-options">
              <label>Meat Cut Type*</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="jc-jatka"
                    name="meatCut"
                    value="jc-jatka"
                    checked={formData.meatCut === 'jc-jatka'}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="jc-jatka">JC Jatka</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="halal-cut"
                    name="meatCut"
                    value="halal-cut"
                    checked={formData.meatCut === 'halal-cut'}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="halal-cut">Halal Cut</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="common-cut"
                    name="meatCut"
                    value="common-cut"
                    checked={formData.meatCut === 'common-cut'}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="common-cut">Common Cut</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight*</label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 500 g"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="originalPrice">Original Price* (₹)</label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                min="0"
                step="0.01"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="e.g., 195"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="discount">Discount % (Auto-calculates selling price)</label>
              <input
                type="number"
                id="discount"
                name="discount"
                min="0"
                max="100"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="e.g., 18"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Selling Price* (₹) (Auto-calculated from discount)</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 160"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryTime">Delivery Time (minutes)</label>
              <input
                type="number"
                id="deliveryTime"
                name="deliveryTime"
                min="1"
                value={formData.deliveryTime}
                onChange={handleInputChange}
                placeholder="e.g., 30"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Image*</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                required
              />
            </div>

            {activeCategory !== "Bestsellers" && (
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                <label htmlFor="featured">Featured Item (Appears in Bestsellers)</label>
              </div>
            )}

            <div className="button-group">
              <button 
                type="submit" 
                className={`submit-btn ${activeCategory === "Bestsellers" ? "bestseller-btn" : ""} ${activeCategory === "Shop by categories" ? "category-btn" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : `Add to ${activeDisplayCategory ? activeDisplayCategory.name : activeCategory}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateItems;