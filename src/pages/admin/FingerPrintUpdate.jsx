import React, { useState, useEffect, useCallback } from "react";
import { getUser } from "../../apis";
import { useParams, useLocation } from "react-router-dom";
import FingerprintScannerComponent from "../../components/finger";
import AdminLayout from "./Layout";

const FingerPrintUpdate = () => {
  const params = useParams();
  const location = useLocation();
  
  console.log('Current pathname:', location.pathname);
  console.log('Params:', params);
  console.log('ID from params:', params.id);

  const [user, setUser] = useState("");

  const handleGetUser = async () => {
    console.log('Calling getUser with ID:', params.id);
    try {
      const response = await getUser(params.id);
      console.log('API Response:', response);
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

  console.log('Current user state:', user);

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