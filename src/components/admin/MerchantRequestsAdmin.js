// src/components/admin/MerchantRequestsAdmin.js
import React, { useState, useEffect } from 'react';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '../../firebase/config';
import { FaCheckCircle, FaTimesCircle, FaEnvelope, FaPhone, FaSearch, FaFilter } from 'react-icons/fa';
import '../../styles/components/admin/MerchantRequestsAdmin.css';

const MerchantRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const merchantRequestsRef = ref(db, 'merchantRequests');
    
    const unsubscribe = onValue(merchantRequestsRef, (snapshot) => {
      setLoading(true);
      try {
        if (snapshot.exists()) {
          const requestsData = [];
          snapshot.forEach((childSnapshot) => {
            requestsData.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          
          // Sort by creation date (newest first)
          requestsData.sort((a, b) => {
            return (b.createdAt || 0) - (a.createdAt || 0);
          });
          
          setRequests(requestsData);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error('Error processing merchant requests data:', err);
        setError('Failed to load merchant requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error('Error fetching merchant requests:', err);
      setError('Failed to load merchant requests. Please try again later.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAccept = async (id) => {
    if (processing) return;
    
    setProcessing(id);
    setError(null);
    
    try {
      const requestRef = ref(db, `merchantRequests/${id}`);
      await update(requestRef, {
        status: 'approved',
        updatedAt: new Date().toISOString(),
      });
      // Normally you would send an email notification here
    } catch (err) {
      console.error("Error accepting merchant:", err);
      setError("Failed to accept merchant. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  const handleShowRejectForm = (id) => {
    setShowRejectForm(id);
    setRejectionReason('');
  };

  const handleCancelReject = () => {
    setShowRejectForm(null);
    setRejectionReason('');
  };

  const handleReject = async (id) => {
    if (processing || !rejectionReason.trim()) return;
    
    setProcessing(id);
    setError(null);
    
    try {
      const requestRef = ref(db, `merchantRequests/${id}`);
      await update(requestRef, {
        status: 'rejected',
        rejectionReason: rejectionReason,
        updatedAt: new Date().toISOString(),
      });
      // Normally you would send an email notification here
      setShowRejectForm(null);
      setRejectionReason('');
    } catch (err) {
      console.error("Error rejecting merchant:", err);
      setError("Failed to reject merchant. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id) => {
    if (processing) return;
    
    if (!window.confirm("Are you sure you want to delete this merchant request?")) {
      return;
    }
    
    setProcessing(id);
    setError(null);
    
    try {
      const requestRef = ref(db, `merchantRequests/${id}`);
      await remove(requestRef);
    } catch (err) {
      console.error("Error deleting merchant request:", err);
      setError("Failed to delete merchant request. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp) 
      : new Date(timestamp);
      
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredRequests = () => {
    let filtered = requests;
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(request => request.status === filter);
    }
    
    // Apply search filter if there's a search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(request => 
        request.vendorName?.toLowerCase().includes(term) ||
        request.email?.toLowerCase().includes(term) ||
        request.phoneNumber?.includes(term) ||
        request.address?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0
    };
    
    requests.forEach(request => {
      if (counts.hasOwnProperty(request.status)) {
        counts[request.status]++;
      }
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();
  const filteredRequests = getFilteredRequests();

  return (
    <div className="merchant-requests-admin">
      <div className="admin-header">
        <h2>Merchant Requests</h2>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="status-summary">
        <div className="summary-card pending">
          <h3>Pending</h3>
          <span className="count">{statusCounts.pending}</span>
        </div>
        <div className="summary-card approved">
          <h3>Approved</h3>
          <span className="count">{statusCounts.approved}</span>
        </div>
        <div className="summary-card rejected">
          <h3>Rejected</h3>
          <span className="count">{statusCounts.rejected}</span>
        </div>
      </div>
      
      <div className="filters-container">
        <div className="filter-label">
          <FaFilter /> Filter:
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({requests.length})
          </button>
          <button 
            className={`filter-button pending ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({statusCounts.pending})
          </button>
          <button 
            className={`filter-button approved ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({statusCounts.approved})
          </button>
          <button 
            className={`filter-button rejected ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({statusCounts.rejected})
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading merchant requests...</p>
        </div>
      ) : (
        <div className="merchant-requests-list">
          {filteredRequests.length === 0 ? (
            <div className="no-results">
              {searchTerm 
                ? "No merchant requests match your search." 
                : filter !== 'all' 
                  ? `No ${filter} merchant requests found.` 
                  : "No merchant requests found."}
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div 
                key={request.id} 
                className={`request-card ${request.status === 'approved' ? 'approved' : ''} ${request.status === 'rejected' ? 'rejected' : ''}`}
              >
                <div className="request-header" onClick={() => toggleExpand(request.id)}>
                  <div className="request-business">
                    <h3>{request.vendorName}</h3>
                    <span className={`status-badge ${request.status}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <div className="request-meta">
                    <span className="request-date">
                      Submitted: {formatDate(request.createdAt)}
                    </span>
                    <span className="expand-icon">
                      {expandedId === request.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
                
                {expandedId === request.id && (
                  <div className="request-details">
                    <div className="detail-group">
                      <strong>Business Address:</strong>
                      <p>{request.address}</p>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-group">
                        <strong>Contact:</strong>
                        <p>
                          <FaPhone className="icon" /> {request.phoneNumber}
                          <br />
                          <FaEnvelope className="icon" /> {request.email}
                        </p>
                      </div>
                      
                      <div className="detail-group">
                        <strong>Additional Information:</strong>
                        <p>{request.message || 'None provided'}</p>
                      </div>
                    </div>
                    
                    {request.status === 'rejected' && request.rejectionReason && (
                      <div className="rejection-reason">
                        <strong>Rejection Reason:</strong>
                        <p>{request.rejectionReason}</p>
                      </div>
                    )}
                    
                    {request.status === 'pending' && (
                      <div className="action-buttons">
                        <button 
                          className="accept-button"
                          onClick={() => handleAccept(request.id)}
                          disabled={processing === request.id}
                        >
                          <FaCheckCircle /> Accept
                        </button>
                        
                        <button 
                          className="reject-button"
                          onClick={() => handleShowRejectForm(request.id)}
                          disabled={processing === request.id}
                        >
                          <FaTimesCircle /> Reject
                        </button>
                        
                        <button 
                          className="delete-button"
                          onClick={() => handleDelete(request.id)}
                          disabled={processing === request.id}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    
                    {(request.status === 'approved' || request.status === 'rejected') && (
                      <div className="action-buttons">
                        <button 
                          className="delete-button"
                          onClick={() => handleDelete(request.id)}
                          disabled={processing === request.id}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {showRejectForm === request.id && (
                  <div className="reject-form">
                    <h4>Provide Rejection Reason</h4>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejection"
                      rows="3"
                      required
                    />
                    <div className="reject-form-buttons">
                      <button 
                        className="confirm-reject-button"
                        onClick={() => handleReject(request.id)}
                        disabled={processing === request.id || !rejectionReason.trim()}
                      >
                        Confirm Rejection
                      </button>
                      <button 
                        className="cancel-button"
                        onClick={handleCancelReject}
                        disabled={processing === request.id}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MerchantRequestsAdmin;