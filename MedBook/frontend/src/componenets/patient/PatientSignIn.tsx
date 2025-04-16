import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, Lock } from "lucide-react";
import axios from "axios";

const PatientSignIn = () => {
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // React Router's hook for navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Debug

    try {
      const response = await axios.post(
        "http://localhost:5000/api/patient/signin",
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", "patient");

      alert("Login successful!");
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userName', response.data.name);



      // 1) Navigate to homepage
      navigate("/");

      // 2) Then force one-time reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error("Axios Error:", err);
      setError("An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <UserRound className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          required
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="User ID"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="password"
          required
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sign In
      </button>
    </form>
  );
};

export default PatientSignIn;
