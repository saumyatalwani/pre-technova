import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/signup", formData);
      setSuccessMessage("User Data Entered Successfully!");
      setFormData({ name: "", email: ""});
      setErrors({});
    } catch (error) {
      setErrors({ api: error.response?.data?.message || "Something went wrong!" });
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray">
      <div className="w-80 max-w-lg bg-white shadow-md rounded-lg p-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">User Details</h2>
        {errors.api && <p className="text-red-500 text-sm mb-4">{errors.api}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age of Driver
            </label>
            <select
              name="age"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="0">18-30</option>
              <option value="1">31-50</option>
              <option value="2">Above 51</option>
              <option value="3">Under 18</option>
              <option value="4">Unknown</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
              Sex of Driver
            </label>
            <select
              name="sex"
              id="sex"
              value={formData.sex}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="0">Male</option>
              <option value="1">Female</option>
              <option value="2">Unknown</option>
            </select>

          </div>
          <div className="mb-4">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Driving Experience
            </label>
            <select
              name="experience"
              id="experience"
              value={formData.experience}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="0">1-2 years</option>
              <option value="1">2-5 years</option>
              <option value="2">5-10 years</option>
              <option value="3">Above 10 years</option>
              <option value="4">Below 1 year</option>
              <option value="5">No Licence</option>
              <option value="6">Unknown</option>
            </select>
          </div>
           <div className="mb-4">
            <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
              Type of Vehicle
            </label>
            <select
              name="vehicle"
              id="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="0">Automobile</option>
              <option value="1">Bajaj</option>
              <option value="2">Bicycle</option>
              <option value="3">Long lorry</option>
              <option value="4">Lorry (11-40Q)</option>
              <option value="5">Lorry (41-100Q)</option>
              <option value="6">Motorcycle</option>
              <option value="7">Other</option>
              <option value="8">Pick up upto 10Q</option>
              <option value="9">Public (12 seats)</option>
              <option value="10">Public (13-45 seats)</option>
              <option value="11">Public (&gt; 45 seats)</option>
              <option value="12">Ridden horse</option>
              <option value="13">Special vehicle</option>
              <option value="14">Stationwagen</option>
              <option value="15">Taxi</option>
              <option value="16">Turbo</option>
            </select>
           </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;