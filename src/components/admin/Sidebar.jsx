import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Image1 from "../../assets/logo.png";


const Sidebar = () => {
  const auth = useSelector((state) => state.auth);

  
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT_SUCCESS",
    });
    localStorage.removeItem("token");
    navigate("/login");
    window.scrollTo(0, 0);
  };

  return (
    <aside className="sidebar">
          <img className="sidebar__logo" src={Image1} alt="" />
      <nav className="sidebar__nav">
        <ul className="sidebar__menu">
          {auth?.userInfo?.role !== "health" && <>
            <li
            className={
              pathname === "/" &&
              "sidebar__menu-item sidebar__menu-item--active"
            }
          >
            <Link to="/" className="sidebar__link">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sidebar__icon"
                width="20"
                height="20"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Users</span>
            </Link>
          </li>
          <li
            className={
              pathname === "/registered" &&
              "sidebar__menu-item sidebar__menu-item--active"
            }
          >
            <Link to="/registered" className="sidebar__link">

            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sidebar__icon"
                width="20"
                height="20"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Registered Users</span>
            </Link>
          </li>
          <li
            className={
              pathname === "/update-user" &&
              "sidebar__menu-item sidebar__menu-item--active"
            }
          >
            <Link to="/update-user" className="sidebar__link">

            <svg className="sidebar__icon" width="25"
                height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.5 19.5L20 21M11 21H5.6C5.03995 21 4.75992 21 4.54601 20.891C4.35785 20.7951 4.20487 20.6422 4.10899 20.454C4 20.2401 4 19.9601 4 19.4V17.6841C4 17.0485 4 16.7306 4.04798 16.4656C4.27087 15.2344 5.23442 14.2709 6.46558 14.048C6.5425 14.0341 6.6237 14.0242 6.71575 14.0172C6.94079 14 7.05331 13.9914 7.20361 14.0026C7.35983 14.0143 7.4472 14.0297 7.59797 14.0722C7.74302 14.1131 8.00429 14.2315 8.52682 14.4682C9.13692 14.7446 9.8015 14.9218 10.5 14.9795M19 17.5C19 18.8807 17.8807 20 16.5 20C15.1193 20 14 18.8807 14 17.5C14 16.1193 15.1193 15 16.5 15C17.8807 15 19 16.1193 19 17.5ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
              <span>Update personal info</span>
            </Link>
          </li>
          <li
            className={
              pathname === "/update-image" &&
              "sidebar__menu-item sidebar__menu-item--active"
            }
          >
            <Link to="/update-image" className="sidebar__link">

            <svg className="sidebar__icon"
                width="20"
                height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" ></path> </g></svg>


              <span>Upload photo and credentials</span>
            </Link>
          </li>
          <li
            className={
              pathname === "/update-finger-print" &&
              "sidebar__menu-item sidebar__menu-item--active"
            }
          >
            <Link to="/update-finger-print" className="sidebar__link">
              <svg  className="sidebar__icon"
                width="20"
                height="20" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path stroke-width="4" d="M140.424 38.019a3.6 3.6 0 0 1-1.777-.462C123.81 29.934 110.983 26.7 95.528 26.7c-15.223 0-29.75 3.619-42.964 10.857-1.854 1.001-4.172.308-5.254-1.54-1.005-1.848-.31-4.235 1.545-5.236C63.228 22.85 78.992 19 95.528 19c16.537 0 30.91 3.619 46.673 11.55 1.932 1.155 2.628 3.465 1.623 5.313-.695 1.386-1.932 2.156-3.4 2.156ZM29.846 78.444a4.036 4.036 0 0 1-2.24-.693c-1.624-1.232-2.165-3.619-.928-5.39 7.65-10.78 17.386-19.25 28.977-25.179 24.419-12.474 55.328-12.551 79.669-.077 11.591 5.929 21.327 14.245 28.977 25.025 1.237 1.694.773 4.158-.927 5.39-1.777 1.232-4.173.847-5.409-.77-6.955-9.856-15.764-17.479-26.196-22.792-22.177-11.319-50.536-11.319-72.636.077-10.51 5.39-19.319 13.09-26.273 22.715-.618 1.155-1.778 1.694-3.014 1.694Zm48.296 92.939c-1.005 0-1.932-.385-2.705-1.155-6.722-6.699-10.354-11.011-15.532-20.328-5.332-9.471-8.113-21.021-8.113-33.418 0-22.869 19.627-41.503 43.736-41.503 24.11 0 43.737 18.634 43.737 41.503 0 1.021-.407 2-1.132 2.722a3.87 3.87 0 0 1-5.464 0 3.844 3.844 0 0 1-1.131-2.722c0-18.634-16.15-33.803-36.01-33.803-19.859 0-36.01 15.169-36.01 33.803 0 11.088 2.474 21.329 7.187 29.568 4.946 8.932 8.346 12.705 14.296 18.711a3.943 3.943 0 0 1 0 5.467c-.927.77-1.855 1.155-2.86 1.155Zm55.405-14.245c-9.196 0-17.309-2.31-23.955-6.853-11.514-7.777-18.391-20.405-18.391-33.803 0-1.021.407-2 1.132-2.722a3.871 3.871 0 0 1 5.464 0 3.843 3.843 0 0 1 1.131 2.722c0 10.857 5.564 21.098 14.991 27.412 5.487 3.696 11.9 5.467 19.628 5.467 1.854 0 4.945-.231 8.036-.77 2.087-.385 4.173 1.001 4.482 3.157.386 2.002-1.005 4.081-3.168 4.466-4.405.847-8.268.924-9.35.924ZM118.015 173h-1.005c-12.286-3.542-20.323-8.085-28.745-16.324-10.819-10.626-16.769-24.948-16.769-40.194 0-12.474 10.664-22.638 23.8-22.638 13.137 0 23.801 10.164 23.801 22.638 0 8.239 7.341 14.938 16.072 14.938 8.887 0 16.073-6.699 16.073-14.938 0-29.029-25.114-52.591-56.023-52.591-21.945 0-42.191 12.166-51.077 31.031-3.014 6.237-4.56 13.552-4.56 21.56 0 6.006.541 15.477 5.178 27.797.773 2.002-.232 4.235-2.241 4.928-2.01.693-4.25-.308-4.946-2.233-3.863-10.087-5.64-20.174-5.64-30.492 0-9.24 1.777-17.633 5.254-24.948 10.277-21.483 33.073-35.42 58.032-35.42 35.082 0 63.751 27.027 63.751 60.291 0 12.474-10.664 22.638-23.801 22.638-13.136 0-23.8-10.164-23.8-22.638 0-8.239-7.186-14.938-16.073-14.938-8.886 0-16.072 6.699-16.072 14.938 0 13.167 5.1 25.487 14.45 34.727 7.341 7.238 14.373 11.242 25.268 14.168 2.086.616 3.246 2.772 2.705 4.774-.387 1.771-2.009 2.926-3.632 2.926Z"></path></g></svg>
              <span>Upload fingerprint</span>
            </Link>
          </li>
          <li
            className={
              pathname === "/id-card" &&
              "sidebar__menu-item sidebar__menu-item--active"
            }
          >
            <Link to="/id-card" className="sidebar__link">

            <svg  className="sidebar__icon"
                width="20"
                height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"></path> </g></svg>
              <span>Download ID card</span>
            </Link>
          </li>
          </>}
          {auth?.userInfo?.role === "health" &&  <li
            className={
              pathname === "/health" &&
              "sidebar__menu-item sidebar__menu-item--active"
            }
          >
            <Link to="/health" className="sidebar__link">
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Health</title> <rect width="24" height="24" fill="none"  stroke-width="0" opacity="0.01"></rect> <path d="M17.5,13.5h-4v4h-3v-4h-4v-3h4v-4h3v4h4ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z" transform="translate(0 0)"></path> </g></svg>
              <span>Record Appointment</span>
            </Link>
          </li>}
          <li className="sidebar__menu-item">
            <button onClick={handleLogout} className="sidebar__link">
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;