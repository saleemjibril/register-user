// pages/StudentDistributionHistory.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentDistributionHistory } from "../../apis";
import AdminLayout from "./Layout";
import moment from "moment";

const StudentDistributionHistory = () => {
    const { studentId } = useParams();
    const [history, setHistory] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchHistory = async (page = 1) => {
        setLoading(true);
        const res = await getStudentDistributionHistory(studentId, { page, limit: 10 });

        console.log("getStudentDistributionHistory", res);

        if (res?.status === 200) {
            setHistory(res.data.data.distributions || []);
            setPagination(res.data.data.pagination || {});
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHistory();
    }, [studentId]);

    return (
        <AdminLayout>
            <div>
                <header className="users-list__header">
                    <div>

                        <h2 className="users-list__title">Distribution History</h2>
                    </div>
                    <Link to="/registered">⬅ Back to Users</Link>
                </header>
                <div className="users-list__table-container">

                    {loading ? (
                        <p>Loading...</p>
                    ) : history.length === 0 ? (
                        <p>No distribution history found.</p>
                    ) : (
                        <table className="users-list__table">
                            <thead>
                                <tr>
                                    <th>Batch ID</th>
                                    <th>Brand</th>
                                    <th>Storage Location</th>
                                    <th>Quantity</th>
                                    <th>Reason</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record._id}>
                                        <td>{record.padBatchId}</td>
                                        <td>{record.brandType}</td>
                                        <td>{record.storageLocation}</td>
                                        <td>{record.distribution.quantityDistributed}</td>
                                        <td>{record.distribution.reason}</td>
                                        <td>{moment(record.distribution.createdAt).format('MMMM D, YYYY [at] h:mm:ss A')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}


                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div>
                            <button
                                disabled={pagination.currentPage === 1}
                                onClick={() => fetchHistory(pagination.currentPage - 1)}
                            >
                                Previous
                            </button>
                            <span>
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                                disabled={pagination.currentPage === pagination.totalPages}
                                onClick={() => fetchHistory(pagination.currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default StudentDistributionHistory;
