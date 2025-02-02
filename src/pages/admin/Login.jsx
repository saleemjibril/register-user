import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { login } from "../../apis";
import { useDispatch } from "react-redux";

const AdminLogin = () => {
  const pathname = useParams();
  console.log('pathname', pathname);
  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setAlert({ type: "", message: "" });

      const response = await login(formData);
      console.log('response from login', response);
      
      if (response?.status === 200) {
        setAlert({
          type: "success",
          message: "Login successful! Redirecting...",
        });
        localStorage.setItem("token", response.data.token);
        dispatch({
          type: "USER_LOGIN_SUCCESS",
          payload: {
            token: response.data.token,
          },
        });
        if(pathname?.user) {
          navigate(`/admin/view-user/${pathname?.user}`);
        }else {
          navigate("/");
        }
      } else {
        setAlert({
          type: "error",
          message: response?.data?.message || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error?.message || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__container">
        <div className="admin-login__header">
          <div className="admin-login__header-logo">
            {/* <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg> */}
          </div>
          <h1 className="admin-login__header-title">Admin Login</h1>
          <p className="admin-login__header-subtitle">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {alert.message && (
          <div
            className={`admin-login__alert admin-login__alert--${alert.type}`}
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__form-group">
            <label className="admin-login__form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`admin-login__form-input ${
                errors.username ? "admin-login__form-input--error" : ""
              }`}
              required
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="admin-login__form-error">{errors.username}</p>
            )}
          </div>

          <div className="admin-login__form-group">
            <label className="admin-login__form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`admin-login__form-input ${
                errors.password ? "admin-login__form-input--error" : ""
              }`}
              required
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="admin-login__form-error">{errors.password}</p>
            )}
          </div>

          {/* <a href="/forgot-password" className="admin-login__form-forgot">
            Forgot password?
          </a> */}

          <button
            type="submit"
            className="admin-login__form-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
