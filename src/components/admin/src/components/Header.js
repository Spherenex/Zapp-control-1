// // src/components/Header.js
// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { signOut } from 'firebase/auth';
// import { auth } from '../firebase/config';
// import '../styles/components/Header.css';

// const Header = ({ user }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   // Function to check if a link is active
//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   return (
//     <header className="header">
//       <div className="header-container">
//         <div className="logo">
//           <Link to="/">Banner Admin Panel</Link>
//         </div>
        
//         <nav className="nav">
//           <ul>
//             <li>
//               <Link to="/" className={isActive('/') ? 'active' : ''}>
//                 Dashboard
//               </Link>
//             </li>
//             <li>
//               <Link to="/create" className={isActive('/create') ? 'active' : ''}>
//                 Create Banner
//               </Link>
//             </li>
//             <li>
//               <Link to="/create-items" className={isActive('/create-items') ? 'active' : ''}>
//                 Create Items
//               </Link>
//             </li>
//             <li>
//               <Link to="/manage-items" className={isActive('/manage-items') ? 'active' : ''}>
//                 Manage Items
//               </Link>
//             </li>
//           </ul>
//         </nav>
        
//         <div className="user-info">
//           <span className="email">{user.email}</span>
//           <button onClick={handleLogout} className="logout-btn">Logout</button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;



// src/components/Header.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import '../styles/components/Header.css';

const Header = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Banner Admin Panel</Link>
        </div>
        
        <nav className="nav">
          <ul>
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/create" className={isActive('/create') ? 'active' : ''}>
                Create Banner
              </Link>
            </li>
            <li>
              <Link to="/create-items" className={isActive('/create-items') ? 'active' : ''}>
                Create Items
              </Link>
            </li>
            <li>
              <Link to="/manage-items" className={isActive('/manage-items') ? 'active' : ''}>
                Manage Items
              </Link>
            </li>
            <li>
              <Link to="/manage-footer" className={isActive('/manage-footer') ? 'active' : ''}>
                Manage Footer
              </Link>
            </li>
            {/* <li>
              <Link to="/manage-values" className={isActive('/manage-values') ? 'active' : ''}>
                Manage Values
              </Link>
            </li> */}
          </ul>
        </nav>
        
        <div className="user-info">
          <span className="email">{user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;