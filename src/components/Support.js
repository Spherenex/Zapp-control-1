// // src/components/Support.js//admin
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ref as dbRef, onValue } from 'firebase/database';
// import { db } from '../firebase/config';
// import logoImage from '../assets/images/logo1.png';
// import { FaArrowLeft, FaPhoneAlt, FaEnvelope, FaQuestionCircle, FaBoxOpen, FaTruck, FaMoneyBillWave, FaUserCircle, FaWhatsapp, FaSpinner } from 'react-icons/fa';

// const Support = () => {
//   const [activeCategory, setActiveCategory] = useState('ordering');
//   const [content, setContent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Default content as fallback
//   const defaultContent = {
//     hero: {
//       title: 'How Can We Help You?',
//       subtitle: 'Find answers to frequently asked questions or reach out to our support team'
//     },
//     contactMethods: [
//       {
//         id: 'phone',
//         title: 'Call Us',
//         value: '+91 8722237574',
//         description: '7 AM - 10 PM, All days',
//         icon: 'phone'
//       },
//       {
//         id: 'email',
//         title: 'Email Support',
//         value: 'official.tazatabutchers@gmail.com',
//         description: 'Response within 24 hours',
//         icon: 'email'
//       },
//       {
//         id: 'whatsapp',
//         title: 'WhatsApp',
//         value: '+91 8722237574',
//         description: 'Quick support via WhatsApp',
//         icon: 'whatsapp'
//       }
//     ],
//     faqCategories: [
//       {
//         id: 'ordering',
//         name: 'Ordering',
//         faqs: [
//           {
//             question: 'How do I place an order on ZappCart?',
//             answer: 'Ordering on ZappCart is simple! Download our app from the App Store or Google Play, create an account, browse through available meat products, add items to your cart, and proceed to checkout. Your fresh meat will be delivered to your doorstep in under 60 minutes.'
//           },
//           {
//             question: 'What areas do you serve?',
//             answer: 'ZappCart currently serves most areas in Bengaluru. When you open the app, it will automatically detect if we deliver to your location. We\'re constantly expanding our service areas, so check back soon if we don\'t yet deliver to your neighborhood.'
//           },
//           {
//             question: 'Can I schedule an order for later?',
//             answer: 'Currently, ZappCart operates on an on-demand model with delivery within 60 minutes. We don\'t offer scheduled deliveries yet, but we\'re working on adding this feature soon to better serve your needs.'
//           },
//           {
//             question: 'Is there a minimum order value?',
//             answer: 'Yes, the minimum order value is ₹250 to qualify for delivery. This helps us ensure efficient operations while providing you with the freshest meat at reasonable delivery costs.'
//           },
//           {
//             question: 'Can I modify or cancel my order after placing it?',
//             answer: 'Once an order is placed, you can cancel it within 2 minutes through the app. After that, cancellation may not be possible as our partners begin preparing your order immediately. For urgent modifications, please contact our support team via WhatsApp or call immediately.'
//           }
//         ]
//       },
//       {
//         id: 'delivery',
//         name: 'Delivery',
//         faqs: [
//           {
//             question: 'How long does delivery take?',
//             answer: 'ZappCart promises delivery within 60 minutes after order placement in most service areas. Actual delivery times may vary slightly depending on your location, traffic conditions, and order volume, but we strive to be as quick as possible.'
//           },
//           {
//             question: 'How can I track my delivery?',
//             answer: 'You can track your delivery in real-time through the ZappCart app. Once your order is confirmed, you\'ll see a live tracking feature that shows your delivery person\'s location and estimated time of arrival.'
//           },
//           {
//             question: 'Is contactless delivery available?',
//             answer: 'Yes, ZappCart offers contactless delivery. Simply select the \'Contactless Delivery\' option at checkout and add any specific instructions for the delivery person.'
//           },
//           {
//             question: 'What if I\'m not available to receive my order?',
//             answer: 'If you won\'t be available, you can add delivery instructions in the app. Our delivery partner will try to contact you when they arrive. If you\'re unreachable, they\'ll wait for up to 5 minutes before leaving, and you\'ll need to contact customer support to resolve the issue.'
//           },
//           {
//             question: 'Do you deliver on weekends and holidays?',
//             answer: 'Yes, ZappCart operates 7 days a week, including most holidays. Our standard operating hours are 7:00 AM to 10:00 PM, but this may vary on certain holidays. The app will always show current availability.'
//           }
//         ]
//       },
//       {
//         id: 'product',
//         name: 'Product Issues',
//         faqs: [
//           {
//             question: 'How do you ensure the meat is fresh?',
//             answer: 'Unlike other services, we don\'t keep meat in cold storage. Each order is cut fresh after you place it. Our partner shops follow strict cleanliness protocols, and all meat is packed immediately after cutting to maintain maximum freshness.'
//           },
//           {
//             question: 'What if I\'m not satisfied with the quality?',
//             answer: 'Your satisfaction is our priority. If you\'re not happy with the quality of meat received, please take a photo and report the issue within 1 hour of delivery through the app or contact customer support. We\'ll arrange for a replacement or refund as per our policy.'
//           },
//           {
//             question: 'How is the meat packaged?',
//             answer: 'All meat is handled with gloves and masks, then sealed in leak-proof, food-safe packaging to maintain hygiene during transportation. Our packaging is designed to keep your meat fresh until it reaches your home.'
//           },
//           {
//             question: 'Do you offer any organic or specialty meat products?',
//             answer: 'Yes, depending on the area and available partners, we offer various specialty products including organic, free-range, and premium cuts. These options are clearly labeled in the app with detailed descriptions.'
//           },
//           {
//             question: 'How are portion sizes determined?',
//             answer: 'Our portion sizes are standardized and clearly indicated in the app. For items sold by weight, we ensure you receive the exact weight ordered (±10g). If you have specific requirements, you can add cutting instructions in the \'Special Instructions\' field.'
//           }
//         ]
//       },
//       {
//         id: 'payment',
//         name: 'Payment & Refunds',
//         faqs: [
//           {
//             question: 'What payment methods do you accept?',
//             answer: 'ZappCart accepts various payment methods including credit/debit cards, UPI (Google Pay, PhonePe, BHIM), net banking, and cash on delivery in select areas. All online transactions are secure and encrypted.'
//           },
//           {
//             question: 'How do refunds work?',
//             answer: 'If you\'re eligible for a refund, it will be processed according to your original payment method. For online payments, refunds typically take 3-5 business days to reflect in your account. For COD orders, refunds are processed via bank transfer or as ZappCart wallet credit.'
//           },
//           {
//             question: 'Do you have any subscription or membership plans?',
//             answer: 'We\'re currently developing a premium membership program that will offer benefits like free delivery, exclusive discounts, and priority service. Stay tuned for the launch announcement!'
//           },
//           {
//             question: 'Are there any additional charges besides the product price?',
//             answer: 'ZappCart charges a delivery fee based on distance, which is clearly shown before you place the order. There may also be a small service charge during peak hours or for orders below a certain value. All applicable charges are transparently displayed at checkout.'
//           },
//           {
//             question: 'How do I apply a coupon or discount code?',
//             answer: 'To apply a coupon, enter the discount code in the designated field at checkout. The system will automatically apply the discount if the order meets all coupon conditions. You can see available offers in the \'Promotions\' section of the app.'
//           }
//         ]
//       },
//       {
//         id: 'account',
//         name: 'Account',
//         faqs: [
//           {
//             question: 'How do I create a ZappCart account?',
//             answer: 'Download the ZappCart app, tap \'Sign Up\', and follow the prompts to create your account using your phone number. You\'ll receive an OTP for verification, after which you can set up your profile and add delivery addresses.'
//           },
//           {
//             question: 'How can I update my delivery address?',
//             answer: 'To update your delivery address, go to your profile in the app, select \'Manage Addresses\', and then either edit an existing address or add a new one. You can save multiple addresses and select the preferred one during checkout.'
//           },
//           {
//             question: 'Is my personal information secure?',
//             answer: 'Yes, ZappCart takes data security very seriously. We use industry-standard encryption for all personal and payment information. We never share your data with unauthorized third parties. For more details, please refer to our Privacy Policy.'
//           },
//           {
//             question: 'How do I view my order history?',
//             answer: 'Your order history is available in the \'My Orders\' section of the app. Here you can see details of past orders, reorder your favorites, and track active orders.'
//           },
//           {
//             question: 'How can I delete my account?',
//             answer: 'To delete your account, please contact our customer support team via the app or email. We\'ll process your request within 7 business days and confirm once completed. Note that account deletion is permanent and will remove all your data from our systems.'
//           }
//         ]
//       }
//     ]
//   };

//   const categories = [
//     { id: 'ordering', name: 'Ordering', icon: <FaQuestionCircle /> },
//     { id: 'delivery', name: 'Delivery', icon: <FaTruck /> },
//     { id: 'product', name: 'Product Issues', icon: <FaBoxOpen /> },
//     { id: 'payment', name: 'Payment & Refunds', icon: <FaMoneyBillWave /> },
//     { id: 'account', name: 'Account', icon: <FaUserCircle /> }
//   ];

//   useEffect(() => {
//     const loadContent = () => {
//       try {
//         const contentRef = dbRef(db, 'pages/support');
//         const unsubscribe = onValue(contentRef, (snapshot) => {
//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             setContent(data);
//           } else {
//             setContent(defaultContent);
//           }
//           setLoading(false);
//         }, (error) => {
//           console.error("Error loading content:", error);
//           setError(error.message);
//           setContent(defaultContent);
//           setLoading(false);
//         });

//         return unsubscribe;
//       } catch (error) {
//         console.error("Error setting up content listener:", error);
//         setError(error.message);
//         setContent(defaultContent);
//         setLoading(false);
//       }
//     };

//     const unsubscribe = loadContent();
    
//     return () => {
//       if (unsubscribe && typeof unsubscribe === 'function') {
//         unsubscribe();
//       }
//     };
//   }, []);

//   const getIconComponent = (iconType) => {
//     switch(iconType) {
//       case 'phone':
//         return <FaPhoneAlt />;
//       case 'email':
//         return <FaEnvelope />;
//       case 'whatsapp':
//         return <FaWhatsapp />;
//       default:
//         return <FaPhoneAlt />;
//     }
//   };

//   const getCurrentFaqs = () => {
//     const displayContent = content || defaultContent;
//     const category = displayContent.faqCategories?.find(cat => cat.id === activeCategory);
//     return category?.faqs || [];
//   };

//   if (loading) {
//     return (
//       <div className="support-container loading-container">
//         <div className="support-header">
//           <Link to="/" className="back-link">
//             <FaArrowLeft /> Back to Home
//           </Link>
//         </div>
//         <div className="loading-section">
//           <div className="loading-spinner">
//             <FaSpinner className="spinner-icon" />
//           </div>
//           <p>Loading support content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !content) {
//     return (
//       <div className="support-container error-container">
//         <div className="support-header">
//           <Link to="/" className="back-link">
//             <FaArrowLeft /> Back to Home
//           </Link>
//         </div>
//         <div className="error-section">
//           <h2>Error Loading Content</h2>
//           <p>We're having trouble loading the support content. Please try refreshing the page.</p>
//           <button onClick={() => window.location.reload()}>Refresh Page</button>
//         </div>
//       </div>
//     );
//   }

//   const displayContent = content || defaultContent;

//   return (
//     <div className="support-container">
//       <header className="support-header">
//         <Link to="/" className="back-link">
//           <FaArrowLeft /> Back to Home
//         </Link>
//       </header>

//       <main className="support-content">
//         <div className="support-banner">
//           <h1>{displayContent.hero?.title || 'How Can We Help You?'}</h1>
//           <p>{displayContent.hero?.subtitle || 'Find answers to frequently asked questions or reach out to our support team'}</p>
//         </div>

//         <div className="support-contact-bar">
//           {(displayContent.contactMethods || []).map((method) => (
//             <div key={method.id} className="contact-method">
//               {getIconComponent(method.icon)}
//               <div className="contact-info">
//                 <h3>{method.title}</h3>
//                 <p>
//                   {method.id === 'phone' ? (
//                     <a href={`tel:${method.value}`}>{method.value}</a>
//                   ) : method.id === 'email' ? (
//                     <a href={`mailto:${method.value}`}>{method.value}</a>
//                   ) : method.id === 'whatsapp' ? (
//                     <a href={`https://wa.me/${method.value.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">{method.value}</a>
//                   ) : (
//                     method.value
//                   )}
//                 </p>
//                 <span>{method.description}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="faq-section">
//           <h2>Frequently Asked Questions</h2>
//           <div className="faq-container">
//             <div className="faq-categories">
//               {categories.map((category) => (
//                 <button 
//                   key={category.id}
//                   className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
//                   onClick={() => setActiveCategory(category.id)}
//                 >
//                   {category.icon}
//                   <span>{category.name}</span>
//                 </button>
//               ))}
//             </div>
            
//             <div className="faq-questions">
//               {getCurrentFaqs().map((faq, index) => (
//                 <details key={index} className="faq-item">
//                   <summary className="faq-question">{faq.question}</summary>
//                   <div className="faq-answer">
//                     <p>{faq.answer}</p>
//                   </div>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>

//       <footer className="support-footer">
//         <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
//         <Link to="/" className="footer-home-link">Return to Main Website</Link>
//       </footer>

//       <style jsx>{`
//         .support-container {
//           font-family: 'Arial', sans-serif;
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 20px;
//           color: #333;
//           line-height: 1.6;
//         }

//         .support-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 20px 0;
//           border-bottom: 1px solid #eee;
//         }

//         .back-link {
//           display: flex;
//           align-items: center;
//           color: #e63946;
//           text-decoration: none;
//           font-weight: 600;
//           transition: color 0.3s;
//         }

//         .back-link:hover {
//           color: #c1121f;
//         }

//         .back-link svg {
//           margin-right: 8px;
//         }

//         .support-content {
//           padding: 40px 0;
//         }

//         .support-banner {
//           text-align: center;
//           margin-bottom: 40px;
//           padding: 40px 20px;
//           background-color: #f8f9fa;
//           border-radius: 10px;
//         }

//         .support-banner h1 {
//           font-size: 2.6rem;
//           color: #1d3557;
//           margin-bottom: 15px;
//         }

//         .support-banner p {
//           font-size: 1.2rem;
//           color: #666;
//           max-width: 600px;
//           margin: 0 auto;
//         }

//         .support-contact-bar {
//           display: flex;
//           justify-content: center;
//           gap: 30px;
//           margin-bottom: 50px;
//         }

//         .contact-method {
//           display: flex;
//           align-items: center;
//           background-color: #fff;
//           padding: 20px;
//           border-radius: 10px;
//           box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
//           min-width: 300px;
//         }

//         .contact-method svg {
//           font-size: 2rem;
//           color: #e63946;
//           margin-right: 20px;
//         }

//         .contact-info h3 {
//           margin: 0 0 5px;
//           color: #1d3557;
//           font-size: 1.1rem;
//         }

//         .contact-info p {
//           margin: 0 0 5px;
//           font-weight: 600;
//           color: #333;
//         }

//         .contact-info a {
//           color: #e63946;
//           text-decoration: none;
//         }

//         .contact-info a:hover {
//           text-decoration: underline;
//         }

//         .contact-info span {
//           font-size: 0.85rem;
//           color: #666;
//         }

//         .faq-section {
//           margin-bottom: 50px;
//         }

//         .faq-section h2 {
//           text-align: center;
//           font-size: 2rem;
//           color: #1d3557;
//           margin-bottom: 30px;
//         }

//         .faq-container {
//           display: flex;
//           gap: 30px;
//           background-color: #fff;
//           border-radius: 10px;
//           overflow: hidden;
//           box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
//         }

//         .faq-categories {
//           flex: 0 0 250px;
//           background-color: #f8f9fa;
//           padding: 20px 0;
//           display: flex;
//           flex-direction: column;
//         }

//         .category-btn {
//           display: flex;
//           align-items: center;
//           padding: 15px 20px;
//           background: none;
//           border: none;
//           text-align: left;
//           cursor: pointer;
//           transition: all 0.3s;
//           color: #555;
//           font-weight: 500;
//         }

//         .category-btn svg {
//           margin-right: 10px;
//           font-size: 1.1rem;
//         }

//         .category-btn:hover {
//           background-color: #e6e6e6;
//         }

//         .category-btn.active {
//           background-color: #e63946;
//           color: white;
//         }

//         .faq-questions {
//           flex: 1;
//           padding: 30px;
//         }

//         .faq-item {
//           border-bottom: 1px solid #eee;
//           margin-bottom: 15px;
//         }

//         .faq-item:last-child {
//           border-bottom: none;
//           margin-bottom: 0;
//         }

//         .faq-question {
//           font-weight: 600;
//           color: #1d3557;
//           padding: 15px 0;
//           cursor: pointer;
//           position: relative;
//           list-style: none;
//         }

//         .faq-question::-webkit-details-marker {
//           display: none;
//         }

//         .faq-question::after {
//           content: '+';
//           position: absolute;
//           right: 0;
//           top: 50%;
//           transform: translateY(-50%);
//           font-size: 1.5rem;
//           color: #e63946;
//         }

//         details[open] .faq-question::after {
//           content: '−';
//         }

//         .faq-answer {
//           padding: 0 0 15px;
//         }

//         .faq-answer p {
//           margin: 0;
//           color: #555;
//         }

//         .support-footer {
//           text-align: center;
//           padding: 20px 0;
//           border-top: 1px solid #eee;
//           color: #666;
//         }

//         .footer-home-link {
//           display: inline-block;
//           margin-top: 10px;
//           color: #e63946;
//           text-decoration: none;
//         }

//         .footer-home-link:hover {
//           text-decoration: underline;
//         }

//         /* Loading States */
//         .loading-container {
//           min-height: 100vh;
//         }

//         .loading-section {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: 60vh;
//           text-align: center;
//           padding: 60px 20px;
//         }

//         .loading-spinner {
//           margin-bottom: 20px;
//         }

//         .spinner-icon {
//           font-size: 3rem;
//           color: #e63946;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         .loading-section p {
//           color: #64748b;
//           font-size: 1.3rem;
//           margin: 0;
//           font-weight: 500;
//         }

//         /* Error States */
//         .error-container {
//           min-height: 100vh;
//         }

//         .error-section {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: 60vh;
//           text-align: center;
//           padding: 60px 20px;
//           background: #fef2f2;
//           border-radius: 16px;
//           margin: 20px;
//           border: 2px solid #fecaca;
//         }

//         .error-section h2 {
//           color: #dc2626;
//           margin-bottom: 15px;
//           font-size: 2rem;
//           font-weight: 700;
//         }

//         .error-section p {
//           color: #6b7280;
//           margin-bottom: 30px;
//           font-size: 1.2rem;
//           max-width: 500px;
//           line-height: 1.6;
//         }

//         .error-section button {
//           background: linear-gradient(135deg, #e63946 0%, #c1121f 100%);
//           color: white;
//           padding: 14px 28px;
//           border: none;
//           border-radius: 10px;
//           font-weight: 600;
//           font-size: 1.1rem;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .error-section button:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 12px rgba(225, 57, 70, 0.4);
//         }

//         @media (max-width: 900px) {
//           .support-contact-bar {
//             flex-direction: column;
//             align-items: center;
//           }

//           .contact-method {
//             width: 100%;
//             max-width: 500px;
//           }

//           .faq-container {
//             flex-direction: column;
//           }

//           .faq-categories {
//             flex: auto;
//             flex-direction: row;
//             overflow-x: auto;
//             padding: 15px;
//           }

//           .category-btn {
//             white-space: nowrap;
//             padding: 10px 15px;
//           }
//         }

//         @media (max-width: 600px) {
//           .support-banner h1 {
//             font-size: 2rem;
//           }
          
//           .support-banner p {
//             font-size: 1rem;
//           }
          
//           .faq-question {
//             padding-right: 20px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Support;



// Path: src/components/admin/AdminSupport.js
// Description: Admin interface for managing support content with Firebase integration

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ref as dbRef, 
  onValue, 
  set, 
  push, 
  remove, 
  update 
} from 'firebase/database';
import { db } from '../../firebase/config';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaSpinner
} from 'react-icons/fa';

const Support = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState({
    section: null, // 'hero', 'contact', 'categories', 'faqs'
    id: null,
    isNew: false
  });
  
  // Form states
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '' });
  const [contactForm, setContactForm] = useState({ id: '', title: '', value: '', description: '', icon: '' });
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '' });
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', categoryId: '' });
  
  // Initialize with empty content structure
  const emptyContent = {
    hero: {
      title: 'How Can We Help You?',
      subtitle: 'Find answers to frequently asked questions or reach out to our support team'
    },
    contactMethods: [],
    faqCategories: []
  };

  useEffect(() => {
    const loadContent = () => {
      try {
        const contentRef = dbRef(db, 'pages/support');
        const unsubscribe = onValue(contentRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setContent(data);
          } else {
            // Initialize with empty structure if nothing exists
            setContent(emptyContent);
            // Save empty structure to Firebase
            set(contentRef, emptyContent);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error loading content:", error);
          setError(error.message);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up content listener:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    const unsubscribe = loadContent();
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Save content to Firebase
  const saveContent = async (newContent) => {
    try {
      setLoading(true);
      const contentRef = dbRef(db, 'pages/support');
      await set(contentRef, newContent);
      setContent(newContent);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error saving content:", error);
      setError(error.message);
      setLoading(false);
      return false;
    }
  };

  // Update specific section in Firebase
  const updateSection = async (section, data) => {
    try {
      setLoading(true);
      const sectionRef = dbRef(db, `pages/support/${section}`);
      await set(sectionRef, data);
      setContent({
        ...content,
        [section]: data
      });
      setLoading(false);
      return true;
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      setError(error.message);
      setLoading(false);
      return false;
    }
  };

  // Hero section handlers
  const handleEditHero = () => {
    setHeroForm(content.hero);
    setEditMode({ section: 'hero', id: null, isNew: false });
  };

  const handleSaveHero = async () => {
    if (await updateSection('hero', heroForm)) {
      setEditMode({ section: null, id: null, isNew: false });
    }
  };

  // Contact method handlers
  const handleAddContact = () => {
    setContactForm({ id: '', title: '', value: '', description: '', icon: 'phone' });
    setEditMode({ section: 'contact', id: null, isNew: true });
  };

  const handleEditContact = (contact) => {
    setContactForm({ ...contact });
    setEditMode({ section: 'contact', id: contact.id, isNew: false });
  };

  const handleSaveContact = async () => {
    try {
      const updatedContacts = [...(content.contactMethods || [])];
      
      if (editMode.isNew) {
        // Generate a unique ID if not provided
        const newContact = { 
          ...contactForm,
          id: contactForm.id || `contact_${Date.now()}`
        };
        updatedContacts.push(newContact);
      } else {
        // Find and update existing contact
        const index = updatedContacts.findIndex(c => c.id === editMode.id);
        if (index !== -1) {
          updatedContacts[index] = contactForm;
        }
      }
      
      if (await updateSection('contactMethods', updatedContacts)) {
        setEditMode({ section: null, id: null, isNew: false });
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      setError(error.message);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact method?')) {
      const updatedContacts = content.contactMethods.filter(c => c.id !== contactId);
      await updateSection('contactMethods', updatedContacts);
    }
  };

  // Category handlers
  const handleAddCategory = () => {
    setCategoryForm({ id: '', name: '' });
    setEditMode({ section: 'category', id: null, isNew: true });
  };

  const handleEditCategory = (category) => {
    setCategoryForm({ ...category });
    setEditMode({ section: 'category', id: category.id, isNew: false });
  };

  const handleSaveCategory = async () => {
    try {
      const updatedCategories = [...(content.faqCategories || [])];
      
      if (editMode.isNew) {
        // Generate a unique ID if not provided or convert name to slug if empty
        const newId = categoryForm.id || categoryForm.name.toLowerCase().replace(/\s+/g, '-');
        const newCategory = { 
          ...categoryForm,
          id: newId,
          faqs: [] // Initialize with empty faqs array
        };
        updatedCategories.push(newCategory);
      } else {
        // Find and update existing category
        const index = updatedCategories.findIndex(c => c.id === editMode.id);
        if (index !== -1) {
          // Preserve existing FAQs
          updatedCategories[index] = {
            ...updatedCategories[index],
            id: categoryForm.id,
            name: categoryForm.name
          };
        }
      }
      
      if (await updateSection('faqCategories', updatedCategories)) {
        setEditMode({ section: null, id: null, isNew: false });
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setError(error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all FAQs in this category.')) {
      const updatedCategories = content.faqCategories.filter(c => c.id !== categoryId);
      await updateSection('faqCategories', updatedCategories);
    }
  };

  // FAQ handlers
  const handleAddFaq = (categoryId) => {
    setFaqForm({ question: '', answer: '', categoryId });
    setEditMode({ section: 'faq', id: categoryId, isNew: true });
  };

  const handleEditFaq = (faq, categoryId) => {
    setFaqForm({ ...faq, categoryId });
    setEditMode({ section: 'faq', id: categoryId, isNew: false, faqIndex: faq._index });
  };

  const handleSaveFaq = async () => {
    try {
      const updatedCategories = [...content.faqCategories];
      const categoryIndex = updatedCategories.findIndex(c => c.id === faqForm.categoryId);
      
      if (categoryIndex !== -1) {
        const category = updatedCategories[categoryIndex];
        const faqs = [...(category.faqs || [])];
        
        if (editMode.isNew) {
          // Add new FAQ
          faqs.push({
            question: faqForm.question,
            answer: faqForm.answer
          });
        } else {
          // Update existing FAQ
          faqs[editMode.faqIndex] = {
            question: faqForm.question,
            answer: faqForm.answer
          };
        }
        
        updatedCategories[categoryIndex] = {
          ...category,
          faqs
        };
        
        if (await updateSection('faqCategories', updatedCategories)) {
          setEditMode({ section: null, id: null, isNew: false });
        }
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
      setError(error.message);
    }
  };

  const handleDeleteFaq = async (categoryId, faqIndex) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      const updatedCategories = [...content.faqCategories];
      const categoryIndex = updatedCategories.findIndex(c => c.id === categoryId);
      
      if (categoryIndex !== -1) {
        const category = updatedCategories[categoryIndex];
        const faqs = [...category.faqs];
        faqs.splice(faqIndex, 1);
        
        updatedCategories[categoryIndex] = {
          ...category,
          faqs
        };
        
        await updateSection('faqCategories', updatedCategories);
      }
    }
  };

  // Handle form cancel
  const handleCancel = () => {
    setEditMode({ section: null, id: null, isNew: false });
  };

  if (loading && !content) {
    return (
      <div className="admin-container loading-container">
        <div className="admin-header">
          <Link to="/admin" className="back-link">
            <FaArrowLeft /> Back to Admin Dashboard
          </Link>
        </div>
        <div className="loading-section">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
          <p>Loading support content...</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="admin-container error-container">
        <div className="admin-header">
          <Link to="/admin" className="back-link">
            <FaArrowLeft /> Back to Admin Dashboard
          </Link>
        </div>
        <div className="error-section">
          <h2>Error Loading Content</h2>
          <p>We're having trouble loading the support content: {error}</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <Link to="/admin" className="back-link">
          <FaArrowLeft /> Back to Admin Dashboard
        </Link>
        <h1>Manage Support Page</h1>
      </header>

      <main className="admin-content">
        {loading && (
          <div className="loading-overlay">
            <FaSpinner className="spinner-icon" />
          </div>
        )}

        {/* Hero Section */}
        <section className="admin-section">
          <div className="section-header">
            <h2>Hero Section</h2>
            <button 
              className="action-btn edit-btn" 
              onClick={handleEditHero}
              disabled={editMode.section !== null}
            >
              <FaEdit /> Edit
            </button>
          </div>

          {editMode.section === 'hero' ? (
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="hero-title">Title</label>
                <input
                  id="hero-title"
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({...heroForm, title: e.target.value})}
                  placeholder="Enter title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="hero-subtitle">Subtitle</label>
                <textarea
                  id="hero-subtitle"
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({...heroForm, subtitle: e.target.value})}
                  placeholder="Enter subtitle"
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button className="action-btn save-btn" onClick={handleSaveHero}>
                  <FaSave /> Save
                </button>
                <button className="action-btn cancel-btn" onClick={handleCancel}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="preview-section">
              <h3>{content?.hero?.title || 'No title set'}</h3>
              <p>{content?.hero?.subtitle || 'No subtitle set'}</p>
            </div>
          )}
        </section>

        {/* Contact Methods Section */}
        <section className="admin-section">
          <div className="section-header">
            <h2>Contact Methods</h2>
            <button 
              className="action-btn add-btn" 
              onClick={handleAddContact}
              disabled={editMode.section !== null}
            >
              <FaPlus /> Add Contact Method
            </button>
          </div>

          {editMode.section === 'contact' && (
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="contact-id">ID (unique identifier)</label>
                <input
                  id="contact-id"
                  type="text"
                  value={contactForm.id}
                  onChange={(e) => setContactForm({...contactForm, id: e.target.value})}
                  placeholder="E.g., phone, email, whatsapp"
                  disabled={!editMode.isNew} // Can't change ID of existing contact
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-title">Title</label>
                <input
                  id="contact-title"
                  type="text"
                  value={contactForm.title}
                  onChange={(e) => setContactForm({...contactForm, title: e.target.value})}
                  placeholder="E.g., Call Us, Email Support"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-value">Value (phone, email, etc.)</label>
                <input
                  id="contact-value"
                  type="text"
                  value={contactForm.value}
                  onChange={(e) => setContactForm({...contactForm, value: e.target.value})}
                  placeholder="E.g., +91 1234567890, support@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-description">Description</label>
                <input
                  id="contact-description"
                  type="text"
                  value={contactForm.description}
                  onChange={(e) => setContactForm({...contactForm, description: e.target.value})}
                  placeholder="E.g., 7 AM - 10 PM, All days"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-icon">Icon</label>
                <select
                  id="contact-icon"
                  value={contactForm.icon}
                  onChange={(e) => setContactForm({...contactForm, icon: e.target.value})}
                >
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="action-btn save-btn" onClick={handleSaveContact}>
                  <FaSave /> Save
                </button>
                <button className="action-btn cancel-btn" onClick={handleCancel}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          )}

          <div className="contact-list">
            {content?.contactMethods?.length > 0 ? (
              content.contactMethods.map((contact) => (
                <div key={contact.id} className="contact-item">
                  <div className="contact-info">
                    <h3>{contact.title}</h3>
                    <p>{contact.value}</p>
                    <span>Description: {contact.description}</span>
                    <span>Icon: {contact.icon}</span>
                  </div>
                  <div className="contact-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEditContact(contact)}
                      disabled={editMode.section !== null}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteContact(contact.id)}
                      disabled={editMode.section !== null}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">No contact methods added yet.</p>
            )}
          </div>
        </section>

        {/* FAQ Categories Section */}
        <section className="admin-section">
          <div className="section-header">
            <h2>FAQ Categories</h2>
            <button 
              className="action-btn add-btn" 
              onClick={handleAddCategory}
              disabled={editMode.section !== null}
            >
              <FaPlus /> Add Category
            </button>
          </div>

          {editMode.section === 'category' && (
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="category-id">ID (unique identifier)</label>
                <input
                  id="category-id"
                  type="text"
                  value={categoryForm.id}
                  onChange={(e) => setCategoryForm({...categoryForm, id: e.target.value})}
                  placeholder="E.g., ordering, delivery (no spaces, lowercase)"
                  disabled={!editMode.isNew} // Can't change ID of existing category
                />
                <small>Leave blank to auto-generate from name</small>
              </div>
              <div className="form-group">
                <label htmlFor="category-name">Display Name</label>
                <input
                  id="category-name"
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  placeholder="E.g., Ordering, Delivery"
                />
              </div>
              <div className="form-actions">
                <button className="action-btn save-btn" onClick={handleSaveCategory}>
                  <FaSave /> Save
                </button>
                <button className="action-btn cancel-btn" onClick={handleCancel}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          )}

          <div className="category-list">
            {content?.faqCategories?.length > 0 ? (
              content.faqCategories.map((category) => (
                <div key={category.id} className="category-item">
                  <div className="category-header">
                    <h3>{category.name}</h3>
                    <div className="category-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditCategory(category)}
                        disabled={editMode.section !== null}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={editMode.section !== null}
                      >
                        <FaTrash />
                      </button>
                      <button 
                        className="action-btn add-btn"
                        onClick={() => handleAddFaq(category.id)}
                        disabled={editMode.section !== null}
                      >
                        <FaPlus /> Add FAQ
                      </button>
                    </div>
                  </div>
                  
                  {editMode.section === 'faq' && editMode.id === category.id && (
                    <div className="edit-form faq-form">
                      <div className="form-group">
                        <label htmlFor="faq-question">Question</label>
                        <input
                          id="faq-question"
                          type="text"
                          value={faqForm.question}
                          onChange={(e) => setFaqForm({...faqForm, question: e.target.value})}
                          placeholder="Enter FAQ question"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="faq-answer">Answer</label>
                        <textarea
                          id="faq-answer"
                          value={faqForm.answer}
                          onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})}
                          placeholder="Enter FAQ answer"
                          rows={5}
                        />
                      </div>
                      <div className="form-actions">
                        <button className="action-btn save-btn" onClick={handleSaveFaq}>
                          <FaSave /> Save
                        </button>
                        <button className="action-btn cancel-btn" onClick={handleCancel}>
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="faq-list">
                    {category.faqs?.length > 0 ? (
                      category.faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                          <div className="faq-content">
                            <h4>{faq.question}</h4>
                            <p>{faq.answer}</p>
                          </div>
                          <div className="faq-actions">
                            <button 
                              className="action-btn edit-btn"
                              onClick={() => handleEditFaq({...faq, _index: index}, category.id)}
                              disabled={editMode.section !== null}
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteFaq(category.id, index)}
                              disabled={editMode.section !== null}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-items">No FAQs added to this category yet.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">No FAQ categories added yet.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="admin-footer">
        <p>© 2025 ZappCart Admin | TAZATA BUTCHERS PRIVATE LIMITED</p>
      </footer>

      <style jsx>{`
        .admin-container {
          font-family: 'Arial', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px 60px;
          color: #333;
          position: relative;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #ddd;
          margin-bottom: 30px;
        }

        .admin-header h1 {
          margin: 0;
          font-size: 1.8rem;
          color: #1d3557;
        }

        .back-link {
          display: flex;
          align-items: center;
          color: #e63946;
          text-decoration: none;
          font-weight: 600;
        }

        .back-link svg {
          margin-right: 8px;
        }

        .admin-section {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 30px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .section-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #1d3557;
        }

        .preview-section {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
        }

        .preview-section h3 {
          margin-top: 0;
          color: #1d3557;
        }

        /* Form Styles */
        .edit-form {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group textarea {
          resize: vertical;
        }

        .form-group small {
          display: block;
          margin-top: 5px;
          color: #666;
          font-size: 12px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        /* Action Buttons */
        .action-btn {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn svg {
          margin-right: 6px;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .add-btn {
          background-color: #4caf50;
          color: white;
        }

        .add-btn:hover:not(:disabled) {
          background-color: #388e3c;
        }

        .edit-btn {
          background-color: #2196f3;
          color: white;
        }

        .edit-btn:hover:not(:disabled) {
          background-color: #1976d2;
        }

        .save-btn {
          background-color: #4caf50;
          color: white;
        }

        .save-btn:hover:not(:disabled) {
          background-color: #388e3c;
        }

        .cancel-btn {
          background-color: #f44336;
          color: white;
        }

        .cancel-btn:hover:not(:disabled) {
          background-color: #d32f2f;
        }

        .delete-btn {
          background-color: #f44336;
          color: white;
          padding: 8px;
        }

        .delete-btn:hover:not(:disabled) {
          background-color: #d32f2f;
        }

        /* Contact Methods */
        .contact-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .contact-item {
          border: 1px solid #eee;
          border-radius: 6px;
          padding: 15px;
          position: relative;
        }

        .contact-info h3 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #1d3557;
        }

        .contact-info p {
          margin: 5px 0;
          font-weight: 600;
        }

        .contact-info span {
          display: block;
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }

        .contact-actions {
          display: flex;
          gap: 8px;
          position: absolute;
          top: 15px;
          right: 15px;
        }

        /* Categories */
        .category-item {
          border: 1px solid #eee;
          border-radius: 6px;
          margin-bottom: 25px;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background-color: #f8f9fa;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          border-bottom: 1px solid #eee;
        }

        .category-header h3 {
          margin: 0;
          color: #1d3557;
        }

        .category-actions {
          display: flex;
          gap: 8px;
        }

        /* FAQs */
        .faq-list {
          padding: 15px;
        }

        .faq-item {
          border-bottom: 1px solid #eee;
          padding: 15px 0;
          position: relative;
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-content h4 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #1d3557;
          padding-right: 70px; /* Space for action buttons */
        }

        .faq-content p {
          margin: 0;
          color: #555;
        }

        .faq-actions {
          position: absolute;
          top: 15px;
          right: 0;
          display: flex;
          gap: 8px;
        }

        .faq-form {
          margin: 0 15px 15px;
        }

        /* No items message */
        .no-items {
          color: #666;
          font-style: italic;
          padding: 15px 0;
        }

        /* Loading and error states */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .spinner-icon {
          font-size: 3rem;
          color: #e63946;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-section, .error-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .error-section {
          background: #fef2f2;
          border-radius: 8px;
          border: 2px solid #fecaca;
        }

        .error-section h2 {
          color: #dc2626;
        }

        .admin-footer {
          text-align: center;
          padding: 20px 0;
          border-top: 1px solid #eee;
          color: #666;
          margin-top: 40px;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .admin-header h1 {
            margin-top: 15px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .section-header button {
            margin-top: 15px;
          }

          .contact-list {
            grid-template-columns: 1fr;
          }

          .category-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .category-actions {
            margin-top: 15px;
          }

          .faq-actions {
            position: static;
            margin-top: 10px;
          }

          .faq-content h4 {
            padding-right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Support;