import { useEffect, useState } from "react";
import { createUser } from "../apis";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./admin/Layout";
import { useSelector } from "react-redux";

const NameRegistrationForm = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    names: "",
    age: "",
    sex: "",
    gradeLevel: "",
    disability: "no",
    disabilityType: "",
    consent: ""
  });

  useEffect(() => {
    if(!auth?.token) {
      navigate('/login');
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "yes" : "no") : value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("formData", formData);
      if(formData?.consent !== "yes") {
        alert("Please consent to participate in this program")
        return;
      }
      
      const response = await createUser(formData);

      if (response?.data?.user?._id) {
        alert("User created successfully");
        navigate(`/`);
      } else {
        if (response?.data?.message) {
          alert(response?.data?.message);
        } else {
          alert("Student registration failed");
        }
      }
    } catch (error) {
      console.error("Error registering student:", error);
      alert("Error registering student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="id-generator">
        <div className="id-generator__container">
          <div className="id-generator__header">
            <h2 className="id-generator__header-title">Register Student</h2>
            <p className="id-generator__header-subtitle">
              Enter student's information to begin registration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="id-generator__form">
            <div className="id-generator__form-grid">
              <div className="id-generator__form-group">
                <label className="id-generator__form-label">Full Name</label>
                <input
                  type="text"
                  name="names"
                  placeholder="Enter full name"
                  value={formData.names}
                  onChange={handleChange}
                  className="id-generator__form-input"
                  required
                />
              </div>

             
              <div className="id-generator__form-group">
                <label className="id-generator__form-label">Age</label>
                <input
                  type="text"
                  name="age"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleChange}
                  className="id-generator__form-input"
                  required
                />
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="id-generator__form-input"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              
             
              <div className="id-generator__form-group">
                <label className="id-generator__form-label">
                  Grade Level
                </label>
                <input
                  type="text"
                  name="gradeLevel"
                  placeholder="Enter degree qualifications"
                  value={formData.gradeLevel}
                  onChange={handleChange}
                  className="id-generator__form-input"
                />
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">Disability</label>
                <select
                  name="disability"
                  value={formData.disability}
                  onChange={handleChange}
                  className="id-generator__form-input"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">Disability Type</label>
                <input
                  type="text"
                  name="disabilityType"
                  placeholder="Enter degree qualifications"
                  value={formData.disabilityType}
                  onChange={handleChange}
                  className="id-generator__form-input"
                />
              </div>

             
          

              <div className="id-generator__form-checkbox">
                <label className="id-generator__form-label">
                  By checking this, you consent to participate in this program
                </label>
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent === "yes"}
                  onChange={handleChange}
                  className="id-generator__form-input"
                />
              </div>

             
            </div>

            <div className="id-generator__actions">
              <button
                type="submit"
                className="id-generator__actions-register"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NameRegistrationForm;
