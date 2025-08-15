import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "./Layout";
import { Link, useNavigate } from "react-router-dom";
import {
  downloadExcel,
  getAllInventory,
  getTodaysMealRecords,
  getUsers,
  getUsersNumbers,
} from "../../apis";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";
import moment from "moment";
import {
  Package, Search, Filter, Download, Plus, Edit, Trash2,
  AlertTriangle, CheckCircle, XCircle, Clock, Eye,
  ChevronLeft, ChevronRight, RefreshCw, MapPin, User
} from 'lucide-react';

const AdminUsersList = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
console.log("auth", auth);

  // State Management
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mealData, setMealData] = useState(null);
  const [mealLoading, setMealLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [summary, setSummary] = useState(null);

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
      const response = await getUsers(params);
      console.log("getUsers", response);

      // Update state
      setUsers(response?.data?.users || []);
      setPagination(response?.data?.pagination);
    } catch (error) {
      console.error("Fetch users error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGetTodaysMealRecords = async () => {
    setMealLoading(true);
    const response = await getTodaysMealRecords();
    console.log("getTodaysMealRecords", response);

    if (response?.status === 200) {
      setMealData(response?.data);
    }

    setMealLoading(false);
  };

  useEffect(() => {
    handleGetTodaysMealRecords();
    handleGetAllInventory();
  }, []);

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
    setFilters((prev) => ({
      ...prev,
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
        ...searchParams,
        ...(sorting.sortBy
          ? {
              sortBy: sorting.sortBy,
              sortOrder: sorting.sortOrder,
            }
          : {}),
      };

      const response = await downloadExcel(params);

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


  const handleGetAllInventory = async () => {
    // setLoading(true);
    try {
      const response = await getAllInventory();

      if (response?.data?.data?.inventory) {
        // Create summary from real data
        const inventory = response.data.data.inventory;
        const summary = {
          totalBatches: inventory.length,
          totalSupplied: inventory.reduce((sum, item) => sum + item.quantitySupplied, 0),
          totalCurrentStock: inventory.reduce((sum, item) => sum + item.currentStock, 0),
          totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
          activeBatches: inventory.filter(item => item.status === 'active').length,
          depletedBatches: inventory.filter(item => item.status === 'depleted').length,
          expiredBatches: inventory.filter(item => item.status === 'expired').length,
          lowStockBatches: inventory.filter(item => item.isLowStock).length
        };
        setSummary(summary);
      }
    } catch (error) {
      console.error("Fetch inventory error:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="users-list">
        {/* Header Section */}
        <header className="users-list__header">
          <h2 className="users-list__title">Users</h2>

          <h2 className="users-list__meals">
            <div>
              Breakfast:{" "}
              {mealLoading ? "Loading..." : <span>{mealData?.breakfast}</span>}
            </div>
            <div>
              Lunch:{" "}
              {mealLoading ? "Loading..." : <span>{mealData?.lunch}</span>}
            </div>
            <div>
              Dinner:{" "}
              {mealLoading ? "Loading..." : <span>{mealData?.dinner}</span>}
            </div>
          </h2>

          {/* Search Container */}
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
                {/* <option value="email">Email</option>
                <option value="phoneNumber">Phone</option> */}
                <option value="userId">User ID</option>
              </select>
            </div>
            <Link to="/create-user" className="users-list__add-link">
              <button className="users-list__add-button">Add User</button>
            </Link>
          </div>

          {/* Filter Selects */}
          <h2 className="users-list__registered">Filter:</h2>
          <div className="users-list__search-wrapper">
            {/* Disability Filter */}
            <select
              value={filters.disability}
              onChange={(e) => handleFilterChange("disability", e.target.value)}
              className="users-list__search-type"
            >
              <option value="">Disability</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            {/* Sex/Gender Filter */}
            <select
              value={filters.sex}
              onChange={(e) => handleFilterChange("sex", e.target.value)}
              className="users-list__search-type"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* Physical Fitness Filter */}
            {/* <select
              value={filters.physicalFitness}
              onChange={(e) =>
                handleFilterChange("physicalFitness", e.target.value)
              }
              className="users-list__search-type"
            >
              <option value="">Physical Fitness</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select> */}
            {/* <select
              value={filters.religion}
              onChange={(e) => handleFilterChange("religion", e.target.value)}
              className="users-list__search-type"
            >
              <option value="">Religion</option>
              <option value="christianity">Christianity</option>
              <option value="islam">Islam</option>
            </select> */}

            {/* <input
              type="text"
              placeholder="Filter by State"
              value={filters.state}
              onChange={(e) => handleFilterChange("state", e.target.value)}
              className="users-list__search-type"
            />
            <input
              type="text"
              placeholder="Filter by LGA"
              value={filters.lga}
              onChange={(e) => handleFilterChange("lga", e.target.value)}
              className="users-list__search-type"
            /> */}

            {/* <select
              value={filters.operator}
              onChange={(e) => handleFilterChange("operator", e.target.value)}
              className="users-list__search-type"
            >
              <option value="">Operator</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select> */}

            {/* Add similar selects for other filters like state, lga, etc. */}
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

          {/* Summary Cards */}
{summary && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: '#d9b34e20' }}>
          <Package className="text-[#d9b34e]" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-lg text-gray-600">Total Batches</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalBatches}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: '#d9b34e20' }}>
          <CheckCircle className="text-[#d9b34e]" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-lg text-gray-600">Current Stock</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalCurrentStock.toLocaleString()}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: '#d9b34e20' }}>
          <AlertTriangle className="text-[#d9b34e]" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-lg text-gray-600">Low Stock Items</p>
          <p className="text-2xl font-bold text-gray-900">{summary.lowStockBatches}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: '#d9b34e20' }}>
          <Package className="text-[#d9b34e]" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-lg text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">₦{summary.totalValue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
)}
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
                    <th onClick={() => handleSort("age")}>
                      Age{renderSortIndicator("age")}
                    </th>
                    <th onClick={() => handleSort("gradeLevel")}>
                      Grade{renderSortIndicator("gradeLevel")}
                    </th>
                    <th onClick={() => handleSort("disability")}>
                      Disability{renderSortIndicator("disability")}
                    </th>
                    <th onClick={() => handleSort("sex")}>
                      Gender{renderSortIndicator("sex")}
                    </th>
                    <th onClick={() => handleSort("createdAt")}>
                      Date registered{renderSortIndicator("createdAt")}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user?._id}>
                      <td>{user?.userId}</td>
                      <td>{user?.names}</td>
                      <td>{user?.age}</td>
                      <td>{user?.gradeLevel}</td>
                      <td>{user?.disabilityType}</td>
                      <td>{user?.sex}</td>
                      <td>{moment(user?.createdAt).format('MMMM D, YYYY [at] h:mm:ss A')}</td>
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
                                {auth?.userInfo?.role === "health" && (
                                  <Link
                                    to={`/health/user/${user._id}`}
                                    className="users-list__dropdown-item"
                                  >
                                    Record Health Appointment
                                  </Link>
                                )}
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

export default AdminUsersList;
