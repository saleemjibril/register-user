import React, { useEffect, useState } from "react";
import AdminLayout from "./Layout";
import { useNavigate } from "react-router-dom";
import { getUsersNumbers, downloadExcel } from "../../apis";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";
import moment from "moment";

const RegisteredUsers = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  // Auth check
  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
    }
  }, [auth, navigate]);

  // Fetch users
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getUsersNumbers({ page });
      console.log("getUsersNumbers", res);
      
      if (res?.status === 200) {
        setUsers(res.data.users || []);
        setPagination(res.data.pagination || {});
      }
    } catch (error) {
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [pagination.currentPage]);

  // Redirect to student history page
  const handleRowClick = (userId) => {
    navigate(`/admin/users/${userId}/distribution-history`);
  };

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      setExcelLoading(true);

      const response = await downloadExcel({
        startDate: "2025-06-10", // you can make this dynamic if needed
        endDate: "2025-06-22",
      });

      if (!response || response.status !== 200) {
        throw new Error("Export failed");
      }

      const date = new Date().toISOString().split("T")[0];
      const filename = `users_export_${date}.xlsx`;

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, filename);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="users-list">
        {/* Header */}
        <header className="users-list__header">
          <div>
            <h2 className="users-list__title">Registered Students</h2>
          </div>
            <h3>
              Total Registered:{" "}
              {loading ? "Loading..." : pagination.totalItems || 0}
            </h3>
          <button
            onClick={handleExportExcel}
            className="users-list__add-button"
            disabled={excelLoading}
          >
            {excelLoading ? "Exporting..." : "Export to Excel"}
          </button>
        </header>

        {/* Users Table */}
        <div className="users-list__table-container">
          {loading ? (
            <div className="users-list__loading">Loading...</div>
          ) : (
            <>
              <table className="users-list__table">
                <thead>
                  <tr>
                  <th>
                      ID
                    </th>
                    <th>
                      Name
                    </th>
                    <th>
                      Age
                    </th>
                    <th>
                      Grade
                    </th>
                    <th>
                      Disability
                    </th>
                    <th>
                      Gender
                    </th>
                    <th>
                      Date registered
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(user._id)}
                    >
                      <td>{user?.userId}</td>
                      <td>{user?.names}</td>
                      <td>{user?.age}</td>
                      <td>{user?.gradeLevel}</td>
                      <td>{user?.disabilityType}</td>
                      <td>{user?.sex}</td>
                      <td>{moment(user?.createdAt).format('MMMM D, YYYY [at] h:mm:ss A')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="users-list__pagination">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: Math.max(1, prev.currentPage - 1),
                    }))
                  }
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: Math.min(
                        pagination.totalPages,
                        prev.currentPage + 1
                      ),
                    }))
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RegisteredUsers;
