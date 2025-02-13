import React, { useEffect, useState } from "react";
import { getUser, recordMeal } from "../apis";
import { useNavigate, useParams } from "react-router-dom";
import IDCard from "../components/IDCard";
import moment from "moment";
import { pdf } from "@react-pdf/renderer";
import AdminLayout from "./admin/Layout";
import { useSelector } from "react-redux";

const IDCardDisplay = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const pathname = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [mealStatus, setMealStatus] = useState(null);

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
    }
  }, []);

  const handleGetUser = async () => {
    const response = await getUser(pathname?.id);
    setUser(response?.data);
    if(response?.status === 200) {
      handleRecordMeal(response?.data?._id)
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const generatePdfBlob = async () => {
    const doc = (
      <IDCard userData={user} image={user?.photo} qrCodeUrl={user?.qrCodeUrl} />
    );
    const asPdf = pdf([]);
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    return blob;
  };

  const handlePdf = async () => {
    try {
      const blob = await generatePdfBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${user?.names}${moment(Date.now()).format(
        "DD-MM-YYYY"
      )}_id_card.pdf`;
      link.click();

      const file = new File([blob], link.download, { type: "application/pdf" });
    } catch (error) {
      alert("Unable to download ID card");
      console.log("error creating certificate:", error);
      return {
        status: "error creating certificate",
        statusCode: 500,
      };
    }
  };

  const handleRecordMeal = async (userId) => {
    try {
      setLoading(true);
      const response = await recordMeal(userId);
      console.log("response");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Refresh user data to get updated meal records
      // const updatedUser = await fetchUser();
      // setUser(updatedUser);

      // setMealStatus({
      //   success: true,
      //   message: `${response.data.mealType} recorded successfully`
      // });
    } catch (error) {
      setMealStatus({
        success: false,
        message: error.response?.data?.message || "Error recording meal",
      });
    } finally {
      setLoading(false);
    }
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

  return (
    <AdminLayout>
      <div className="id-display__container">
        <div className="id-display__card">
          <div className="id-display__content">
            <div className="id-display__header">
              <h1 className="id-display__header-title">TRACTRAC</h1>
            </div>

            <div className="id-display__info">
              <div className="id-display__photo">
                <img
                  src={user?.photo}
                  alt={user?.names}
                  className="id-display__photo-image"
                />
              </div>

              <div className="id-display__details">
                <div className="id-display__details-group">
                  <label className="id-display__details-label">FULL NAME</label>
                  <p className="id-display__details-value">{user?.names}</p>
                </div>

                <div className="id-display__details-group">
                  <label className="id-display__details-label">ID NUMBER</label>
                  <p className="id-display__details-value">{user?.userId}</p>
                </div>

                <div className="id-display__details-group">
                  <label className="id-display__details-label">
                    ISSUED DATE
                  </label>
                  <p className="id-display__details-value">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="id-display__footer">
              <div className="id-display__footer-text">
                <p>This ID card is property of TracTrac.</p>
                <p>If found, please return to nearest office.</p>
              </div>
              <div className="id-display__footer-qr">
                <img
                  src={user?.qrCodeUrl}
                  alt="QR Code"
                  className="id-display__footer-qr-code"
                />
              </div>
            </div>

            <div className="id-generator__actions">
              <button
                className="id-generator__actions-download"
                onClick={handlePdf}
              >
                Download ID card
              </button>
            </div>
          </div>
        </div>

        <div className="id-display__container">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {/* Existing ID card display code */}

              {/* Add meal status section */}
              <div className="meal-status">
                <h2>Today's Meals</h2>
                {mealStatus && (
                  <div
                    className={`alert ${
                      mealStatus.success ? "alert-success" : "alert-error"
                    }`}
                  >
                    {mealStatus.message}
                  </div>
                )}

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
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default IDCardDisplay;
