import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import Image1 from "../assets/logo.png";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 10,
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    padding: 15,
    display: "flex",
    alignItems: "center",
  },
  header: {
    marginBottom: 15,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 30,
    marginBottom: 10,
    // Add these properties for better SVG handling
    objectFit: "contain",
    preserveAspectRatio: "xMidYMid meet",
  },
  photoContainer: {
    marginBottom: 15,
  width: 105,
  height: 105,
  display: "flex",
  alignItems: "center",
  // Add a wrapper div with background color to create border effect
  padding: 2,  // This creates the border width
  backgroundColor: "#000", // This creates the border color
  borderRadius: 4,

  },
  photo: {
    width: 100,
  height: 100,
  borderRadius: 2,
  objectFit: "cover",
  backgroundColor: "#fff", // Add this to ensure clean background
  },
  infoSection: {
    width: "100%",
    textAlign: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "capitalize"
  },
  title: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    textTransform: "capitalize"
  },
  website: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
    textTransform: "capitalize"
  },
  // New styles for back of card
  backCard: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    padding: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  qrCode: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  disclaimer: {
    width: "100%",  // Add this to ensure full width
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    marginTop: "auto",
    padding: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",  // Add this to stack text vertically
  },
  
  disclaimerText: {
    marginBottom: 3,
    textAlign: "center",  // Add explicit text alignment
    alignSelf: "center",  // Add this to center each text element
  }
});

const IDCard = ({ userData, image, qrCodeUrl }) => (
  <Document>
    {/* Front of card */}
    <Page size={[250, 280]} style={styles.page}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image src={Image1} style={styles.logo} />
        </View>
        
        <View style={styles.photoContainer}>
          <Image src={image} style={styles.photo} />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.name}>{userData.names}</Text>
          <Text style={styles.title}>{userData.userId}</Text>
          <Text style={styles.website}>{userData.lga}</Text>
          {/* <Text style={styles.website}>{userData.names}</Text> */}
        </View>
      </View>
    </Page>

    {/* Back of card */}
    <Page size={[250, 280]} style={styles.page}>
      <View style={styles.backCard}>
      <View style={styles.header}>
          <Image src={Image1} style={styles.logo} />
        </View>
        <View style={styles.qrContainer}>
          <Image src={qrCodeUrl} style={styles.qrCode} />
        </View>
        
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This ID card is property of TracTrac.
          </Text>
          <Text style={styles.disclaimerText}>
            If found, please return to nearest office.
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default IDCard;