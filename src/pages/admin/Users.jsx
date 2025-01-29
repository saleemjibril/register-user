import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "./Layout";
import { Link } from "react-router-dom";
import { getUsers, getUser } from "../../apis";

const AdminUsersList = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [users, setUsers] = useState([]);
  const dropdownRefs = useRef({});

  const handleGetUser = async () => {
    const response = await getUsers();
    setUsers(response?.data);
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const toggleMenu = (userId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === userId ? null : userId);
  };

  // Close menu when clicking outside
  const handleClickOutside = (event) => {
    // Check if the click is outside all dropdowns
    const clickedOutside = !Object.values(dropdownRefs.current).some(
      (ref) => ref && ref.contains(event.target)
    );

    if (clickedOutside) {
      setActiveMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <AdminLayout>
      <div className="users-list">
        <header className="users-list__header">
          <h2 className="users-list__title">Users</h2>
          <Link
                              to={`/`}
                            >
          <button className="users-list__add-button">Add User</button>
          </Link>
        </header>

        <div className="users-list__table-container">
          <table className="users-list__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Community</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.names}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.community}</td>
                  <td>
                    <div className="users-list__actions">
                      <div 
                        className="users-list__dropdown"
                        ref={(el) => (dropdownRefs.current[user._id] = el)}
                      >
                        <button
                          className="users-list__dropdown-trigger"
                          onClick={(e) => toggleMenu(user._id, e)}
                        >
                          •••
                        </button>
                        {activeMenu === user._id && (
                          <div className="users-list__dropdown-menu">
                            <Link
                              to={`/admin/users/${user._id}`}
                              className="users-list__dropdown-item"
                            >
                              Update Personal Info
                            </Link>
                            <Link
                              className="users-list__dropdown-item"
                              to={`/admin/users/image/${user._id}`}
                            >
                              Update Image
                            </Link>
                            <button className="users-list__dropdown-item">
                              Update Fingerprint
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersList;