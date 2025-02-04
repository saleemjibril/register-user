import { useEffect, useRef, useState } from "react";
import { Badge } from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import fileUpload from "../utils/fileUpload";
import QRCode from "qrcode";
import { searchUser, updateUser } from "../apis";
import AdminLayout from "./admin/Layout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PhotoUploadForm = () => {
  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [credentialLoading, setCredentialLoading] = useState(false);
  const [credentials, setCredentials] = useState("");
  const [fileName, setFileName] = useState("");
  const mediaRef = useRef(null);

  useEffect(() => {
    if(!auth?.token) {
      navigate('/login');
    }
  }, [])



  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setSearchLoading(true);
    try {
      const response = await searchUser(searchTerm);
      if (response?.status === 200) {
        

        setUser(response?.data);
        setFileName(response?.data?.credentials?.name);
        setImage(response?.data?.photo || "");
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

  const handlePhotoSubmit = async () => {
    setLoading(true);
    try {
      const userUrl = `https://issam.tractrac.co/admin/view-user/${user?._id}`;
      const tempQr = await QRCode.toDataURL(userUrl);

      const response = await updateUser(user?._id, {
        photo: image,
        qrCodeUrl: tempQr,
        credentials: {
          url: credentials,
          name: fileName
        }
      });


      if (response?.status === 200) {
        alert("Details updated successfully")
        navigate(`/admin/view-user/${user?._id}`);
      } else {
        alert("image upload failed");
      }
    } catch (error) {
      console.error("Error updating photo:", error);
      alert("Error uploading photo");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };


  return (
    <AdminLayout>
      <div className="id-generator">
        <div className="id-generator__container">
          <div className="id-generator__header">
            <h2 className="id-generator__header-title">Upload Image & Credentials</h2>
            <p className="id-generator__header-subtitle">
              Search for a user to upload their image & credentials
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
          {user && (
            <div className="id-generator__content">
              <div className="id-generator__photo">
                <div className="id-generator__photo-preview">
                  <div className="id-generator__photo-preview-container">
                    {image && (
                      <Badge
                        overlap="circular"
                        onClick={() => setImage("")}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        badgeContent={
                          <div className="id-generator__photo-remove">
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
                          </div>
                        }
                      >
                        <div className="id-generator__photo-preview">
                          <div className="id-generator__photo-preview-container">
                            <img
                              src={image}
                              alt=""
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

                <label className="id-generator__photo-upload">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      fileUpload(e?.target?.files[0], setImage, setImageLoading)
                    }
                    ref={mediaRef}
                  />
                  {!image && (
                    <div
                      className={`id-generator__photo-button ${
                        imageLoading
                          ? "id-generator__photo-button--loading"
                          : ""
                      }`}
                    >
                      {imageLoading ? "Uploading..." : "Upload Photo"}
                    </div>
                  )}
                </label>
              </div>

              <div className="id-generator__credentials">
            <form onSubmit={handleSearch} className="id-generator__credentials-form">
              <input
                type="text"
                value={fileName}
                // onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="File name"
                className="id-generator__form-input"
                disabled
                required
              />
              <br />
              <br />
              <label>

              <div
                type="submit"
                className="id-generator__actions-register id-generator__credentials-form__button"
                disabled={credentialLoading}
              >
                {credentialLoading ? "Uploading..." : "Upload credential"}
              </div>

              <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) =>
                    {
                      setFileName(e?.target?.files[0]?.name)
                      fileUpload(e?.target?.files[0], setCredentials, setCredentialLoading)
                    }
                    }
                    ref={mediaRef}
                  />
              </label>
              
            </form>
          </div>

              <div className="id-generator__form-grid">
                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">User ID</label>
                  <div className="id-generator__form-value">{user?.userId}</div>
                </div>
                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Full Name</label>
                  <div className="id-generator__form-value">{user?.names}</div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Email</label>
                  <div className="id-generator__form-value">{user?.email}</div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Credentials</label>
                  <div className="id-generator__form-value">
                  {user?.credentials?.url && <button className="id-generator__actions-register"
                  onClick={() => window.open(user?.credentials?.url, '_blank', 'noopener,noreferrer')}
                  >View credentials</button>}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Community</label>
                  <div className="id-generator__form-value">
                    {user?.community}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Limited</label>
                  <div className="id-generator__form-value">
                    {user?.limited}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">District</label>
                  <div className="id-generator__form-value">
                    {user?.district}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">LGA</label>
                  <div className="id-generator__form-value">{user?.lga}</div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">State</label>
                  <div className="id-generator__form-value">{user?.state}</div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">
                    Phone Number
                  </label>
                  <div className="id-generator__form-value">
                    {user?.phoneNumber}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Age</label>
                  <div className="id-generator__form-value">{user?.age}</div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Sex</label>
                  <div className="id-generator__form-value">{user?.sex}</div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">
                    Degree Qualifications
                  </label>
                  <div className="id-generator__form-value">
                    {user?.degreeQualifications}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Languages</label>
                  <div className="id-generator__form-value">
                    {user?.languagesSpokenAndWritten}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Disability</label>
                  <div className="id-generator__form-value">
                    {user?.disability}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Religion</label>
                  <div className="id-generator__form-value">
                    {user?.religion}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">
                    Birth Certificate
                  </label>
                  <div className="id-generator__form-value">
                    {user?.birthCertificateCheck}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">ID Type</label>
                  <div className="id-generator__form-value">{user?.idType}</div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">ID Number</label>
                  <div className="id-generator__form-value">
                    {user?.idNumber}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">
                    Qualification
                  </label>
                  <div className="id-generator__form-value">
                    {user?.qualification}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">
                    Physical Fitness
                  </label>
                  <div className="id-generator__form-value">
                    {user?.physicalFitness}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">
                    Availability
                  </label>
                  <div className="id-generator__form-value">
                    {user?.availability}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">
                    Health Condition
                  </label>
                  <div className="id-generator__form-value">
                    {user?.preExistingHealthCondition}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">
                    Nursing Mother
                  </label>
                  <div className="id-generator__form-value">
                    {user?.nursingMother}
                  </div>
                </div>

                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">Remark</label>
                  <div className="id-generator__form-value">{user?.remark}</div>
                </div>
              </div>
            </div>
          )}

          <div className="id-generator__actions">
            {image && (
              <button
                onClick={handlePhotoSubmit}
                className="id-generator__actions-register"
                disabled={loading || imageLoading}
              >
                {loading ? "Submitting..." : "Submit details"}
              </button>
            )}

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PhotoUploadForm;
