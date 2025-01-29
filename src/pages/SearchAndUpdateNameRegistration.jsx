import { useState } from "react";
import { createUser, searchUser, updateUser } from "../apis";
import { useNavigate } from "react-router-dom";

const SearchAndUpdateNameRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [formData, setFormData] = useState({
    names: "",
    community: "",
    district: "",
    lga: "",
    state: "",
    phoneNumber: "",
    age: "",
    sex: "",
    languagesSpokenAndWritten: "",
    disability: "no",
    religion: "",
    birthCertificateCheck: "no",
    idType: "",
    idNumber: "",
    qualification: "",
    physicalFitness: "",
    availability: "",
    preExistingHealthCondition: "",
    nursingMother: "no",
    remark: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateUser(formData?._id, formData);
      if (response?.status === 200) {
        alert("Trainee data updated successfully");
        navigate("/user/image")
      } else {
        alert("Trainee data update failed");
      }
    } catch (error) {
      console.error("Error registering trainee:", error);
      alert("Error registering trainee");
    } finally {
      setLoading(false);
    }
  };

    const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setSearchLoading(true);
    try {
      // Assuming searchUser API accepts email or phone and returns user data
      const response = await searchUser(searchTerm);
      console.log("searchUser", response);
      if (response?.data) {
        console.log('response.data?.photo', response.data?.photo);
        
        setFormData(response.data);
      } else {
        alert("No user found with this email or phone number");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      alert("Error searching for user");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="id-generator">
      <div className="id-generator__container">
        <div className="id-generator__header">
          <h2 className="id-generator__header-title">Update Trainee</h2>
          <p className="id-generator__header-subtitle">
            Update trainee's information below
          </p>
        </div>

        <div className="id-generator__search">
          <form onSubmit={handleSearch} className="id-generator__search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter email or phone number"
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
            {/* Personal Information */}
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
              <label className="id-generator__form-label">Community</label>
              <input
                type="text"
                name="community"
                placeholder="Enter community"
                value={formData.community}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              />
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">District</label>
              <input
                type="text"
                name="district"
                placeholder="Enter district"
                value={formData.district}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              />
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">LGA</label>
              <input
                type="text"
                name="lga"
                placeholder="Enter Local Government Area"
                value={formData.lga}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              />
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">State</label>
              <input
                type="text"
                name="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              />
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">Phone Number</label>
              <input
                type="number"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              />
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">Age</label>
              <input
                type="number"
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
              <label className="id-generator__form-label">Languages</label>
              <input
                type="text"
                name="languagesSpokenAndWritten"
                placeholder="Enter languages"
                value={formData.languagesSpokenAndWritten}
                onChange={handleChange}
                className="id-generator__form-input"
                required
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
              <label className="id-generator__form-label">Religion</label>
              <input
                type="text"
                name="religion"
                placeholder="Enter religion"
                value={formData.religion}
                onChange={handleChange}
                className="id-generator__form-input"
              />
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">Birth Certificate</label>
              <select
                name="birthCertificateCheck"
                value={formData.birthCertificateCheck}
                onChange={handleChange}
                className="id-generator__form-input"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">ID Type</label>
              <select
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              >
                <option value="">Select ID type</option>
                <option value="nin">NIN</option>
                <option value="voters">Voters Card</option>
                <option value="drivers">Drivers License</option>
                <option value="passport">International Passport</option>
              </select>
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">ID Number</label>
              <input
                type="number"
                name="idNumber"
                placeholder="Enter ID number"
                value={formData.idNumber}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              />
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">Qualification</label>
              <input
                type="text"
                name="qualification"
                placeholder="Enter qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              />
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">Physical Fitness</label>
              <select
                name="physicalFitness"
                value={formData.physicalFitness}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              >
                <option value="">Select physical fitness status</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              >
                <option value="">Select availability</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
              </select>
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">Health Condition</label>
              <select
                name="preExistingHealthCondition"
                value={formData.preExistingHealthCondition}
                onChange={handleChange}
                className="id-generator__form-input"
                required
              >
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="id-generator__form-group">
              <label className="id-generator__form-label">Nursing Mother</label>
              <select
                name="nursingMother"
                value={formData.nursingMother}
                onChange={handleChange}
                className="id-generator__form-input"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {/* Full width remark field */}
            <div className="id-generator__form-group id-generator__form-group--full">
              <label className="id-generator__form-label">Remark</label>
              <textarea
                name="remark"
                placeholder="Enter any additional remarks"
                value={formData.remark}
                onChange={handleChange}
                className="id-generator__form-input"
                rows="3"
              />
            </div>
          </div>

          <div className="id-generator__actions">
            <button
              type="submit"
              className="id-generator__actions-register"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Trainee Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchAndUpdateNameRegistration;