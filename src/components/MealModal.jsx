import React from 'react';

const MealModal = ({ isOpen, message, success, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={`modal-status ${success ? 'success' : 'error'}`}>
          <div className="modal-icon">
            {success ? '✓' : '×'}
          </div>
          <h3 className="modal-title">
            {success ? 'Success' : 'Notice'}
          </h3>
          <p className="modal-message">{message}</p>
          <button className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealModal;