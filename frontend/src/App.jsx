import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "../pages/Home";
import BusinessListPage from "../pages/BusinessListPage";
import BusinessFormPage from "../pages/BusinessFormPage";
import NotFound from "../pages/NotFound";

import { ImHome } from "react-icons/im";
import { RiFileList3Fill } from "react-icons/ri";
import { MdOutlineDomainAdd } from "react-icons/md";

function App() {
  return (
    <Router>
      <nav className="gap-1 md:gap-3 bg-gray-800 text-white p-4 flex space-x-4">
        <Link to="/" className="hover:underline flex gap-2 md:tracking-[.3em]">
          <ImHome className="text-2xl"/>Home
        </Link>| 
        <Link to="/business" className="hover:underline flex gap-2 md:tracking-[.3em]">
          <RiFileList3Fill className="text-2xl"/>Business List
        </Link>|
        <Link to="/business/new" className="hover:underline flex gap-2 md:tracking-[.3em]">
          <MdOutlineDomainAdd className="text-2xl"/>Add Business
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/business" element={<BusinessListPage />} />
        <Route path="/business/new" element={<BusinessFormPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;