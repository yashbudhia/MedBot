// src/components/NavigationBar.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"doctor" | "patient" | null>(null);

  useEffect(() => {
    // Function to check and set userType from localStorage
    const checkUserType = () => {
      const storedUserType = localStorage.getItem("userType");
      if (storedUserType === "doctor") {
        setUserType("doctor");
      } else if (storedUserType === "patient") {
        setUserType("patient");
      } else {
        setUserType(null);
      }
    };

    // Initial check on component mount
    checkUserType();

    // Listen for storage changes (e.g., sign-in/sign-out in other tabs)
    const handleStorageChange = () => {
      checkUserType();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSignOut = () => {
    // Remove token and userType from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setUserType(null);

    // Navigate to homepage
    navigate("/");

    // Force one-time page reload to update NavigationBar
    setTimeout(() => {
      window.location.reload();
    }, 100); // Adjust delay if necessary
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <span
              className="ml-2 text-xl font-semibold text-gray-900 cursor-pointer"
              onClick={() => navigate("/")}
            >
              MedBook
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Show Dashboard link only if user is a patient */}
            {userType === "patient" && (
              <Link
                to="/patientDashboard"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Dashboard
              </Link>
            )}

            {/* Show Dashboard link only if user is a doctor (Optional) */}
            {/* Uncomment the below block if you have a separate Doctor Dashboard */}
            {userType === "doctor" && (
              <Link
                to="/doctor/dashboard"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Dashboard
              </Link>
            )}

            {/* Show Sign Out button if user is logged in */}
            {userType && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign Out as {userType === "doctor" ? "Doctor" : "Patient"}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
