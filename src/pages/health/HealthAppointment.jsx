import { useEffect, useRef, useState } from "react";

import { getUser, recordAppointment } from "../../apis";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import AdminLayout from "../admin/Layout";
import moment from "moment";

const HealthAppointment = () => {
  const pathname = useParams();
  const auth = useSelector((state) => state.auth);
  console.log("auth", auth);

  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [mealStatus, setMealStatus] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: "",
    success: false,
  });
  const [formData, setFormData] = useState({
    complaint: "",
    diagnosis: "",
    prescriptions: [{ drug: "", dosage: "", duration: "" }],
  });

  const [expandedAppointments, setExpandedAppointments] = useState({});
  const [pastAppointments, setPastAppointments] = useState([]);

  const mediaRef = useRef(null);

  useEffect(() => {
    if (!auth?.token) {
      navigate(`/login/${pathname?.id}`);
    }
  }, []);

  const handleGetUser = async () => {
    setLoading(true);
    const response = await getUser(pathname?.id);
    console.log("getUser", response);

    setImage(response?.data?.photo);
    setUser(response?.data);
    setQrCodeUrl(response?.data?.qrCodeUrl);
    setPastAppointments(response?.data?.appointments?.reverse());
    setLoading(false);
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "sex") {
      setFormData((prev) => ({
        ...prev,
        helperColumnMale: value === "male" ? "yes" : "no",
        helperColumnFemale: value === "female" ? "yes" : "no",
      }));
    }

    if (name === "religion") {
      setFormData((prev) => ({
        ...prev,
        helperColumnChristianity:
          value.toLowerCase() === "christianity" ? "yes" : "no",
        helperColumnIslam: value.toLowerCase() === "islam" ? "yes" : "no",
      }));
    }
  };

  const handlePrescriptionChange = (index, field, value) => {
    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions[index] = {
      ...newPrescriptions[index],
      [field]: value,
    };
    setFormData({ ...formData, prescriptions: newPrescriptions });
  };

  const addPrescription = () => {
    setFormData({
      ...formData,
      prescriptions: [
        ...formData.prescriptions,
        { drug: "", dosage: "", duration: "" },
      ],
    });
  };

  const removePrescription = (index) => {
    const newPrescriptions = formData.prescriptions.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, prescriptions: newPrescriptions });
  };

  const toggleAppointment = (index) => {
    setExpandedAppointments({
      ...expandedAppointments,
      [index]: !expandedAppointments[index],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("formData", formData);

      const response = await recordAppointment(user?._id, formData);
      console.log("recordAppointment", response);

      if (response?.status === 200) {
        setFormData({
          complaint: "",
          diagnosis: "",
          prescriptions: [{ drug: "", dosage: "", duration: "" }],
        });
        handleGetUser();
        alert("appointment recorded successfully");
      } else {
        alert("Failed to appointment record appointment");
      }
    } catch (error) {
      console.error("Error registering trainee:", error);
      alert("Error registering trainee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="id-generator">
        <div className="id-generator__container">
          <div className="id-generator__header">
            <h2 className="id-generator__header-title">{user?.names}</h2>
            <p className="id-generator__header-subtitle">{user?.userId}</p>
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
                  <label className="id-generator__form-label">
                    Credentials
                  </label>
                  <div className="id-generator__form-value">
                    {user?.credentials?.url && (
                      <button
                        className="id-generator__actions-register"
                        onClick={() =>
                          window.open(
                            user?.credentials?.url,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        View credentials
                      </button>
                    )}
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
                  <label className="id-generator__form-label">Msp Type</label>
                  <div className="id-generator__form-value">
                    {user?.mspType}
                  </div>
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

          <br />
          <br />
          <br />
          <br />
          <div className="id-generator__past-appointments">
            <h3 className="id-generator__form-label">Past Appointments</h3>
            {pastAppointments?.map((appointment, index) => (
              <div key={index} className="id-generator__appointment-card">
                <button
                  className="id-generator__appointment-header"
                  type="button"
                  onClick={() => toggleAppointment(index)}
                >
                  <span>
                    {moment(appointment.createdAt).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </span>
                  <span className="id-generator__appointment-toggle">
                    {expandedAppointments[index] ? "▼" : "▶"}
                  </span>
                </button>

                {expandedAppointments[index] && (
                  <div className="id-generator__appointment-content">
                    <div className="id-generator__appointment-section">
                      <h4 className="id-generator__form-label">Complaint</h4>
                      <p>{appointment.complaint}</p>
                    </div>
                    <div className="id-generator__appointment-section">
                      <h4 className="id-generator__form-label">Diagnosis</h4>
                      <p>{appointment.diagnosis}</p>
                    </div>

                    <div className="id-generator__appointment-section">
                      <h4 className="id-generator__form-label">
                        Prescriptions
                      </h4>
                      {appointment?.prescriptions?.map(
                        (prescription, pIndex) => (
                          <div
                            key={pIndex}
                            className="id-generator__appointment-prescription"
                          >
                            {prescription.drug} - {prescription.dosage} for{" "}
                            {prescription.duration}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <br />
          <br />
          <br />
          <br />

          <div className="id-generator__header">
            <h2 className="id-generator__header-title">Record Appointment</h2>
            <p className="id-generator__header-subtitle">
              Enter trainee's appointment notes here
            </p>
          </div>

          <form className="id-generator__form" onSubmit={handleSubmit}>
            <div className="id-generator__form-grid">
              {/* Keep existing form fields */}

              <div className="id-generator__form-group id-generator__form-group--full">
                <label className="id-generator__form-label">
                  Trainee's Complaint
                </label>
                <textarea
                  name="complaint"
                  placeholder="Enter your complaint here..."
                  value={formData.complaint}
                  onChange={(e) =>
                    setFormData({ ...formData, complaint: e.target.value })
                  }
                  className="id-generator__form-input"
                  rows={4}
                  required
                />
              </div>
              <div className="id-generator__form-group id-generator__form-group--full">
                <label className="id-generator__form-label">
                  Doctors's Diagnosis
                </label>
                <textarea
                  name="diagnosis"
                  placeholder="Enter your diagnosis here..."
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  className="id-generator__form-input"
                  rows={4}
                  required
                />
              </div>

              {/* Prescriptions Section */}
              <div className="id-generator__form-group id-generator__form-group--full">
                <div className="id-generator__form-header">
                  <label className="id-generator__form-label">
                    Prescribed Medications
                  </label>
                  <button
                    type="button"
                    onClick={addPrescription}
                    className="id-generator__actions-register"
                  >
                    Add Medication
                  </button>
                </div>

                {formData?.prescriptions?.map((prescription, index) => (
                  <div key={index} className="id-generator__form-prescription">
                    <div className="id-generator__form-prescription-inputs">
                      <input
                        type="text"
                        placeholder="Drug name"
                        value={prescription.drug}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "drug",
                            e.target.value
                          )
                        }
                        className="id-generator__form-input"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={prescription.dosage}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        className="id-generator__form-input"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={prescription.duration}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        className="id-generator__form-input"
                      />
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="id-generator__actions-remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="id-generator__actions">
              <button
                type="submit"
                className="id-generator__actions-register"
                disabled={loading}
              >
                {loading ? "Recording..." : "Record Appointment"}
              </button>
            </div>
          </form>

          <div className="id-generator__actions">
            <Link
              className="id-generator__actions-download"
              disabled={loading}
              to="/"
            >
              Go back to users
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HealthAppointment;
