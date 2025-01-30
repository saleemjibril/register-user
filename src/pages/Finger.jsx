import React, { useState } from "react";
import { searchUser } from "../apis";
import FingerprintScannerComponent from "../components/finger";
import AdminLayout from "./admin/Layout";

const FingerprintScanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [image, setImage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setSearchLoading(true);
    try {
      // Assuming searchUser API accepts email or phone and returns user data
      const response = await searchUser(searchTerm);
      console.log("searchUser", response);
      if (response?.status === 200) {
        //   console.log("response?.data?.leftFingerPrint", response?.data?.leftFingerPrint);

        setUser(response.data);
        setImage(response?.data?.photo);
        //   setLeftFingerPrint(response?.data?.leftFingerPrint)
        //   setRightFingerPrint(response?.data?.rightFingerPrint)
        // Reset other states when new user is found
        //   setQrCodeUrl("");
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
      <div className="fingerprint__container p-4">
        <div className="id-generator__header">
          <h2 className="id-generator__header-title">Upload Fingerprints</h2>
          <p className="id-generator__header-subtitle">
            Search for a trainee to upload their fingerprint
          </p>
        </div>

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

        <br />
        <br />

        <FingerprintScannerComponent user={user} />
      </div>
    </AdminLayout>
  );
};

export default FingerprintScanner;
