import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "./Layout";
import { Link, useNavigate } from "react-router-dom";
import { downloadExcel, getUsersNumbers } from "../../apis";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";

const RegisteredUsers = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // State Management
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedLga, setSelectedLga] = useState("All");
  const [totalUsers, setTotalUsers] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState(0);
  const [mealData, setMealData] = useState(null);
  const [mealLoading, setMealLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  const dropdownRefs = useRef({});

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("names");

  // Comprehensive Filters
  const [filters, setFilters] = useState({
    disability: "",
    sex: "",
    state: "",
    lga: "",
    community: "",
    religion: "",
    physicalFitness: "",
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    sortBy: null,
    sortOrder: "asc",
  });

  // Refs and Timeouts
  const searchTimeout = useRef(null);

  // Authentication Check
  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
    }
  }, [auth, navigate]);

  const toggleMenu = (userId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === userId ? null : userId);
  };

  // Fetch Users with Comprehensive Filtering
  const fetchUsers = async (page = 1) => {
    setIsSearching(true);
    try {
      // Prepare filter parameters
      const filterParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );

      // Prepare search parameters
      const searchParams = searchTerm
        ? { term: searchTerm, type: searchType }
        : {};

      // Combine all parameters
      const params = {
        page,
        ...filterParams,
        ...searchParams,
        ...(sorting.sortBy
          ? {
              sortBy: sorting.sortBy,
              sortOrder: sorting.sortOrder,
            }
          : {}),
      };

      // Fetch users
      const response = await getUsersNumbers({
      startDate: "2025-06-10",
      endDate: "2025-06-12",
    });
      console.log("getUsersNumbers", response);

      // Update state
      setUsers(response?.data?.users || []);
      setPagination(response?.data?.pagination);
      setFilteredUsers(response?.data?.filteredUsers);
    } catch (error) {
      console.error("Fetch users error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced Search
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchUsers(currentPage);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, searchType, currentPage, filters, sorting]);

  // Sorting Handler
  const handleSort = (field) => {
    setSorting((prev) => ({
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  // Filter Change Handler
  const handleFilterChange = (filterName, value) => {
    console.log({
      filterName, value
    });

    
    
    setFilters((prev) => ({
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  // Render Sorting Indicator
  const renderSortIndicator = (field) => {
    if (sorting.sortBy !== field) return null;
    return sorting.sortOrder === "asc" ? " ▲" : " ▼";
  };

  const handleExportExcel = async (page = 1) => {
    try {
      setExcelLoading(true);
      // Prepare filter parameters
      const filterParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );

      // Prepare search parameters
      const searchParams = searchTerm
        ? { term: searchTerm, type: searchType }
        : {};

      // Combine all parameters

      const params = {
        page,
        ...filterParams,
        registeredUsersOnly: "true",
        ...searchParams,
        ...(sorting.sortBy
          ? {
              sortBy: sorting.sortBy,
              sortOrder: sorting.sortOrder,
            }
          : {}),
      };

      const response = await downloadExcel(
        {
      startDate: "2025-06-10",
      endDate: "2025-06-12",
    }
      );

      if (!response || response.status !== 200) {
        setExcelLoading(false);
        throw new Error("Export failed");
      }

      // Generate filename with date
      const date = new Date().toISOString().split("T")[0];
      const filename = `users_export_${date}.xlsx`;

      // Create blob from response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Download the file
      saveAs(blob, filename);
      setExcelLoading(false);
    } catch (error) {
      console.error("Export error:", error);
      // Handle error (show notification to user)
    }
  };

  return (
    <AdminLayout>
      <div className="users-list">
        {/* Header Section */}
        <header className="users-list__header">
          <h2 className="users-list__title">Users</h2>

          <div className="users-list__search-wrapper">
            <h2 className="users-list__registered">
              Registered users:{" "}
              {loading ? "Loading..." : <span>{filteredUsers}</span>}
            </h2>
            <select
              value={filters.lga}
              onChange={(e) => {
                setSelectedLga(e.target.value);
                handleFilterChange("lga", e.target.value);
              }}
              className="users-list__search-type"
            >
              <option value="">All</option>
              <option value="nasarawa eggon">Nasarawa Eggon</option>
              <option value="ikara">Ikara</option>
              <option value="zaria">Zaria</option>
              <option value="kokona">Kokona</option>
              <option value="akwanga">Akwanga</option>
              <option value="karu">Karu</option>
            </select>
            <select
              value={filters?.state}
              onChange={(e) => {
                setSelectedLga(e.target.value);
                handleFilterChange("state", e.target.value);
              }}
              className="users-list__search-type"
            >
              <option value="">Select State</option>
              <option value="nasarawa">Nasarawa</option>
              <option value="kaduna">Kaduna</option>
            </select>
          </div>
        </header>

        <button
          onClick={handleExportExcel}
          className="users-list__add-button"
          style={{ marginLeft: "10px" }}
          disabled={excelLoading}
        >
          {excelLoading ? "Loading..." : "Export to Excel"}
          {/* Users Table */}
        </button>
        <br />
        <br />
        <div className="users-list__table-container">
          {isSearching ? (
            <div className="users-list__loading">Searching...</div>
          ) : (
            <>
              <table className="users-list__table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("userId")}>
                      ID{renderSortIndicator("userId")}
                    </th>
                    <th onClick={() => handleSort("names")}>
                      Name{renderSortIndicator("names")}
                    </th>
                    <th onClick={() => handleSort("phoneNumber")}>
                      Phone{renderSortIndicator("phoneNumber")}
                    </th>
                    <th onClick={() => handleSort("email")}>
                      Email{renderSortIndicator("email")}
                    </th>
                    <th onClick={() => handleSort("age")}>
                      Age{renderSortIndicator("age")}
                    </th>
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
                      <td>{user?.age}</td>
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
                                {auth?.userInfo?.role === "health" && <Link
                                  to={`/health/user/${user._id}`}
                                  className="users-list__dropdown-item"
                                >
                                  Record Health Appointment
                                </Link>}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="users-list__pagination">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="users-list__pagination-button"
                >
                  Previous
                </button>

                <span className="users-list__pagination-info">
                  Page {pagination?.currentPage} of {pagination?.totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.totalPages, prev + 1)
                    )
                  }
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

export default RegisteredUsers;
