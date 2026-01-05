import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminAnalysisDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [recentYears, setRecentYears] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/analysis/dashboard");
      setStats(res.data.data);
      
      // Get data for last 6 years
      const currentYear = new Date().getFullYear();
      const yearData = [];
      
      // Always show last 6 years, even if some have 0 data
      for (let i = 5; i >= 0; i--) {
        const year = currentYear - i;
        const yearStr = year.toString();
        
        // Find data for this year from backend response
        const yearStats = res.data.data.yearlyDistribution?.find(y => y._id === yearStr);
        
        yearData.push({
          year: yearStr,
          count: yearStats ? yearStats.count : 0
        });
      }
      
      setRecentYears(yearData);
      prepareChartData(yearData);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Even if API fails, show the chart with empty data
      generateEmptyChartData();
    } finally {
      setLoading(false);
    }
  };

  const generateEmptyChartData = () => {
    const currentYear = new Date().getFullYear();
    const emptyYears = [];
    
    for (let i = 5; i >= 0; i--) {
      const year = currentYear - i;
      emptyYears.push({
        year: year.toString(),
        count: 0
      });
    }
    
    setRecentYears(emptyYears);
    prepareChartData(emptyYears);
  };

  const prepareChartData = (yearData) => {
    const currentYear = new Date().getFullYear().toString();
    
    const labels = yearData.map(item => item.year);
    const data = yearData.map(item => item.count);
    
    const backgroundColors = yearData.map(item => 
      item.year === currentYear 
        ? 'rgba(59, 130, 246, 0.8)'  // Blue for current year
        : 'rgba(59, 130, 246, 0.5)'  // Lighter blue for previous years
    );
    
    const borderColors = yearData.map(item => 
      item.year === currentYear 
        ? 'rgb(37, 99, 235)'  // Darker blue border for current year
        : 'rgb(96, 165, 250)' // Lighter blue border for previous years
    );
    
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Businesses Registered',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(59, 130, 246, 0.9)',
        }
      ]
    };
    
    setChartData(chartData);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: false, // We'll use our own title
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 14,
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `Businesses: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(209, 213, 219, 0.3)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6b7280',
          padding: 10,
          stepSize: 1, // Show every integer value
        },
        title: {
          display: true,
          text: 'Number of Businesses',
          font: {
            size: 14,
            weight: '600',
          },
          color: '#374151',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: '500',
          },
          color: '#4b5563',
        },
        title: {
          display: true,
          text: 'Year',
          font: {
            size: 14,
            weight: '600',
          },
          color: '#374151',
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800">Admin Analysis Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-2">Total Businesses</h3>
          <p className="text-xl md:text-3xl font-bold text-blue-600">{stats?.totalBusinesses || 0}</p>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-2">Current Year</h3>
          <p className="text-xl md:text-3xl font-bold text-green-600">{stats?.currentYearBusinesses || 0}</p>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-2">Complete Status</h3>
          <p className="text-xl md:text-3xl font-bold text-purple-600">
            {stats?.statusDistribution?.find(s => s._id === 'complete')?.count || 0}
          </p>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-2">Recent Activities</h3>
          <p className="text-xl md:text-3xl font-bold text-orange-600">{stats?.recentBusinesses?.length || 0}</p>
        </div>
      </div>

      {/* Yearly Bar Graph Section */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">Business Registration Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Last 6 years including current ({new Date().getFullYear()})</p>
          </div>
          <Link
            to="/by-year"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            <span>View Year Details</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {chartData ? (
          <>
            <div className="h-64 md:h-80 mb-4 md:mb-6">
              <Bar data={chartData} options={chartOptions} />
            </div>
            
            {/* Yearly Data Summary */}
            <div className="border-t border-gray-100 pt-4 md:pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Yearly Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {recentYears.map((yearData) => {
                  const isCurrentYear = yearData.year === new Date().getFullYear().toString();
                  return (
                    <div 
                      key={yearData.year} 
                      className={`p-3 rounded-lg text-center ${isCurrentYear ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                    >
                      <div className={`text-sm font-medium ${isCurrentYear ? 'text-blue-700' : 'text-gray-600'}`}>
                        {yearData.year}
                        {isCurrentYear && <span className="ml-1 text-xs">(Current)</span>}
                      </div>
                      <div className="text-xl font-bold mt-1">{yearData.count}</div>
                      <div className="text-xs text-gray-500 mt-1">businesses</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Summary Statistics */}
            {chartData && (
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Highest Year</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {(() => {
                        const maxData = Math.max(...chartData.datasets[0].data);
                        const maxIndex = chartData.datasets[0].data.indexOf(maxData);
                        return maxData > 0 ? `${chartData.labels[maxIndex]} (${maxData})` : 'No Data';
                      })()}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Total Last 6 Years</div>
                    <div className="text-lg font-semibold text-green-600">
                      {chartData.datasets[0].data.reduce((a, b) => a + b, 0)}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Average per Year</div>
                    <div className="text-lg font-semibold text-purple-600">
                      {Math.round(chartData.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.datasets[0].data.length)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <p className="text-gray-500">Chart data could not be loaded</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-700">Quick Analysis Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Link
            to="/search-name"
            className="bg-blue-50 hover:bg-blue-100 p-3 md:p-4 rounded-lg border border-blue-100 shadow-sm transition-colors group"
          >
            <div className="flex items-center">
              <div className="text-lg md:text-xl mr-2 group-hover:scale-110 transition-transform">🔍</div>
              <div>
                <h3 className="font-medium text-blue-800">Search by Name</h3>
                <p className="text-xs md:text-sm text-blue-600 mt-0.5">Find businesses by name</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/search-address"
            className="bg-green-50 hover:bg-green-100 p-3 md:p-4 rounded-lg border border-green-100 shadow-sm transition-colors group"
          >
            <div className="flex items-center">
              <div className="text-lg md:text-xl mr-2 group-hover:scale-110 transition-transform">📍</div>
              <div>
                <h3 className="font-medium text-green-800">Search by Address</h3>
                <p className="text-xs md:text-sm text-green-600 mt-0.5">Find businesses by location</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/by-year"
            className="bg-purple-50 hover:bg-purple-100 p-3 md:p-4 rounded-lg border border-purple-100 shadow-sm transition-colors group"
          >
            <div className="flex items-center">
              <div className="text-lg md:text-xl mr-2 group-hover:scale-110 transition-transform">📅</div>
              <div>
                <h3 className="font-medium text-purple-800">Filter by Year</h3>
                <p className="text-xs md:text-sm text-purple-600 mt-0.5">View businesses by year</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/all-businesses"
            className="bg-orange-50 hover:bg-orange-100 p-3 md:p-4 rounded-lg border border-orange-100 shadow-sm transition-colors group"
          >
            <div className="flex items-center">
              <div className="text-lg md:text-xl mr-2 group-hover:scale-110 transition-transform">📊</div>
              <div>
                <h3 className="font-medium text-orange-800">All Businesses</h3>
                <p className="text-xs md:text-sm text-orange-600 mt-0.5">Advanced filters & search</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Businesses */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700">Recent Businesses</h2>
          <Link
            to="/all-businesses"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </Link>
        </div>
        
        {stats?.recentBusinesses?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control #</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentBusinesses.map((business) => (
                  <tr key={business._id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className="font-mono text-xs md:text-sm bg-gray-100 px-2 py-1 rounded">
                        {business.controlNumber}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{business.firstname} {business.lastname}</span>
                        {business.middlename && (
                          <span className="text-xs text-gray-500">{business.middlename}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="max-w-[150px] md:max-w-none truncate" title={business.businessName}>
                        {business.businessName}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        business.status === 'complete' ? 'bg-green-100 text-green-800' :
                        business.status === 'step1' ? 'bg-blue-100 text-blue-800' :
                        business.status === 'step2' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {business.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {new Date(business.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent businesses found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalysisDashboard;