import React from "react";
import { 
  Eye, 
  AlertTriangle, 
  Users, 
  Clock, 
  CheckCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const DashboardPage = () => {
  const stats = [
    {
      title: "Active Exams",
      value: "24",
      change: "+12% vs last week",
      changeType: "positive",
      icon: Eye,
      iconColor: "text-blue-600"
    },
    {
      title: "Incidents Detected",
      value: "7",
      change: "-23% vs last week",
      changeType: "negative",
      icon: AlertTriangle,
      iconColor: "text-red-600"
    },
    {
      title: "Students Monitored",
      value: "1,247",
      change: "+8% vs last week",
      changeType: "positive",
      icon: Users,
      iconColor: "text-green-600"
    },
    {
      title: "Avg. Exam Duration",
      value: "2h 15m",
      change: "+5m vs last week",
      changeType: "positive",
      icon: Clock,
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, Administrator 👋
                </h1>
                <p className="text-gray-600">
                  Review incidents and generate investigation reports.
                </p>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-700 font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gray-50`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                    <div className="flex items-center">
                      {stat.changeType === "positive" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Today's Activity</h2>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>
            
            {/* Placeholder for chart */}
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-600">Activity chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;