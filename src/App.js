import React, { useState, useEffect } from "react";
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
import { createUser, updateUser } from "./apis";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 30,
  },
  container: {
    flexDirection: "row",
    marginBottom: 20,
  },
  photoSection: {
    width: "40%",
    padding: 10,
  },
  infoSection: {
    width: "60%",
    padding: 10,
  },
  photo: {
    width: 200,
    height: 200,
    objectFit: "cover",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  qrCode: {
    width: 150,
    height: 150,
    marginTop: 20,
  },
});

const IDCard = ({ userData, qrCodeUrl }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.photoSection}>
          <Image src={userData.photo} style={styles.photo} />
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.title}>ID Card</Text>
          <Text style={styles.text}>Name: {userData.name}</Text>
          <Text style={styles.text}>ID: {userData.id}</Text>
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <Image src={qrCodeUrl} style={styles.qrCode} />
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


  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async () => {
    const response = await createUser({
      name: userData?.name,
      photo: userData?.photo,
    });

    if (response?.data?.user?._id) {
      setUserData({
        ...userData,
        id: response?.data?.user?._id,
      });
      const userUrl = `https://user-register.com/${response?.data?.user?._id}`;
      const tempQr = await QRCode.toDataURL(userUrl);

      const response2 = await updateUser(response?.data?.user?._id, {
        qrCodeUrl: tempQr,
      });

      if(response2?.status === 200) {
        setQrCodeUrl(tempQr)
      }

      console.log("response2", response2);
    }

    console.log("response", response);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="space-y-4 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="photo"
          placeholder="Photo URL"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {userData.name && userData.photo && (
        <button onClick={handleCreateUser}>Upload user</button>
      )}
      {userData.name && userData.photo && qrCodeUrl && (
        <PDFDownloadLink
          document={<IDCard userData={userData} qrCodeUrl={qrCodeUrl} />}
          fileName={`${userData.id}_card.pdf`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default IDCardGenerator;
