import React, { useState, useEffect, useRef } from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  PDFDownloadLink,
  StyleSheet,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import { createUser, updateUser } from "../apis";
import fileUpload from "../utils/fileUpload";
import { Badge } from "@mui/material";

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
    objectFit: "cover"
  },
  photo: {
    width: 180,
    height: 180,
    borderRadius: 8,
    border: "3px solid #dee2e6",
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
  }
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
            <Text style={styles.footerText}>This ID card is property of Unknown Company</Text>
            <Text style={styles.footerText}>If found, please return to nearest office.</Text>
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
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const mediaRef = useRef(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async () => {
    setLoading(true)
    const response = await createUser({
      name: userData?.name,
      photo: image,
    });

    if (response?.data?.user?._id) {
      setUserData({
        ...userData,
        id: response?.data?.user?._id,
      });
      const userUrl = `https://register-user-one.vercel.app/user/${response?.data?.user?._id}`;
      const tempQr = await QRCode.toDataURL(userUrl);

      const response2 = await updateUser(response?.data?.user?._id, {
        qrCodeUrl: tempQr,
      });

      if(response2?.status === 200) {
        setQrCodeUrl(tempQr)
      }

    }

    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <div className="mb-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">Register Trainee</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter user details to register trainee and generate an ID card
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
          <label className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => fileUpload(e?.target?.files[0], setImage, setImageLoading)}
              ref={mediaRef}
            />
            <div
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                imageLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              }`}
            >
              {imageLoading ? "Uploading..." : "Upload Photo"}
            </div>

            {image && (
               <Badge
               overlap="circular"
               onClick={() => setImage("")}
               anchorOrigin={{ vertical: "top", horizontal: "right" }}
               badgeContent={
                 <svg
                   width="24"
                   height="24"
                   viewBox="0 0 24 24"
                   fill="none"
                   xmlns="http://www.w3.org/2000/svg"
                 >
                   <path
                     d="M21.12 6.98L17.02 2.88C16.54 2.4 15.58 2 14.9 2H9.1C8.42 2 7.46 2.4 6.98 2.88L2.88 6.98C2.4 7.46 2 8.42 2 9.1V14.9C2 15.58 2.4 16.54 2.88 17.02L6.98 21.12C7.46 21.6 8.42 22 9.1 22H14.9C15.58 22 16.54 21.6 17.02 21.12L21.12 17.02C21.6 16.54 22 15.58 22 14.9V9.1C22 8.42 21.6 7.46 21.12 6.98ZM16.03 14.97C16.32 15.26 16.32 15.74 16.03 16.03C15.88 16.18 15.69 16.25 15.5 16.25C15.31 16.25 15.12 16.18 14.97 16.03L12 13.06L9.03 16.03C8.88 16.18 8.69 16.25 8.5 16.25C8.31 16.25 8.12 16.18 7.97 16.03C7.68 15.74 7.68 15.26 7.97 14.97L10.94 12L7.97 9.03C7.68 8.74 7.68 8.26 7.97 7.97C8.26 7.68 8.74 7.68 9.03 7.97L12 10.94L14.97 7.97C15.26 7.68 15.74 7.68 16.03 7.97C16.32 8.26 16.32 8.74 16.03 9.03L13.06 12L16.03 14.97Z"
                     fill="red"
                   />
                 </svg>
               }
             >
              <div className="mt-4 relative">
                <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>
              </Badge>
            )}
          </label>
        </div>
      </div>

      <div className="mt-8 space-x-4 flex justify-center">
        {userData.name && image && (
          <button
            onClick={handleCreateUser}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={loading}          
          >
            {loading ? "Loading..." : "Register Trainee"}
          </button>
        )}
        
        {userData.name && image && qrCodeUrl && (
          <PDFDownloadLink
            document={<IDCard userData={userData} image={image} qrCodeUrl={qrCodeUrl} />}
            fileName={`${userData.name}_id_card.pdf`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  </div>
  );
};

export default IDCardGenerator;
