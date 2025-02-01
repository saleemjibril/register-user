import React, { useState, useEffect, useCallback } from "react";
import { getUser } from "../../apis";
import { useParams, useLocation } from "react-router-dom";
import FingerprintScannerComponent from "../../components/finger";
import AdminLayout from "./Layout";

const FingerPrintUpdate = () => {
  const params = useParams();
  const location = useLocation();
  


  const [user, setUser] = useState("");

  const handleGetUser = async () => {
    try {
      const response = await getUser(params.id);
      if (response?.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, [params.id]);


  return (
    <AdminLayout>
      <div className="fingerprint__container p-4">
      <div className="id-generator__header">
        <h2 className="id-generator__header-title">Upload Fingerprints</h2>
        <p className="id-generator__header-subtitle">
          Update trainee finger print
        </p>
      </div>

      <br />
      <br />

      <FingerprintScannerComponent user={user} />
    </div>
    </AdminLayout>
  );
};

export default FingerPrintUpdate;