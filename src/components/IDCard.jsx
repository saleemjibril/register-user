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
            <Text style={styles.value}>{userData.names}</Text>

            <Text style={styles.label}>ID NUMBER</Text>
            <Text style={styles.value}>{userData._id}</Text>

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

export default IDCard;