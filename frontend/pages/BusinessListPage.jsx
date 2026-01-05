import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const BusinessListPage = () => {
  const [businesses, setBusinesses] = useState([]);

  const fetchBusinesses = async () => {
    try {
      const res = await axiosInstance.get("/api/businesses");
      setBusinesses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <div className="">
      <div className="flex items-center h-[3.5em] md:h-[5.5em] bg-linear-to-r from-blue-600 via-cyan-400 to-blue-500 p-6">
        <h2 className="md:text-4xl text-2xl font-bold tracking-[.25em] text-white">Business List</h2>
      </div> 

      <hr className="my-2"/>

      <Link
        to="/business/new"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Add Business
      </Link>
      <div className="px-6">
        <table className="min-w-full bg-white border ">
          <thead className="bg-sky-400">
            <tr>
              <th className="px-4 py-2 border">Control #</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Business</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b._id}>
                <td className="border px-4 py-2">{b.controlNumber}</td>
                <td className="border px-4 py-2">
                  {b.firstname} {b.lastname}
                </td>
                <td className="border px-4 py-2">{b.businessName}</td>
                <td className="border px-4 py-2">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessListPage;