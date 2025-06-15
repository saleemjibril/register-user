import logo from "./logo.svg";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import IDCardGenerator from "./pages/Home";
import IDCardDisplay from "./pages/User";
import AdminLogin from "./pages/admin/Login";
import AdminUsersList from "./pages/admin/Users";
import AdminUsersListFilter from "./pages/admin/FilterUsers";
// import FingerprintScanner from "./pages/Finger";
import NameRegistrationForm from "./pages/NameRegistration";
import PhotoUploadForm from "./pages/PhotoUpload";
import SearchAndUpdateNameRegistration from "./pages/SearchAndUpdateNameRegistration";
import UpdateNameRegistration from "./pages/admin/UpdateNameRegistration";
import PhotoUpdate from "./pages/admin/PhotoUpdate";
import User from "./pages/admin/User";
import Finger from "./pages/Finger";
import FingerPrintUpdate from "./pages/admin/FingerPrintUpdate";
import AdminOutlet from "./pages/admin/Outlet";
import DownloadIdCard from "./pages/DownloadIdCard";
import Meal from "./pages/Meal";
import RegisteredUsers from "./pages/admin/RegisteredUsers";
import HealthAppointment from "./pages/health/HealthAppointment";
import SearchAndRecordAppointment from "./pages/health/SearchAndRecordAppointment";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {

  return (
    // <LocomotiveScrollProvider options={options} containerRef={ref}>
     <>
      <Routes>
{/*       
        <Route path="/" 
        element={<IDCardGenerator />}
         /> */}
        <Route path="/update-user" 
        element={<SearchAndUpdateNameRegistration />}
         />
        <Route path="/create-user" 
        element={<NameRegistrationForm />}
         />
        <Route path="/user/:id" 
        element={<IDCardDisplay />}
         />
        <Route path="/login" 
        element={<AdminLogin />}
         />
        <Route path="/login/:user" 
        element={<AdminLogin />}
         />
        <Route path="/" 
        element={
        <AdminUsersList />}
         />
        <Route path="/registered" 
        element={
        <RegisteredUsers />}
         />
        <Route path="/filter" 
        element={
        <AdminUsersListFilter />}
         />
        <Route path="/admin/users/image/:id" 
        element={<PhotoUpdate />}
         />
       <Route path="/admin" element={<AdminOutlet />}>
        <Route path="users/fingerprint/:id" element={<FingerPrintUpdate />} />
      </Route>

      <Route path="/admin/users/:id" 
        element={<UpdateNameRegistration />}
         />
      
        <Route path="/admin/view-user/:id" 
        element={<User />}
         />
      
        <Route path="/health/user/:id" 
        element={<HealthAppointment />}
         />
        <Route path="/health" 
        element={<SearchAndRecordAppointment />}
         />
        <Route path="/finger" 
        element={<Finger />}
         />
        <Route path="/update-image" 
        element={<PhotoUploadForm />}
         />
        <Route path="/update-finger-print" 
        element={<Finger />}
         />
        <Route path="/id-card" 
        element={<DownloadIdCard />}
         />
        <Route path="/meal" 
        element={<Meal />}
         />
       
      </Routes>
              <ToastContainer position="top-right" />

     </>
     
  );
}

export default App;
