// src/Pages/Admin/Dashboard/Dashboard.js
import React from "react";
import { FiUsers, FiMap, FiCalendar } from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dữ liệu thẻ thống kê
const STAT_CARDS = [
  { icon: FiUsers, label: "Total Users", value: 150, color: "bg-indigo-600" },
  { icon: FiMap, label: "Total Locations", value: 45, color: "bg-yellow-600" },
  { icon: FiCalendar, label: "Total Itineraries", value: 203, color: "bg-red-600" },
];

// Dữ liệu cho biểu đồ lượng truy cập web
const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Web Visits",
      data: [1200, 1900, 3000, 2500, 4000, 3500], // Số lượt truy cập giả định
      backgroundColor: "rgba(34, 197, 94, 0.7)", // Màu xanh lá (green-500)
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Monthly Web Visits" },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: { display: true, text: "Number of Visits" },
    },
    x: {
      title: { display: true, text: "Months" },
    },
  },
};

// Thành phần StatCard
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white shadow-lg rounded-xl p-5 flex items-center transform hover:scale-105 transition-transform duration-200">
    <div className={`${color} p-3 rounded-full mr-4`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Thành phần RecentActivity
const RecentActivity = () => (
  <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
    <ul className="space-y-4">
      <li className="flex items-center">
        <img
          className="h-10 w-10 rounded-full mr-3"
          src="https://via.placeholder.com/40"
          alt="User"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-800">John Doe</h3>
            <p className="text-xs text-gray-500">2h ago</p>
          </div>
          <p className="text-sm text-gray-600">
            Created a new itinerary: "Summer Vacation 2023"
          </p>
        </div>
      </li>
    </ul>
  </div>
);

// Thành phần Chart
const StatsChart = () => (
  <div className="bg-white shadow-lg rounded-xl p-6 mt-8 max-w-3xl mx-auto">
    <Bar data={chartData} options={chartOptions} />
  </div>
);

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STAT_CARDS.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              label={card.label}
              value={card.value}
              color={card.color}
            />
          ))}
        </div>

        <StatsChart />

        <RecentActivity />
      </main>
    </div>
  );
}