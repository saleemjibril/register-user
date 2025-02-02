import React, { useEffect, useState } from "react";
import { getUser, searchUser } from "../apis";
import { useNavigate, useParams } from "react-router-dom";
import IDCard from "../components/IDCard";
import moment from "moment";
import { pdf } from "@react-pdf/renderer";
import AdminLayout from "./admin/Layout";
import { useSelector } from "react-redux";


const DownloadIdCard = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate()

  const pathname = useParams();
  const [user, setUser] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if(!auth?.token) {
      navigate('/login');
    }
  }, [])



  const generatePdfBlob = async () => {
    const doc = <IDCard userData={user} image={user?.photo} qrCodeUrl={user?.qrCodeUrl} />;
    const asPdf = pdf([]);
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    return blob;
  };

  const handlePdf = async () => {
    try {
      const blob = await generatePdfBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${user?.names}${moment(Date.now()).format(
        "DD-MM-YYYY"
      )}_id_card.pdf`;
      link.click();

      const file = new File([blob], link.download, { type: "application/pdf" });

    } catch (error) {
      alert("Unable to download ID card");
      console.log("error creating certificate:", error);
      return {
        status: "error creating certificate",
        statusCode: 500,
      };
    }
  };

   const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchTerm) return;
  
      setSearchLoading(true);
      try {
        const response = await searchUser(searchTerm);
        if (response?.status === 200) {
          setUser(response.data);
        } else {
          if (response?.data?.message) {
            alert(response?.data?.message);
          } else {
            alert("No user found with this user id, email or phone number");
          }
        }
      } catch (error) {
        console.error("Error searching user:", error);
        alert("Error searching for user");
      } finally {
        setSearchLoading(false);
      }
    };


  return (
  <AdminLayout>
      <div className="id-display__container">

      <div className="id-generator__search">
            <form onSubmit={handleSearch} className="id-generator__search-form">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter user id, email or phone number"
                className="id-generator__form-input"
                disabled={searchLoading}
                required
              />
              <br />
              <br />
              <button
                type="submit"
                className="id-generator__actions-register"
                disabled={searchLoading || !searchTerm}
              >
                {searchLoading ? "Searching..." : "Search User"}
              </button>
            </form>
          </div>

          <div className="id-display__card">
        <div className="id-display__content">
          <div className="id-display__header">
            <h1 className="id-display__header-title">TRACTRAC</h1>
          </div>

          <div className="id-display__info">
            <div className="id-display__photo">
              <img
                src={user?.photo}
                alt={user?.names}
                className="id-display__photo-image"
              />
            </div>

            <div className="id-display__details">
              <div className="id-display__details-group">
                <label className="id-display__details-label">FULL NAME</label>
                <p className="id-display__details-value">{user?.names}</p>
              </div>

              <div className="id-display__details-group">
                <label className="id-display__details-label">ID NUMBER</label>
                <p className="id-display__details-value">{user?.userId}</p>
              </div>

              <div className="id-display__details-group">
                <label className="id-display__details-label">ISSUED DATE</label>
                <p className="id-display__details-value">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="id-display__footer">
            <div className="id-display__footer-text">
              <p>This ID card is property of TracTrac.</p>
              <p>If found, please return to nearest office.</p>
            </div>
            <div className="id-display__footer-qr">
              <img
                src={user?.qrCodeUrl}
                alt="QR Code"
                className="id-display__footer-qr-code"
              />
            </div>
          </div>

          <div className="id-generator__actions">
            <button
              className="id-generator__actions-download"
              onClick={handlePdf}
            >
              Download ID card
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
};

export default DownloadIdCard;
