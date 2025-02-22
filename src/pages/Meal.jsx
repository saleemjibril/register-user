import React, { useEffect, useState } from "react";
// import { getUser } from "../apis";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Make sure to import axios

const Meal = () => {
  const [user, setUser] = useState(null);
  const [mealStatus, setMealStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchUser = async () => {
    // try {
    //   const response = await getUser(id);
    //   setUser(response?.data);
    //   return response?.data;
    // } catch (error) {
    //   console.error("Error fetching user:", error);
    // }
  };

  const recordMeal = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/meals/record/${user.userId}`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Refresh user data to get updated meal records
      const updatedUser = await fetchUser();
      setUser(updatedUser);
      
      setMealStatus({
        success: true,
        message: `${response.data.mealType} recorded successfully`
      });
    } catch (error) {
      setMealStatus({
        success: false,
        message: error.response?.data?.message || "Error recording meal"
      });
    } finally {
      setLoading(false);
    }
  };

//   useEffect(() => {
//     const initialize = async () => {
//       await fetchUser();
//       await recordMeal(); // Automatically record meal when page loads
//       setLoading(false);
//     };

//     initialize();
//   }, [id]);

  const getTodayMeals = () => {
    if (!user?.mealRecords) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return user.mealRecords.find(
      record => new Date(record.date).toDateString() === today.toDateString()
    );
  };

  const todayMeals = getTodayMeals();

  return (
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
              <div className={`alert ${mealStatus.success ? 'alert-success' : 'alert-error'}`}>
                {mealStatus.message}
              </div>
            )}
            
            {todayMeals && (
              <div className="meal-records">
                <div className="meal-record">
                  <span>Breakfast:</span>
                  <span className={todayMeals.breakfast ? 'recorded' : 'not-recorded'}>
                    {todayMeals.breakfast ? '✓' : '×'}
                  </span>
                </div>
                <div className="meal-record">
                  <span>Lunch:</span>
                  <span className={todayMeals.lunch ? 'recorded' : 'not-recorded'}>
                    {todayMeals.lunch ? '✓' : '×'}
                  </span>
                </div>
                <div className="meal-record">
                  <span>Dinner:</span>
                  <span className={todayMeals.dinner ? 'recorded' : 'not-recorded'}>
                    {todayMeals.dinner ? '✓' : '×'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Meal;