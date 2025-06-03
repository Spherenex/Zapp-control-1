

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ref as dbRef, onValue, update, remove } from 'firebase/database';
// import { ref as storageRef, listAll, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../firebase/config';
// import '../styles/pages/Dashboard.css';
// import BannerList from '../components/BannerList';

// const Dashboard = () => {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bannerImages, setBannerImages] = useState({});

//   useEffect(() => {
//     const bannersRef = dbRef(db, 'banners');
//     const unsubscribe = onValue(bannersRef, async (snapshot) => {
//       setLoading(true);
//       try {
//         if (snapshot.exists()) {
//           const bannersData = [];
//           snapshot.forEach((childSnapshot) => {
//             bannersData.push({
//               id: childSnapshot.key,
//               ...childSnapshot.val()
//             });
//           });
//           setBanners(bannersData);

//           const imagesData = {};
//           for (const banner of bannersData) {
//             const folderRef = storageRef(storage, `banners/${banner.id}`);
//             try {
//               const fileList = await listAll(folderRef);
//               if (fileList.items.length > 0) {
//                 const sortedItems = [...fileList.items].sort((a, b) => {
//                   const getTimestamp = (name) => {
//                     const match = name.match(/image_(\d+)/);
//                     return match ? parseInt(match[1]) : 0;
//                   };
//                   return getTimestamp(b.name) - getTimestamp(a.name);
//                 });
//                 const imageURL = await getDownloadURL(sortedItems[0]);
//                 imagesData[banner.id] = imageURL;
//               } else {
//                 imagesData[banner.id] = null;
//               }
//             } catch (error) {
//               console.error(`Error fetching image for ${banner.id}:`, error);
//               imagesData[banner.id] = null;
//             }
//           }
//           setBannerImages(imagesData);
//         } else {
//           setBanners([]);
//           setBannerImages({});
//         }
//       } catch (err) {
//         console.error('Error processing banners data:', err);
//         setError('Failed to load banners. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     }, (err) => {
//       console.error('Error fetching banners:', err);
//       setError('Failed to load banners. Please try again later.');
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const toggleBannerStatus = async (id, currentActive) => {
//     try {
//       const bannerRef = dbRef(db, `banners/${id}`);
//       await update(bannerRef, { isActive: !currentActive });
//     } catch (err) {
//       console.error('Error toggling banner status:', err);
//       setError('Failed to update banner status. Please try again.');
//     }
//   };

//   const deleteBanner = async (id) => {
//     if (window.confirm('Are you sure you want to delete this banner?')) {
//       try {
//         const bannerRef = dbRef(db, `banners/${id}`);
//         await remove(bannerRef);
//       } catch (err) {
//         console.error('Error deleting banner:', err);
//         setError('Failed to delete banner. Please try again.');
//       }
//     }
//   };

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <h1>Manage Banners</h1>
//         <Link to="/create" className="create-button">
//           Create and Edit Banner
//         </Link>
//       </div>
      
//       {error && <div className="alert error">{error}</div>}
      
//       {loading ? (
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Loading banners...</p>
//         </div>
//       ) : (
//         <BannerList 
//           banners={banners} 
//           bannerImages={bannerImages}
//           onToggleStatus={toggleBannerStatus} 
//           onDelete={deleteBanner} 
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;





// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref as dbRef, onValue, update, remove } from 'firebase/database';
import { ref as storageRef, listAll, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config'; // Using the correct imports
import '../styles/pages/Dashboard.css';
import BannerList from '../components/BannerList';
import MerchantRequestsAdmin from '../components/admin/MerchantRequestsAdmin';

const Dashboard = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState({});
  const [activeTab, setActiveTab] = useState('banners'); // 'banners' or 'merchants'

  useEffect(() => {
    const bannersRef = dbRef(db, 'banners');
    const unsubscribe = onValue(bannersRef, async (snapshot) => {
      setLoading(true);
      try {
        if (snapshot.exists()) {
          const bannersData = [];
          snapshot.forEach((childSnapshot) => {
            bannersData.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          setBanners(bannersData);

          const imagesData = {};
          for (const banner of bannersData) {
            const folderRef = storageRef(storage, `banners/${banner.id}`);
            try {
              const fileList = await listAll(folderRef);
              if (fileList.items.length > 0) {
                const sortedItems = [...fileList.items].sort((a, b) => {
                  const getTimestamp = (name) => {
                    const match = name.match(/image_(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                  };
                  return getTimestamp(b.name) - getTimestamp(a.name);
                });
                const imageURL = await getDownloadURL(sortedItems[0]);
                imagesData[banner.id] = imageURL;
              } else {
                imagesData[banner.id] = null;
              }
            } catch (error) {
              console.error(`Error fetching image for ${banner.id}:`, error);
              imagesData[banner.id] = null;
            }
          }
          setBannerImages(imagesData);
        } else {
          setBanners([]);
          setBannerImages({});
        }
      } catch (err) {
        console.error('Error processing banners data:', err);
        setError('Failed to load banners. Please try again later.');
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error('Error fetching banners:', err);
      setError('Failed to load banners. Please try again later.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleBannerStatus = async (id, currentActive) => {
    try {
      const bannerRef = dbRef(db, `banners/${id}`);
      await update(bannerRef, { isActive: !currentActive });
    } catch (err) {
      console.error('Error toggling banner status:', err);
      setError('Failed to update banner status. Please try again.');
    }
  };

  const deleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const bannerRef = dbRef(db, `banners/${id}`);
        await remove(bannerRef);
      } catch (err) {
        console.error('Error deleting banner:', err);
        setError('Failed to delete banner. Please try again.');
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
          >
            Manage Banners
          </button>
          <button 
            className={`tab-btn ${activeTab === 'merchants' ? 'active' : ''}`}
            onClick={() => setActiveTab('merchants')}
          >
            Merchant Requests
          </button>
        </div>
      </div>
      
      {error && <div className="alert error">{error}</div>}
      
      {activeTab === 'banners' && (
        <div className="banners-section">
          <div className="section-header">
            <h2>Manage Banners</h2>
            <Link to="/create" className="create-button">
              Create and Edit Banner
            </Link>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading banners...</p>
            </div>
          ) : (
            <BannerList 
              banners={banners} 
              bannerImages={bannerImages}
              onToggleStatus={toggleBannerStatus} 
              onDelete={deleteBanner} 
            />
          )}
        </div>
      )}
      
      {activeTab === 'merchants' && (
        <div className="merchants-section">
          <MerchantRequestsAdmin />
        </div>
      )}
      
      <style jsx>{`
        .tab-buttons {
          display: flex;
          margin-top: 10px;
        }
        
        .tab-btn {
          padding: 10px 15px;
          background-color: #f1f1f1;
          border: none;
          border-radius: 4px;
          margin-right: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .tab-btn.active {
          background-color: #e63946;
          color: white;
        }
        
        .tab-btn:hover:not(.active) {
          background-color: #ddd;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .section-header h2 {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;