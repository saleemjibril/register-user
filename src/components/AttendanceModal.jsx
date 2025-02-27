import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const AttendanceModal = ({ open, onClose, subject, setSubject, loading, onViewClick }) => {
  const pathname = useParams();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={`modal-status success`}>
          <h3 className="modal-title">Select class</h3>
          <select
            name=""
            id=""
            className="id-generator__form-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select class</option>
            <option value="Welcome & Orientation">Welcome & Orientation</option>
            <option value="Pre-Test: Baseline Knowledge Assessment">Pre-Test: Baseline Knowledge Assessment</option>
            <option value="Co-operative Group Meetings">Co-operative Group Meetings</option>
            <option value="Team building">Team building</option>
            <option value="Group & Communication Dynamics">Group & Communication Dynamics</option>
            <option value="Value chain management and Agronomic">Value chain management and Agronomic</option>
            <option value="Project Management">Project Management</option>
            <option value="MERL">MERL</option>
            <option value="Introduction to Tractrac Plus Platform">Introduction to Tractrac Plus Platform</option>
            <option value="Business Development">Business Development</option>
            <option value="Tractor Operations">Tractor Operations</option>
            <option value="Rural Entrepreneurship">Rural Entrepreneurship</option>
            <option value="Recap, Review and Exam">Recap, Review and Exam</option>
            <option value="Award Ceremony & Certificates">Award Ceremony & Certificates</option>
          </select>
          <br />
          <br />
          <button className="id-generator__actions-register" onClick={onClose} disabled={loading}>
            {loading ? "Loading..." : "Enter"}
          </button>
          <br />
          <br />
          <button className="id-generator__actions-register" onClick={onViewClick}>
            View Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
