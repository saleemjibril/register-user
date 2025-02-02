import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "./Layout";
import { Link, useNavigate } from "react-router-dom";
import { getUsers } from "../../apis";
import { useSelector } from "react-redux";

const AdminUsersList = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate()

  const [activeMenu, setActiveMenu] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("names");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const dropdownRefs = useRef({});
  const searchTimeout = useRef(null);

  useEffect(() => {
    if(!auth?.token) {
      navigate('/login');
    }
  }, [])

  const handleGetUser = async (page = 1) => {
    const response = await getUsers({ page });
    
    setUsers(response?.data?.users);
    setPagination(response?.data?.pagination);
  };

  const handleSearch = async (term, type, page = 1) => {
    setIsSearching(true);
    try {
      const response = await getUsers({
        term,
        type,
        page,
      });
      setUsers(response?.data?.users);
      setPagination(response?.data?.pagination);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (searchTerm) {
      handleSearch(searchTerm, searchType, newPage);
    } else {
      handleGetUser(newPage);
    }
  };

  const debouncedSearch = (term, type, page) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      handleSearch(term, type, page);
    }, 300);
  };

  useEffect(() => {
    debouncedSearch(searchTerm, searchType, currentPage);
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, searchType, currentPage]);

  useEffect(() => {
    if (!searchTerm) {
      handleGetUser(currentPage);
    }
  }, [currentPage]);

  const toggleMenu = (userId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === userId ? null : userId);
  };

  const handleClickOutside = (event) => {
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
          <div className="users-list__search-container">
            <div className="users-list__search-wrapper">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="users-list__search-input"
              />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="users-list__search-type"
              >
                <option value="names">Name</option>
                <option value="email">Email</option>
                <option value="phoneNumber">Phone</option>
                <option value="userId">User ID</option>
              </select>
            </div>
            <Link to="/create-user" className="users-list__add-link">
              <button className="users-list__add-button">Add User</button>
            </Link>
          </div>
        </header>

        <div className="users-list__table-container">
          {isSearching ? (
            <div className="users-list__loading">Searching...</div>
          ) : (
            <>
              <table className="users-list__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user?._id}>
                      <td>{user?.userId}</td>
                      <td>{user?.names}</td>
                      <td>{user?.phoneNumber}</td>
                      <td>{user?.email}</td>
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
                                  to={`/admin/view-user/${user._id}`}
                                  className="users-list__dropdown-item"
                                >
                                  View User Details
                                </Link>
                                <Link
                                  to={`/admin/users/${user._id}`}
                                  className="users-list__dropdown-item"
                                >
                                  Update Personal Info
                                </Link>
                                <Link
                                  to={`/admin/users/image/${user._id}`}
                                  className="users-list__dropdown-item"
                                >
                                  Update Image
                                </Link>
                                <Link
                                  // to={`/admin/users/fingerprint/${user._id}`}
                                  to={`/update-finger-print`}
                                  className="users-list__dropdown-item"
                                >
                                  Update Fingerprint
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="users-list__pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="users-list__pagination-button"
                >
                  Previous
                </button>

                <span className="users-list__pagination-info">
                  Page {pagination?.currentPage} of {pagination?.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination?.totalPages}
                  className="users-list__pagination-button"
                >
                  Next
                </button>

                <span className="users-list__pagination-total">
                  Total Items: {pagination?.totalItems}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersList;
