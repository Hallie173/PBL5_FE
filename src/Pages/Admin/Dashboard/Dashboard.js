import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  MapPin,
  Utensils,
  FileText,
  MessageSquare,
  Activity,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";

const apiService = {
  async getStats() {
    try {
      const [usersRes, attractionsRes, restaurantsRes] = await Promise.all([
        axios.get(`${BASE_URL}/users`),
        axios.get(`${BASE_URL}/attractions`),
        axios.get(`${BASE_URL}/restaurants`),
      ]);

      const users = usersRes.data;
      const attractions = attractionsRes.data;
      const restaurants = restaurantsRes.data;

      return {
        users: {
          total: Array.isArray(users) ? users.length : users.total || 0,
          trend: 15.3,
          change: "up",
        },
        attractions: {
          total: Array.isArray(attractions)
            ? attractions.length
            : attractions.total || 0,
          trend: 8.7,
          change: "up",
        },
        restaurants: {
          total: Array.isArray(restaurants)
            ? restaurants.length
            : restaurants.total || 0,
          trend: -2.1,
          change: "down",
        },
        itineraries: { total: 563, trend: 12.4, change: "up" },
        articles: { total: 2847, trend: 5.8, change: "up" },
        reviews: { total: 8934, trend: 18.2, change: "up" },
      };
    } catch (error) {
      console.error("API Error:", error);
      throw new Error("Failed to fetch data");
    }
  },

  async getTrafficData() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [4200, 5100, 4800, 6200, 5800, 7100],
    };
  },

  async getRecentActivities() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        user: "Nguyễn Văn A",
        action: "đã tạo bài viết",
        title: "Top 10 địa điểm du lịch Đà Nẵng",
        time: "2 phút trước",
        avatar:
          "https://ui-avatars.com/api/?name=A&background=6366f1&color=fff",
      },
      {
        id: 2,
        user: "Trần Thị B",
        action: "đã đánh giá",
        title: "Nhà hàng Hoa Sen",
        time: "15 phút trước",
        avatar:
          "https://ui-avatars.com/api/?name=B&background=ec4899&color=fff",
      },
      {
        id: 3,
        user: "Lê Minh C",
        action: "đã thêm địa điểm",
        title: "Bãi biển Mỹ Khê",
        time: "1 giờ trước",
        avatar:
          "https://ui-avatars.com/api/?name=C&background=10b981&color=fff",
      },
      {
        id: 4,
        user: "Phạm Thu D",
        action: "đã tạo lịch trình",
        title: "Du lịch Hội An 3 ngày",
        time: "3 giờ trước",
        avatar:
          "https://ui-avatars.com/api/?name=D&background=f59e0b&color=fff",
      },
    ];
  },
};

const STAT_CONFIG = [
  {
    key: "users",
    icon: Users,
    label: "Người dùng",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    key: "attractions",
    icon: MapPin,
    label: "Điểm tham quan",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    key: "restaurants",
    icon: Utensils,
    label: "Nhà hàng",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    key: "itineraries",
    icon: Calendar,
    label: "Lịch trình",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    key: "articles",
    icon: FileText,
    label: "Bài viết",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    key: "reviews",
    icon: MessageSquare,
    label: "Đánh giá",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
  },
];

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  change,
  color,
  bgColor,
  iconColor,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mb-3">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <div className="flex items-center">
          <TrendingUp
            className={`h-4 w-4 mr-1 ${
              change === "up" ? "text-green-500" : "text-red-500"
            } ${change === "down" ? "rotate-180" : ""}`}
          />
          <span
            className={`text-sm font-medium ${
              change === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
        </div>
      </div>
      <div className={`${bgColor} p-3 rounded-lg`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const SimpleBarChart = ({ data, labels }) => {
  const maxValue = Math.max(...data);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end h-48 px-2">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1 mx-1">
            <div
              className="bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-md w-full min-h-[4px] transition-all duration-700 ease-out"
              style={{ height: `${(value / maxValue) * 100}%` }}
            />
            <span className="text-xs text-gray-600 mt-2 font-medium">
              {labels[index]}
            </span>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Lượt truy cập hàng tháng (k)</p>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <img
      className="h-10 w-10 rounded-full border-2 border-gray-100"
      src={activity.avatar}
      alt={activity.user}
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900 truncate">
          {activity.user}
        </p>
        <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
          {activity.time}
        </p>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {activity.action}{" "}
        <span className="font-medium text-indigo-600">{activity.title}</span>
      </p>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-20 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [trafficData, setTrafficData] = useState({ labels: [], data: [] });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const [statsData, trafficData, activitiesData] = await Promise.all([
        apiService.getStats(),
        apiService.getTrafficData(),
        apiService.getRecentActivities(),
      ]);

      setStats(statsData);
      setTrafficData(trafficData);
      setActivities(activitiesData);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
          </div>
        </header>
        <main className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Cập nhật: {lastUpdated.toLocaleTimeString("vi-VN")}
                </span>
              )}
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Activity className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {STAT_CONFIG.map((config) => {
            const data = stats[config.key] || {};
            return (
              <StatCard
                key={config.key}
                icon={config.icon}
                label={config.label}
                value={data.total || 0}
                trend={data.trend || 0}
                change={data.change || "up"}
                color={config.color}
                bgColor={config.bgColor}
                iconColor={config.iconColor}
              />
            );
          })}
        </div>

        {/* Charts and Activities */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Traffic Chart */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold text-gray-900">
                  Lượt truy cập Website
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  6 tháng gần đây
                </span>
              </div>
              <div className="h-80">
                <SimpleBarChart
                  data={trafficData.data}
                  labels={trafficData.labels}
                />
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Hoạt động gần đây
              </h3>
              <div className="space-y-1">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Không có hoạt động gần đây
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
