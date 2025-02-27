import { useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import moment from "moment";
import QRCode from "qrcode";
import { getUser, recordAttendance, recordMeal, updateUser } from "../../apis";
import { Link, useNavigate, useParams } from "react-router-dom";
import IDCard from "../../components/IDCard";
import fileUpload from "../../utils/fileUpload";
import AdminLayout from "./Layout";
import { useSelector } from "react-redux";
import MealModal from "../../components/MealModal";
import AttendanceModal from "../../components/AttendanceModal";

const User = () => {
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
  const [subject, setSubject] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: "",
    success: false,
  });
  const [attendanceModalState, setAttendanceModalState] = useState({
    isOpen: false,
    message: "",
    success: false,
  });
  const [open, setOpen] = useState(false);

  const mediaRef = useRef(null);

  useEffect(() => {
    const hash = window.location.hash;
    const cardId = hash.substring(1);

    if (cardId) {
      const cardElement = document.getElementById(cardId);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!auth?.token) {
      navigate(`/login/${pathname?.id}`);
    }
  }, []);

  useEffect(() => {
    if (auth?.userInfo?.role === "health") {
      navigate(`/health/user/${pathname?.id}`);
    }
  }, []);
  useEffect(() => {
    if (auth?.userInfo?.role === "attendance") {
    showClassSelectModal();
    }
  }, []);

  const handleGetUser = async () => {
    setLoading(true);
    const response = await getUser(pathname?.id);
    setImage(response?.data?.photo);
    setUser(response?.data);
    setQrCodeUrl(response?.data?.qrCodeUrl);
    if (response?.status === 200 && auth?.userInfo?.role === "food-checker") {
      handleRecordMeal(response?.data?._id);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const handleRecordMeal = async (userId) => {
    setLoading(true);
    const response = await recordMeal(userId);
    console.log("recordMeal", response);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (response.status === 200) {
      showModal(response?.data?.message, true);
      const response2 = await getUser(pathname?.id);
      setImage(response2?.data?.photo);
      setUser(response2?.data);
      setQrCodeUrl(response2?.data?.qrCodeUrl);
    } else {
      showModal(response?.data?.message, false);
    }
    setLoading(false);
  };

  const handleRecordAttendance = async () => {
    setLoading(true);
    setOpen(false)
    const response = await recordAttendance(pathname?.id, subject);
    console.log("recordAttendance", response);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (response.status === 200) {
      showAttendanceModal(response?.data?.message, true);
    } else {
      showAttendanceModal(response?.data?.message, false);
    }
    setLoading(false);
  };

  const getTodayMeals = () => {
    if (!user?.mealRecords) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return user.mealRecords.find(
      (record) => new Date(record.date).toDateString() === today.toDateString()
    );
  };

  const todayMeals = getTodayMeals();

  const closeModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };
  const closeAttendanceModal = () => {
    setAttendanceModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const showModal = (message, success) => {
    setModalState({
      isOpen: true,
      message,
      success,
    });

    // setTimeout(() => {
    //   closeModal();
    // }, 3000);
  };
  const showAttendanceModal = (message, success) => {
    setAttendanceModalState({
      isOpen: true,
      message,
      success,
    });
  };

  const showClassSelectModal = () => {
    console.log("yooo!");

    setOpen(true);
  };

  const getCurrentMealType = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 11) return "breakfast";
    if (currentHour >= 11 && currentHour < 16) return "lunch";
    if (currentHour >= 16 && currentHour < 22) return "dinner";
    return "outside meal hours";
  };
  const currentMeal = getCurrentMealType();

  const handleViewClick = () => {
    setOpen(false)
    navigate(`/admin/view-user/${pathname?.id}#attendance`);
  }
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
                  <label className="id-generator__form-label">Operator</label>
                  <div className="id-generator__form-value">
                    {user?.operator}
                  </div>
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
              to="/"
            >
              Go back to users
            </Link>
          </div>
        </div>

        {auth?.userInfo?.role === "food-checker" && (
          <div className="id-display__container">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                {/* Existing ID card display code */}

                {/* Add meal status section */}
                <div className="meal-status">
                  <h2>Today's Meals</h2>

                  {todayMeals && (
                    <div className="meal-records">
                      <div className="meal-record">
                        <span>Breakfast:</span>
                        <span
                          className={
                            todayMeals.breakfast ? "recorded" : "not-recorded"
                          }
                        >
                          {todayMeals.breakfast ? "✓" : "×"}
                        </span>
                      </div>
                      <div className="meal-record">
                        <span>Lunch:</span>
                        <span
                          className={
                            todayMeals.lunch ? "recorded" : "not-recorded"
                          }
                        >
                          {todayMeals.lunch ? "✓" : "×"}
                        </span>
                      </div>
                      <div className="meal-record">
                        <span>Dinner:</span>
                        <span
                          className={
                            todayMeals.dinner ? "recorded" : "not-recorded"
                          }
                        >
                          {todayMeals.dinner ? "✓" : "×"}
                        </span>
                      </div>
                      <div className="current-meal-info">
                        Current meal period: {currentMeal}
                      </div>
                    </div>
                  )}
                </div>

                <MealModal
                  isOpen={modalState.isOpen}
                  message={modalState.message}
                  success={modalState.success}
                  onClose={closeModal}
                />
              </>
            )}
          </div>
        )}

       {user &&  <>
        <AttendanceModal 
             open={open}
             onClose={handleRecordAttendance}
             setSubject={setSubject}
             subject={subject}
             loading={loading}
             onViewClick={handleViewClick}
              />

<MealModal
              isOpen={attendanceModalState.isOpen}
              message={attendanceModalState.message}
              success={attendanceModalState.success}
              onClose={closeAttendanceModal}
            />
        <div className="meal-status" id="attendance">
          <h2>Attendance</h2>
          <div className="meal-records">
            {user?.attendance?.map((item) => (
              <div className="meal-record">
                <span>
                  {moment(item?.date).format("MMMM Do YYYY")} -{" "}
                  {item?.subject}
                </span>
                <span className="recorded">✓</span>
              </div>
            ))}
          </div>
        </div>
        </>}
      </div>
    </AdminLayout>
  );
};

export default User;
