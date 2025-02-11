import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "./Layout";
import { Link, useNavigate } from "react-router-dom";
import { getUsers } from "../../apis";
import { useSelector } from "react-redux";

const AdminUsersList = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // State Management
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

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
    physicalFitness: ""
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    sortBy: null,
    sortOrder: 'asc'
  });

  // Refs and Timeouts
  const searchTimeout = useRef(null);

  // Authentication Check
  useEffect(() => {
    if (!auth?.token) {
      navigate('/login');
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
        ...(sorting.sortBy ? { 
          sortBy: sorting.sortBy, 
          sortOrder: sorting.sortOrder 
        } : {})
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
    setSorting(prev => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter Change Handler
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  // Render Sorting Indicator
  const renderSortIndicator = (field) => {
    if (sorting.sortBy !== field) return null;
    return sorting.sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <AdminLayout>
      <div className="users-list">
        {/* Header Section */}
        <header className="users-list__header">
          <h2 className="users-list__title">Users</h2>
          <h2 className="users-list__registered">
            Registered users: <span>{pagination?.totalItems}</span>
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
                <option value="email">Email</option>
                <option value="phoneNumber">Phone</option>
                <option value="userId">User ID</option>
              </select>
            </div>
            <Link to="/create-user" className="users-list__add-link">
              <button className="users-list__add-button">Add User</button>
            </Link>
          </div>

       
          {/* Filter Selects */}
          <h2 className="users-list__registered">
            Filter:
          </h2>
          <div className="users-list__search-wrapper">
          {/* Disability Filter */}
            <select 
              value={filters.disability} 
              onChange={(e) => handleFilterChange('disability', e.target.value)}
              className="users-list__search-type"
            >
              <option value="">Disability</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            {/* Sex/Gender Filter */}
            <select 
              value={filters.sex} 
              onChange={(e) => handleFilterChange('sex', e.target.value)}
              className="users-list__search-type"

            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* Physical Fitness Filter */}
            <select 
              value={filters.physicalFitness} 
              onChange={(e) => handleFilterChange('physicalFitness', e.target.value)}
              className="users-list__search-type"
            >
              <option value="">Physical Fitness</option>
              <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
            </select>
            <select 
              value={filters.religion} 
              onChange={(e) => handleFilterChange('religion', e.target.value)}
              className="users-list__search-type"
            >
              <option value="">Religion</option>
              <option value="christianity">Christianity</option>
              <option value="islam">Islam</option>
            </select>

            <input type="text" placeholder="Filter by State"
            value={filters.state} 
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="users-list__search-type"
            />
            <input type="text" placeholder="Filter by LGA"
            value={filters.lga} 
            onChange={(e) => handleFilterChange('lga', e.target.value)}
            className="users-list__search-type"
            />

            {/* Add similar selects for other filters like state, lga, etc. */}
          </div>
        </header>

        {/* Users Table */}
        <div className="users-list__table-container">
          {isSearching ? (
            <div className="users-list__loading">Searching...</div>
          ) : (
            <>
              <table className="users-list__table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('userId')}>
                      ID{renderSortIndicator('userId')}
                    </th>
                    <th onClick={() => handleSort('names')}>
                      Name{renderSortIndicator('names')}
                    </th>
                    <th onClick={() => handleSort('phoneNumber')}>
                      Phone{renderSortIndicator('phoneNumber')}
                    </th>
                    <th onClick={() => handleSort('email')}>
                      Email{renderSortIndicator('email')}
                    </th>
                    <th onClick={() => handleSort('age')}>
                      Age{renderSortIndicator('age')}
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
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="users-list__pagination-button"
                >
                  Previous
                </button>

                <span className="users-list__pagination-info">
                  Page {pagination?.currentPage} of {pagination?.totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
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