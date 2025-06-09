




import React, { useState, useEffect } from 'react';
import { ref, onValue, update, remove, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import '../styles/pages/ManageItems.css';

const ManageItems = () => {
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'categories'
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    weight: '',
    pieces: '',
    serves: '',
    price: '',
    originalPrice: '',
    vendorPrice: '', // Added vendor price
    discount: '',
    deliveryTime: '30',
    category: 'Meat',
    image: null,
    featured: false,
    isActive: true,
    meatCut: 'jc-jatka'
  });
  const [editCategoryData, setEditCategoryData] = useState({
    name: '',
    description: '',
    image: null,
    isActive: true
  });

  // Define standard predefined categories
  const defaultPredefinedCategories = [
    'Bestsellers',
    'Shop by categories',
    'Match Day Essentials',
    'Premium fish & seafood selection'
  ];

  // This will be updated when we fetch the data
  const [allCategories, setAllCategories] = useState([]);

  // DEBUG: Log category changes
  useEffect(() => {
    console.log("All Categories Updated:", allCategories);
    console.log("Items Updated:", items);
  }, [allCategories, items]);

  useEffect(() => {
    // Fetch all category sources
    const fetchAllCategories = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch from mainCategories collection (default sections)
        const mainCategoriesRef = ref(db, 'mainCategories');
        const mainCategoriesSnapshot = await get(mainCategoriesRef);
        let mainCategoriesData = [];
        
        if (mainCategoriesSnapshot.exists()) {
          const data = mainCategoriesSnapshot.val();
          mainCategoriesData = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
            source: 'mainCategories'
          })).filter(cat => cat.isActive !== false);
          
          setMainCategories(mainCategoriesData);
        }
        
        // 2. Fetch from sections collection (dynamic sections)
        const sectionsRef = ref(db, 'sections');
        const sectionsSnapshot = await get(sectionsRef);
        let sectionsData = [];
        
        if (sectionsSnapshot.exists()) {
          const data = sectionsSnapshot.val();
          sectionsData = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
            source: 'sections'
          })).filter(cat => cat.isActive !== false);
          
          setSections(sectionsData);
        }
        
        // 3. Combine all category sources
        const combinedCategories = [
          ...defaultPredefinedCategories,
          ...mainCategoriesData.map(cat => cat.name),
          ...sectionsData.map(cat => cat.name)
        ];
        
        // Remove duplicates
        const uniqueCategories = [...new Set(combinedCategories)];
        setAllCategories(uniqueCategories);
        
      } catch (error) {
        console.error("Error fetching all categories:", error);
        setError("Failed to load all categories. Please try again later.");
      }
    };

    // Fetch Items
    const fetchItems = () => {
      const itemsRef = ref(db, 'items');
      onValue(itemsRef, (snapshot) => {
        try {
          if (snapshot.exists()) {
            const itemsData = [];
            snapshot.forEach((childSnapshot) => {
              itemsData.push({
                firebaseKey: childSnapshot.key,
                ...childSnapshot.val()
              });
            });
            console.log("Raw items from Firebase:", itemsData);
            setItems(itemsData);
          } else {
            setItems([]);
          }
        } catch (err) {
          console.error('Error fetching items:', err);
          setError('Failed to load items. Please try again later.');
        }
      }, (err) => {
        console.error('Error listening to items:', err);
        setError('Failed to load items. Please try again later.');
      });
    };

    // Fetch Display Categories
    const fetchDisplayCategories = () => {
      const categoriesRef = ref(db, 'displayCategories');
      onValue(categoriesRef, (snapshot) => {
        try {
          if (snapshot.exists()) {
            const categoriesData = [];
            snapshot.forEach((childSnapshot) => {
              categoriesData.push({
                firebaseKey: childSnapshot.key,
                ...childSnapshot.val()
              });
            });
            setCategories(categoriesData);
          } else {
            setCategories([]);
          }
        } catch (err) {
          console.error('Error fetching categories:', err);
          setError('Failed to load categories. Please try again later.');
        } finally {
          setLoading(false);
        }
      }, (err) => {
        console.error('Error listening to categories:', err);
        setError('Failed to load categories. Please try again later.');
        setLoading(false);
      });
    };

    // Call all our fetch functions
    fetchAllCategories().then(() => {
      fetchItems();
      fetchDisplayCategories();
    });

    // No cleanup needed for fetchAllCategories as it's not using onValue
    
    // Return a cleanup function for the other listeners
    return () => {
      // Detach listeners
      const itemsRef = ref(db, 'items');
      const categoriesRef = ref(db, 'displayCategories');
      
      // Use once to detach listeners
      onValue(itemsRef, () => {}, { onlyOnce: true });
      onValue(categoriesRef, () => {}, { onlyOnce: true });
    };
  }, []);

  // Item Management Functions
  const handleEditItem = (item) => {
    console.log("Editing item:", item);
    setEditingItem(item);
    setEditFormData({
      name: item.name || '',
      description: item.description || '',
      weight: item.weight || '',
      pieces: item.pieces || '',
      serves: item.serves || '',
      price: item.price || '',
      originalPrice: item.originalPrice || '',
      vendorPrice: item.vendorPrice || '', // Initialize vendor price
      discount: item.discount || '',
      deliveryTime: item.deliveryTime || '30',
      category: item.category || 'Meat',
      image: null,
      featured: item.featured || false,
      isActive: item.isActive !== false, // Default to true if undefined
      meatCut: item.meatCut || 'jc-jatka'
    });
    
    // Prevent body scrolling when popup is open
    document.body.style.overflow = 'hidden';
  };

  const handleItemInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveItemEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingItem.image;

      if (editFormData.image) {
        const folderPath = editFormData.category === 'Shop by categories' && editFormData.displayCategory
          ? `items/${editFormData.displayCategory}/${editFormData.meatCut}`
          : `items/${editFormData.category.replace(/\s+/g, '-').toLowerCase()}/${editFormData.meatCut}`;
        const imageStorageRef = storageRef(storage, `${folderPath}/${Date.now()}_${editFormData.image.name}`);
        const snapshot = await uploadBytes(imageStorageRef, editFormData.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const vendorPrice = parseFloat(editFormData.vendorPrice) || 0;

      const updatedItem = {
        ...editingItem,
        name: editFormData.name,
        description: editFormData.description,
        weight: editFormData.weight,
        pieces: editFormData.pieces,
        serves: parseInt(editFormData.serves) || 0,
        price: parseFloat(editFormData.price) || 0,
        originalPrice: parseFloat(editFormData.originalPrice) || 0,
        vendorPrice: vendorPrice, // Added vendor price
        discount: parseFloat(editFormData.discount) || 0,
        deliveryTime: parseInt(editFormData.deliveryTime) || 30,
        category: editFormData.category,
        image: imageUrl,
        featured: editFormData.featured,
        isActive: editFormData.isActive,
        meatCut: editFormData.meatCut,
        updatedAt: Date.now()
      };

      console.log("Saving updated item:", updatedItem);
      
      await update(ref(db, `items/${editingItem.firebaseKey}`), updatedItem);
      setEditingItem(null);
      resetItemForm();
      
      // Re-enable body scrolling
      document.body.style.overflow = '';
    } catch (error) {
      console.error('Error updating item:', error);
      setError('Failed to update item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItemStatus = async (firebaseKey, currentActive) => {
    try {
      const itemRef = ref(db, `items/${firebaseKey}`);
      await update(itemRef, { 
        isActive: !currentActive,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error toggling item status:', error);
      setError('Failed to update item status. Please try again.');
    }
  };

  const handleDeleteItem = async (firebaseKey) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await remove(ref(db, `items/${firebaseKey}`));
      } catch (error) {
        console.error('Error deleting item:', error);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  // Category Management Functions
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditCategoryData({
      name: category.name || '',
      description: category.description || '',
      image: null,
      isActive: category.isActive !== false
    });
    
    // Prevent body scrolling when popup is open
    document.body.style.overflow = 'hidden';
  };

  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditCategoryData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveCategoryEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingCategory.image;

      if (editCategoryData.image) {
        const imageStorageRef = storageRef(storage, `displayCategories/${Date.now()}_${editCategoryData.image.name}`);
        const snapshot = await uploadBytes(imageStorageRef, editCategoryData.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const updatedCategory = {
        ...editingCategory,
        name: editCategoryData.name,
        description: editCategoryData.description,
        image: imageUrl,
        isActive: editCategoryData.isActive,
        updatedAt: Date.now()
      };

      await update(ref(db, `displayCategories/${editingCategory.firebaseKey}`), updatedCategory);
      setEditingCategory(null);
      resetCategoryForm();
      
      // Re-enable body scrolling
      document.body.style.overflow = '';
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategoryStatus = async (firebaseKey, currentActive) => {
    try {
      const categoryRef = ref(db, `displayCategories/${firebaseKey}`);
      await update(categoryRef, { 
        isActive: !currentActive,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error toggling category status:', error);
      setError('Failed to update category status. Please try again.');
    }
  };

  const handleDeleteCategory = async (firebaseKey, categoryName) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone and may affect existing products.`)) {
      try {
        await remove(ref(db, `displayCategories/${firebaseKey}`));
      } catch (error) {
        console.error('Error deleting category:', error);
        setError('Failed to delete category. Please try again.');
      }
    }
  };

  // Handle modal close
  const handleCloseItemModal = () => {
    setEditingItem(null);
    resetItemForm();
    // Re-enable body scrolling
    document.body.style.overflow = '';
  };

  const handleCloseCategoryModal = () => {
    setEditingCategory(null);
    resetCategoryForm();
    // Re-enable body scrolling
    document.body.style.overflow = '';
  };

  // Search and Filter Functions
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredItems = items.filter(item => {
    // Log each item's category to help diagnose issues
    if (searchTerm || categoryFilter !== 'all') {
      console.log(`Item: ${item.name}, Category: ${item.category}, Filter: ${categoryFilter}`);
    }
    
    // Search filter
    const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter - make it case-insensitive
    const categoryMatch = categoryFilter === 'all' || 
                         (item.category && 
                          item.category.toLowerCase() === categoryFilter.toLowerCase());
    
    // Status filter
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'active' && item.isActive !== false) || 
      (statusFilter === 'inactive' && item.isActive === false);
    
    return searchMatch && categoryMatch && statusMatch;
  });

  const filteredCategories = categories.filter(category => {
    // Search filter for categories
    const searchMatch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter for categories
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'active' && category.isActive !== false) || 
      (statusFilter === 'inactive' && category.isActive === false);
    
    return searchMatch && statusMatch;
  });

  // Utility Functions
  const resetItemForm = () => {
    setEditFormData({
      name: '',
      description: '',
      weight: '',
      pieces: '',
      serves: '',
      price: '',
      originalPrice: '',
      vendorPrice: '',
      discount: '',
      deliveryTime: '30',
      category: 'Meat',
      image: null,
      featured: false,
      isActive: true,
      meatCut: 'jc-jatka'
    });
  };

  const resetCategoryForm = () => {
    setEditCategoryData({
      name: '',
      description: '',
      image: null,
      isActive: true
    });
  };

  if (loading && items.length === 0 && categories.length === 0) {
    return (
      <div className="manage-items-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-items-container">
        <div className="alert error">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-items-container">
      <div className="page-header">
        <h1>Manage Items & Categories</h1>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Manage Items ({items.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Manage Categories ({categories.length})
        </button>
      </div>

      {/* Search and Filter Container */}
      <div className="search-filter-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder={`Search ${activeTab === 'items' ? 'items' : 'categories'}...`} 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-options">
          {activeTab === 'items' && (
            <div className="filter-select">
              <label htmlFor="categoryFilter">Category:</label>
              <select 
                id="categoryFilter" 
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
              >
                <option value="all">All Categories</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
          <div className="filter-select">
            <label htmlFor="statusFilter">Status:</label>
            <select 
              id="statusFilter" 
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="tab-content">
          {filteredItems.length === 0 ? (
            <div className="no-items">
              <h3>No items found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <div className="list-header">
                <h2>All Items ({filteredItems.length})</h2>
              </div>
              <div className="items-list">
                {filteredItems.map(item => (
                  <div key={item.firebaseKey} className={`item-card ${!item.isActive ? 'inactive' : ''}`}>
                    <div className="item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="no-image">No image</div>
                      )}
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <div className="item-info">
                        <p><strong>Category:</strong> {item.category}</p>
                        <p><strong>Original Price:</strong> ₹{item.originalPrice}</p>
                        <p><strong>Selling Price:</strong> ₹{item.price}</p>
                        <p><strong>Vendor Price:</strong> {item.vendorPrice ? `₹${item.vendorPrice}` : '-'}</p>
                        <p><strong>Status:</strong> 
                          <span className={`status ${item.isActive !== false ? 'active' : 'inactive'}`}>
                            {item.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEditItem(item)} className="edit-button">Edit</button>
                      <button 
                        onClick={() => handleToggleItemStatus(item.firebaseKey, item.isActive !== false)} 
                        className={`toggle-button ${item.isActive !== false ? 'deactivate' : 'activate'}`}
                      >
                        {item.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDeleteItem(item.firebaseKey)} className="delete-button1">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="tab-content">
          {filteredCategories.length === 0 ? (
            <div className="no-items">
              <h3>No categories found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <div className="list-header">
                <h2>All Categories ({filteredCategories.length})</h2>
              </div>
              <div className="categories-list">
                {filteredCategories.map(category => (
                  <div key={category.firebaseKey} className={`category-card ${!category.isActive ? 'inactive' : ''}`}>
                    <div className="category-image">
                      {category.image ? (
                        <img src={category.image} alt={category.name} />
                      ) : (
                        <div className="no-image">No image</div>
                      )}
                    </div>
                    <div className="category-details">
                      <h3>{category.name}</h3>
                      <div className="category-info">
                        <p><strong>Description:</strong> {category.description || 'No description'}</p>
                        <p><strong>Status:</strong> 
                          <span className={`status ${category.isActive !== false ? 'active' : 'inactive'}`}>
                            {category.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </p>
                        {category.createdAt && (
                          <p><strong>Created:</strong> {new Date(category.createdAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="category-actions">
                      <button onClick={() => handleEditCategory(category)} className="edit-button">Edit</button>
                      <button 
                        onClick={() => handleToggleCategoryStatus(category.firebaseKey, category.isActive !== false)} 
                        className={`toggle-button ${category.isActive !== false ? 'deactivate' : 'activate'}`}
                      >
                        {category.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDeleteCategory(category.firebaseKey, category.name)} className="delete-button1">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Edit Item Popup */}
      {editingItem && (
        <div className="modal-overlay" onClick={handleCloseItemModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSaveItemEdit} className="edit-form">
              <div className="modal-header">
                <h3>Edit Item</h3>
                <button type="button" className="modal-close" onClick={handleCloseItemModal}>×</button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleItemInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="weight">Weight*</label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={editFormData.weight}
                    onChange={handleItemInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleItemInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="originalPrice">Original Price* (₹)</label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={editFormData.originalPrice}
                    onChange={handleItemInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Selling Price* (₹)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={editFormData.price}
                    onChange={handleItemInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="vendorPrice">Vendor Price (₹)</label>
                  <input
                    type="number"
                    id="vendorPrice"
                    name="vendorPrice"
                    value={editFormData.vendorPrice}
                    onChange={handleItemInputChange}
                    placeholder="Enter price paid to vendor"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="discount">Discount %</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={editFormData.discount}
                    onChange={handleItemInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="deliveryTime">Delivery Time (mins)</label>
                  <input
                    type="number"
                    id="deliveryTime"
                    name="deliveryTime"
                    value={editFormData.deliveryTime}
                    onChange={handleItemInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category*</label>
                  <select
                    id="category"
                    name="category"
                    value={editFormData.category}
                    onChange={handleItemInputChange}
                    required
                  >
                    {allCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="meatCut">Meat Cut</label>
                  <select
                    id="meatCut"
                    name="meatCut"
                    value={editFormData.meatCut}
                    onChange={handleItemInputChange}
                  >
                    <option value="jc-jatka">JC Jatka</option>
                    <option value="halal-cut">Halal Cut</option>
                    <option value="common-cut">Common Cut</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Update Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleItemInputChange}
                />
              </div>

              <div className="form-checkboxes">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={editFormData.featured}
                    onChange={handleItemInputChange}
                  />
                  <label htmlFor="featured">Featured Item</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={editFormData.isActive}
                    onChange={handleItemInputChange}
                  />
                  <label htmlFor="isActive">Active</label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCloseItemModal} className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Popup */}
      {editingCategory && (
        <div className="modal-overlay" onClick={handleCloseCategoryModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSaveCategoryEdit} className="edit-form">
              <div className="modal-header">
                <h3>Edit Category</h3>
                <button type="button" className="modal-close" onClick={handleCloseCategoryModal}>×</button>
              </div>
              <div className="form-group">
                <label htmlFor="categoryName">Category Name*</label>
                <input
                  type="text"
                  id="categoryName"
                  name="name"
                  value={editCategoryData.name}
                  onChange={handleCategoryInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="categoryDescription">Description</label>
                <textarea
                  id="categoryDescription"
                  name="description"
                  value={editCategoryData.description}
                  onChange={handleCategoryInputChange}
                  placeholder="Enter category description"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="categoryImage">Update Image</label>
                <input
                  type="file"
                  id="categoryImage"
                  name="image"
                  accept="image/*"
                  onChange={handleCategoryInputChange}
                />
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="categoryActive"
                  name="isActive"
                  checked={editCategoryData.isActive}
                  onChange={handleCategoryInputChange}
                />
                <label htmlFor="categoryActive">Active</label>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCloseCategoryModal} className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItems;