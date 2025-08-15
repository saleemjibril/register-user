import { useEffect, useState } from "react";
import { searchUser, updateUser } from "../apis";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./admin/Layout";
import { useSelector } from "react-redux";

const SearchAndUpdateNameRegistration = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if(!auth?.token) {
      navigate('/login');
    }
  }, [])

  const [formData, setFormData] = useState({
    names: "",
    age: "",
    sex: "",
    gradeLevel: "",
    disability: "no",
    disabilityType: "",
    consent: ""
  });

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateUser(formData?._id, formData);
      if (response?.status === 200) {
        alert("Student data updated successfully");
        setFormData({
          names: "",
          age: "",
          sex: "",
          gradeLevel: "",
          disability: "no",
          disabilityType: "",
          consent: ""
        });
        setSearchTerm("")
      } else {
        if (response?.data?.message) {
          alert(response?.data?.message);
        } else {
          alert("Student data update failed");
        }
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Error updating student");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setSearchLoading(true);
    try {
      const response = await searchUser(searchTerm);
      console.log("response", response);
      
      if (response?.status === 200) {
        setFormData(response.data);
      } else {
        if (response?.data?.message) {
          alert(response?.data?.message);
        } else {
          alert("No user found with this user id");
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
      <div className="id-generator">
        <div className="id-generator__container">
          <div className="id-generator__header">
            <h2 className="id-generator__header-title">Update Student</h2>
            <p className="id-generator__header-subtitle">
              Update student's information below
            </p>
          </div>

          <div className="id-generator__search">
            <form onSubmit={handleSearch} className="id-generator__search-form">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter user id"
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

          <form onSubmit={handleSubmit} className="id-generator__form">
            <div className="id-generator__form-grid">

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">User ID</label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId || ""}
                  disabled
                  className="id-generator__form-input"
                />
              </div>

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
                  placeholder="Enter grade level"
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
                  placeholder="Enter disability type"
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
                {loading ? "Updating..." : "Update Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SearchAndUpdateNameRegistration;