// src/pages/admin/FilterByYearPage.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";

const FilterByYearPage = () => {
  const { year } = useParams();
  const [selectedYear, setSelectedYear] = useState(year || new Date().getFullYear().toString());
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [yearList, setYearList] = useState([]);

  useEffect(() => {
    fetchYearList();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchData();
    }
  }, [selectedYear, statusFilter]);

  const fetchYearList = async () => {
    try {
      // You might want to create an endpoint for this or extract from existing data
      // For now, generate last 10 years
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());
      setYearList(years);
    } catch (error) {
      console.error("Error fetching year list:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/analysis/by-year/${selectedYear}${
        statusFilter ? `?status=${statusFilter}` : ''
      }`;
      const res = await axiosInstance.get(url);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching year data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Businesses by Year</h1>
      
      {/* Year Selection and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Year</label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {yearList.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="step1">Step 1</option>
              <option value="step2">Step 2</option>
              <option value="step3">Step 3</option>
              <option value="complete">Complete</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {data && data.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Businesses</h3>
            <p className="text-3xl font-bold text-blue-600">{data.statistics.total}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Status Distribution</h3>
            <div className="space-y-2">
              {Object.entries(data.statistics.statusCounts).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="capitalize">{status}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Monthly Distribution</h3>
            <div className="space-y-2">
              {Object.entries(data.statistics.monthlyData)
                .sort(([a], [b]) => a - b)
                .map(([month, count]) => (
                  <div key={month} className="flex justify-between items-center">
                    <span>{new Date(0, month - 1).toLocaleString('default', { month: 'long' })}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Business List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">
            Businesses in {selectedYear} ({data?.data?.length || 0} records)
          </h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : data?.data?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.data.map((business) => (
                  <tr key={business._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {business.controlNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {business.firstname} {business.lastname}
                    </td>
                    <td className="px-6 py-4">{business.businessName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        business.status === 'complete' ? 'bg-green-100 text-green-800' :
                        business.status === 'step1' ? 'bg-blue-100 text-blue-800' :
                        business.status === 'step2' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {business.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(business.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-400 mb-2">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">No businesses found for year {selectedYear}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterByYearPage;