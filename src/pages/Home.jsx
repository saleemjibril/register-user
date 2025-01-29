import React, { useState, useEffect, useRef } from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  PDFDownloadLink,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import { createUser, updateUser } from "../apis";
import fileUpload from "../utils/fileUpload";
import { Badge } from "@mui/material";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 20,
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 20,
    border: "2px solid #e9ecef",
  },
  header: {
    flexDirection: "row",
    marginBottom: 30,
    borderBottom: "2px solid #dee2e6",
    paddingBottom: 15,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a73e8",
  },
  mainContent: {
    flexDirection: "row",
    marginBottom: 30,
  },
  photoSection: {
    width: "35%",
    objectFit: "cover",
  },
  photo: {
    width: 180,
    height: 180,
    borderRadius: 8,
    border: "3px solid #dee2e6",
    objectFit: "cover",
  },
  infoSection: {
    width: "65%",
    paddingLeft: 30,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: "#212529",
    marginBottom: 20,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 15,
    borderTop: "2px solid #dee2e6",
  },
  qrCode: {
    width: 100,
    height: 100,
  },
  footerText: {
    fontSize: 10,
    color: "#6c757d",
  },
});

const IDCard = ({ userData, image, qrCodeUrl }) => (
  <Document>
    <Page size={[600, 400]} style={styles.page}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.logo}>Unknown Company</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.photoSection}>
            <Image src={image} style={styles.photo} />
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>FULL NAME</Text>
            <Text style={styles.value}>{userData.name}</Text>

            <Text style={styles.label}>ID NUMBER</Text>
            <Text style={styles.value}>{userData.id}</Text>

            <Text style={styles.label}>ISSUED DATE</Text>
            <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerText}>
              This ID card is property of Unknown Company
            </Text>
            <Text style={styles.footerText}>
              If found, please return to nearest office.
            </Text>
          </View>
          <Image src={qrCodeUrl} style={styles.qrCode} />
        </View>
      </View>
    </Page>
  </Document>
);

const IDCardGenerator = () => {
  const [userData, setUserData] = useState({
    name: "",
    id: "",
    photo: "",
  });
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const mediaRef = useRef(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    setLoading(true);
    const response = await createUser({
      name,
      photo: image,
    });

    if (response?.data?.user?._id) {
      setUserData({
        name: response?.data?.user?.name,
        id: response?.data?.user?._id,
      });
      const userUrl = `https://register-user-one.vercel.app/user/${response?.data?.user?._id}`;
      const tempQr = await QRCode.toDataURL(userUrl);

      const response2 = await updateUser(response?.data?.user?._id, {
        qrCodeUrl: tempQr,
      });

      console.log("response2", response2);

      if (response2?.status === 200) {
        setQrCodeUrl(tempQr);
      }
    } else {
      alert("Trainee to registration failed");
    }

    setLoading(false);
  };

  const generatePdfBlob = async () => {
    const doc = (
      <IDCard userData={userData} image={image} qrCodeUrl={qrCodeUrl} />
    );
    const asPdf = pdf([]);
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    return blob;
  };

  const handlePdf = async () => {
    try {
      // setLoading(true)
      const blob = await generatePdfBlob();

      // For downloading
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      link.download = `${name}${moment(Date.now()).format(
        "DD-MM-YYYY"
      )}_id_card.pdf`;
      link.click();

      // For uploading
      const file = new File(
        [blob],
        (link.download = `${name}${moment(Date.now()).format(
          "DD-MM-YYYY"
        )}_id_card.pdf`),
        { type: "application/pdf" }
      );

      setName("");
      setImage("");
      setQrCodeUrl("")
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
    <div className="id-generator">
      <div className="id-generator__container">
        <div className="id-generator__header">
          <h2 className="id-generator__header-title">Register Trainee</h2>
          <p className="id-generator__header-subtitle">
            Enter user details to register trainee and generate an ID card
          </p>
        </div>

        <div className="id-generator__form">
          <div className="id-generator__form-group">
            <label className="id-generator__form-label">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="id-generator__form-input"
            />
          </div>

          <div className="id-generator__form-group">
            <label className="id-generator__form-label">Profile Photo</label>
            <div className="id-generator__photo-upload">
             <label>
             <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  fileUpload(e?.target?.files[0], setImage, setImageLoading)
                }
                ref={mediaRef}
              />
              <div 
                className={`id-generator__photo-button ${
                  imageLoading ? 'id-generator__photo-button--loading' : ''
                }`}
              >
                {imageLoading ? "Uploading..." : "Upload Photo"}
              </div>

             </label>
              {image && (
                <Badge
                  overlap="circular"
                  onClick={() => setImage("")}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  badgeContent={
                    <div className="id-generator__photo-remove">
                      {/* ... SVG content ... */}
                    </div>
                  }
                >
                  <div className="id-generator__photo-preview">
                    <div className="id-generator__photo-preview-container">
                      <img
                        src={image}
                        alt="Preview"
                        className="id-generator__photo-preview-image"
                      />
                    </div>
                    {imageLoading && (
                      <div className="id-generator__photo-preview-loading">
                        <div className="id-generator__photo-preview-loading-spinner" />
                      </div>
                    )}
                  </div>
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="id-generator__actions">
          {name && image && (
            <button
              onClick={handleCreateUser}
              className="id-generator__actions-register"
              disabled={loading}
            >
              {loading ? "Loading..." : "Register Trainee"}
            </button>
          )}

          {name && image && qrCodeUrl && (
            <button
              className="id-generator__actions-download"
              disabled={loading}
              onClick={handlePdf}
            >
              {loading ? "Generating PDF..." : "Download PDF"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDCardGenerator;
