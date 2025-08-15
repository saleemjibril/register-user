import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { brandTypes, storageLocations } from "../utils/padData";

const PadDistributionModal = ({ open, onClose, selectedStorageLocation, setSelectedStorageLocation, selectedBrand, setselectedBrand, loading, onViewClick }) => {
  const pathname = useParams();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={`modal-status success`}>
          <h3 className="modal-title">Select pad brand</h3>
          <select
            name=""
            id=""
            className="id-generator__form-input"
            value={selectedBrand}
            onChange={(e) => setselectedBrand(e.target.value)}
          >
            <option value="">Select pad brand/type</option>
            {brandTypes.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <br />
          <br />
          <h3 className="modal-title">Select storage location</h3>
          <select
            name=""
            id=""
            className="id-generator__form-input"
            value={selectedStorageLocation}
            onChange={(e) => setSelectedStorageLocation(e.target.value)}
          >
                        <option value="">Select storage location</option>
                  {storageLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
          </select>
          <br />
          <br />
          <button className="id-generator__actions-register" onClick={onClose} disabled={loading}>
            {loading ? "Loading..." : "Enter"}
          </button>
          <br />
          <br />
          {/* <button className="id-generator__actions-register" onClick={onViewClick}>
            View Attendance
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default PadDistributionModal;
