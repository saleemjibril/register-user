import { useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import moment from "moment";
import QRCode from "qrcode";
import { getUser, updateUser } from "../../apis";
import { Link, useParams } from "react-router-dom";
import IDCard from "../../components/IDCard";
import fileUpload from "../../utils/fileUpload";
import AdminLayout from "./Layout";

const User = () => {
  const pathname = useParams();

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const mediaRef = useRef(null);

  const handleGetUser = async () => {
    setLoading(true);
    const response = await getUser(pathname?.id);
    setImage(response?.data?.photo);
    setUser(response?.data);
    setQrCodeUrl(response?.data?.qrCodeUrl);
    setLoading(false);
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <AdminLayout>
      <div className="id-generator">
        <div className="id-generator__container">
          <div className="id-generator__header">
            <h2 className="id-generator__header-title">Upload Trainee Image</h2>
            <p className="id-generator__header-subtitle">
              Upload trainee image
            </p>
          </div>

          {user && (
            <div className="id-generator__content">
              <div className="id-generator__photo">
                <div className="id-generator__photo-preview">
                  <div className="id-generator__photo-preview-container">
                    {/* {image && ( */}

                    <div className="id-generator__photo-preview">
                      <div className="id-generator__photo-preview-container">
                        {!image && !loading && <div>User has no image</div>}
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
                    {/* )} */}
                  </div>
                </div>
              </div>

              <div className="fingerprint-grid">
                <div className="id-generator__photo">
                  <div className="id-generator__photo-preview">
                    <div className="id-generator__photo-preview-container">
                      {!user?.leftFingerPrint && !loading && (
                        <div>No left finger print</div>
                      )}

                      <div className="id-generator__photo-preview">
                        <div className="id-generator__photo-preview-container">
                          <img
                            src={user?.leftFingerPrint}
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
                    </div>
                  </div>
                </div>
                <div className="id-generator__photo">
                  <div className="id-generator__photo-preview">
                    <div className="id-generator__photo-preview-container">
                      <div className="id-generator__photo-preview">
                        <div className="id-generator__photo-preview-container">
                          {!user?.rightFingerPrint && !loading && (
                            <div>No right finger print</div>
                          )}
                          <img
                            src={user?.rightFingerPrint}
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="id-generator__form-grid">
                <div className="id-generator__form-info">
                  <label className="id-generator__form-label">User Id</label>
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
            <Link
              className="id-generator__actions-download"
              disabled={loading}
              to="/admin/users"
            >
              Go back to users
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default User;
