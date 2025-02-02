import React, { useState, useEffect, useCallback } from "react";
import { getUser } from "../../apis";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FingerprintScannerComponent from "../../components/finger";
import AdminLayout from "./Layout";
import { useSelector } from "react-redux";

const FingerPrintUpdate = () => {

  const navigate = useNavigate()
  const auth = useSelector((state) => state.auth);


  const params = useParams();
  const location = useLocation();
  


  const [user, setUser] = useState("");


  useEffect(() => {
    if(!auth?.token) {
      navigate('/login');
    }
  }, [])

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