import React, { useEffect, useState } from "react";
import { getUser } from "../apis";
import { useParams } from "react-router-dom";
import IDCard from "../components/IDCard";
import moment from "moment";
import { pdf } from "@react-pdf/renderer";
import AdminLayout from "./admin/Layout";


const IDCardDisplay = () => {
  const pathname = useParams();
  const [user, setUser] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handleGetUser = async () => {
    const response = await getUser(pathname?.id);
    setUser(response?.data);
  };

  useEffect(() => {
    handleGetUser();
  }, []);

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

  return (
  <AdminLayout>
      <div className="id-display__container">
      <div className="id-display__card">
        <div className="id-display__content">
          <div className="id-display__header">
            <h1 className="id-display__header-title">COMPANY-NAME</h1>
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
              <p>This ID card is property of Company Name.</p>
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

export default IDCardDisplay;
