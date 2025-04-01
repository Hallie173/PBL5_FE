// src/Pages/Admin/Dashboard/Dashboard.js
import React from "react";
import { FiUsers, FiCalendar, FiArrowUpRight } from "react-icons/fi";
import { BiLandscape } from "react-icons/bi";
import { IoRestaurantOutline } from "react-icons/io5";
import { MdOutlineArticle, MdOutlineRateReview  } from "react-icons/md";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const STAT_CARDS = [
  {
    icon: FiUsers,
    label: "Total Users",
    value: "2.8K",
    trend: "12.5%",
    color: "from-purple-600 to-blue-500",
  },
  {
    icon: BiLandscape,
    label: "Attractions",
    value: "145",
    trend: "3.2%",
    color: "from-amber-600 to-orange-500",
  },
  {
    icon: FiCalendar,
    label: "Itineraries",
    value: "563",
    trend: "8.1%",
    color: "from-pink-600 to-rose-500",
  },
  {
    icon: IoRestaurantOutline,
    label: "Restaurants",
    value: "32",
    trend: "5.4%",
    color: "from-green-600 to-teal-500",
  },
  {
    icon: MdOutlineArticle,
    label: "Articles",
    value: "2.8K",
    trend: "12.5%",
    color: "from-yellow-600 to-green-500",
  },
  {
    icon: MdOutlineRateReview,
    label: "Reviews",
    value: "1.2K",
    trend: "3.2%",
    color: "from-blue-600 to-cyan-500",
  }
];

const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Web Visits",
      data: [6500, 5900, 8000, 8100, 5600, 5500],
      backgroundColor: "#4F46E5",
      borderRadius: 12,
      borderSkipped: false,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      backgroundColor: "#1E293B",
      titleFont: { size: 16 },
      bodyFont: { size: 14 },
      padding: 12,
    },
  },
  scales: {
    y: {
      grid: { color: "#E2E8F0" },
      ticks: { color: "#64748B", font: { weight: 500 } },
      title: { display: false },
    },
    x: {
      grid: { display: false },
      ticks: { color: "#64748B", font: { weight: 500 } },
    },
  },
};

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="group relative bg-gradient-to-br ${color} p-0.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="bg-white rounded-xl p-6 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        {/* Phần nội dung chính */}
        <div>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-4">{value}</p>
          <div className="flex items-center">
            <FiArrowUpRight className="h-5 w-5 text-green-600 mr-2" />
            <div className="flex items-center">
              <span className="text-sm font-medium text-green-600">
                {trend}
              </span>
              <span className="text-xs text-gray-500 ml-1.5 block">
                vs last month
              </span>
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${color} p-4 rounded-xl shadow-md`}>
          <Icon className="h-8 w-8 text-white transform transition-transform group-hover:scale-110" />
        </div>
      </div>
    </div>
  </div>
);

const RecentActivity = () => {
  const activities = [
    {
      user: "John Doe",
      action: "created itinerary",
      title: "Summer Vacation 2023",
      time: "2h ago",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      user: "Jane Smith",
      action: "updated location",
      title: "Paris, France",
      time: "4h ago",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      user: "Mike Johnson",
      action: "deleted review",
      title: "Hotel Review #123",
      time: "1d ago",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Recent Activity
      </h2>
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start group hover:bg-gray-50 p-3 rounded-lg transition-colors"
          >
            <img
              className="h-10 w-10 rounded-full ring-2 ring-white"
              src={activity.avatar}
              alt={activity.user}
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  {activity.user}
                </h3>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.action}{" "}
                <span className="font-medium text-indigo-600">
                  {activity.title}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">Analytics and recent activities</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {STAT_CARDS.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Website Traffic
                </h3>
                <span className="text-sm text-indigo-600 font-medium">
                  Last 6 months
                </span>
              </div>
              <div className="h-80">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
