import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const BusinessFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    businessName: "",
    address: "",
    status: "complete",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/businesses", formData);
      navigate("/business");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="">
      <div className="flex items-center h-[3.5em] md:h-[5.5em] bg-linear-to-r from-blue-600 via-cyan-400 to-blue-500 p-6">
        <h2 className="md:text-4xl text-2xl font-bold tracking-[.25em] text-white">Add Business</h2>
      </div> 

      <hr className="my-2"/>

      <div className="w-[60em] mx-auto bg-sky-400 p-5 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {["firstname", "middlename", "lastname", "businessName", "address"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize ">{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="border rounded w-full px-3 py-2 bg-white "
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded w-full px-3 bg-white py-2"
            >
              <option value="step1">Step 1</option>
              <option value="step2">Step 2</option>
              <option value="step3">Step 3</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessFormPage;