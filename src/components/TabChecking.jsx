import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const TabChecking = ({ open, loading, onCheckIn, onCheckOut }) => {
  const pathname = useParams();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={`modal-status success`}>
          <h3 className="modal-title-big">Tab Checking</h3>
       
          <button className="id-generator__actions-register-big" onClick={onCheckIn} disabled={loading}>
            {loading ? "Loading..." : "Check In"}
          </button>
          <br />
          <br />
          <button className="id-generator__actions-register-big" onClick={onCheckOut} disabled={loading}>
            {loading ? "Loading..." : "Check Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabChecking;
