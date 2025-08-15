import React, { useState, useEffect } from "react";
import { Package, Users, TrendingUp, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import AdminLayout from "./Layout";
import { getDailyDistributionReport } from "../../apis";

// Mock API placeholders
// Replace with your real API calls
const fetchDistributionStats = async () => {
  return {
    totalPadsDistributed: 12450,
    totalDonors: 35,
    avgDaily: 178,
    avgMonthly: 5340,
    timeSeries: [
      { date: "2025-08-01", quantity: 120 },
      { date: "2025-08-02", quantity: 150 },
      { date: "2025-08-03", quantity: 90 },
      { date: "2025-08-04", quantity: 200 },
      { date: "2025-08-05", quantity: 170 },
    ],
    topDonors: [
      { name: "UNICEF", total: 3000 },
      { name: "Always Ultra", total: 2000 },
      { name: "Community Health Org", total: 1500 },
    ],
    breakdownAge: [
      { name: "10-13", value: 3200 },
      { name: "14-16", value: 4800 },
      { name: "17-19", value: 3200 },
      { name: "20+", value: 1250 },
    ],
    breakdownDisability: [
      { name: "No Disability", value: 10500 },
      { name: "Physical", value: 1200 },
      { name: "Visual", value: 400 },
      { name: "Hearing", value: 350 },
    ],
  };
};


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

const PadDistributionInsightsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

//   useEffect(() => {
//     const loadStats = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchDistributionStats();
//         setStats(data);
//       } catch (err) {
//         console.error("Error fetching pad distribution stats:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadStats();
//   }, []);


const handleGetPadDistributionInsights = async () => {
    setLoading(true);

    const response = await getDailyDistributionReport();
    console.log("getDailyDistributionReport", response);
    setStats(response?.data?.data)
    // const response2 = await getPadDistributionInsights();
    // console.log("getPadDistributionInsights", response2);
    setLoading(false);

}

useEffect(() => {
    handleGetPadDistributionInsights();
}, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading distribution insights...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Pad Distribution Insights</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            icon={<Package className="text-[#d9b34e]" size={24} />}
            label="Total Pads Distributed"
            value={stats.totalPadsDistributed.toLocaleString()}
          />
          <SummaryCard
            icon={<Users className="text-[#d9b34e]" size={24} />}
            label="Total Donors"
            value={stats.totalDonors}
          />
          <SummaryCard
            icon={<TrendingUp className="text-[#d9b34e]" size={24} />}
            label="Avg Daily Distribution"
            value={stats.avgDaily.toLocaleString()}
          />
          <SummaryCard
            icon={<Award className="text-[#d9b34e]" size={24} />}
            label="Avg Monthly Distribution"
            value={stats.avgMonthly.toLocaleString()}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Time Series Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Pads Distributed Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="quantity" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Donors Table */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Top Donors/Suppliers</h3>
            <table className="min-w-full text-lg">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Total Pads Supplied</th>
                </tr>
              </thead>
              <tbody>
                {stats.topDonors.map((donor, i) => (
                  <tr key={i} className="border-b last:border-none">
                    <td className="py-2">{donor.name}</td>
                    <td className="py-2">{donor.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakdown Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Distribution by Age Group</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.breakdownAge}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {stats.breakdownAge.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Distribution by Disability Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.breakdownDisability}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  fill="#82ca9d"
                  label
                >
                  {stats.breakdownDisability.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
    <div className="p-3 rounded-full" style={{ backgroundColor: "#d9b34e20" }}>
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-lg text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default PadDistributionInsightsPage;
