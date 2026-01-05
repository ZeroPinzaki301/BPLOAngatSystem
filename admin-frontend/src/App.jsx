// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import AdminAnalysisDashboard from "../pages/AdminAnalysisDashboard";
import AllBusinesses from "../pages/AllBusinessesPage";
import SearchByName from "../pages/SearchByNamePage";
import SearchByAddress from "../pages/SearchByAddressPage";
import FilterByYear from "../pages/FilterByYearPage";

// Simple Navigation Component
function Navigation() {
  const location = useLocation();
  
  const navLinks = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/all-businesses", label: "All Businesses", icon: "📋" },
    { path: "/search-name", label: "Search by Name", icon: "🔍" },
    { path: "/search-address", label: "Search by Address", icon: "📍" },
    { path: "/by-year", label: "By Year", icon: "📅" },
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold">Business Registry</div>
          </div>
          <div className="flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<AdminAnalysisDashboard />} />
            <Route path="/all-businesses" element={<AllBusinesses />} />
            <Route path="/search-name" element={<SearchByName />} />
            <Route path="/search-address" element={<SearchByAddress />} />
            <Route path="/by-year" element={<FilterByYear />} />
            <Route path="/by-year/:year" element={<FilterByYear />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;