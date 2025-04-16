import React, { useState, useEffect } from "react";
import { ClipboardList, Shield, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import NavigationBar from "../componenets/Navbar";
import RealtimeHealthNews from "./RealTime";

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"doctor" | "patient" | null>(null);

  // Function to check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const userTypeFromStorage = localStorage.getItem("userType");
    if (token && userTypeFromStorage) {
      setIsLoggedIn(true);
      setUserType(userTypeFromStorage as "doctor" | "patient");
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  };

  // UseEffect to check login status on mount and after updates
  useEffect(() => {
    checkLoginStatus(); // Initial check

    // Listen for storage changes
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <NavigationBar />
      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Manage Your</span>
                <span className="block text-blue-600">Medical Records</span>
                <span className="block">Effortlessly</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Securely store, access, and manage your medical history in one
                place. Designed for both patients and healthcare providers.
              </p>

              {!isLoggedIn && (
                <div className="mt-8 sm:max-w-lg sm:mx-auto lg:mx-0">
                  <div className="space-y-4">
                    <Link to="/patientlogin">
                      <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                        Patient Login
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                      <br></br>
                    </Link>
                    <Link to="/doctorlogin">
                      <button className="w-full flex items-center justify-center px-8 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10">
                        Doctor Login
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {isLoggedIn && (
                <div className="mt-8 sm:max-w-lg sm:mx-auto lg:mx-0">
                  <div className="text-lg text-blue-600 font-medium">
                    Welcome back, {userType === "doctor" ? "Doctor" : "Patient"}
                    !
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <img
                  className="w-full rounded-lg"
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
                  alt="Medical professionals using digital records"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Why Choose MedRecord?
              </h2>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    Secure Storage
                  </h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Your medical data is encrypted and stored securely following
                    HIPAA guidelines.
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    Easy Access
                  </h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Access your complete medical history anytime, anywhere.
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    Doctor-Patient Connection
                  </h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Seamless communication between healthcare providers and
                    patients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RealtimeHealthNews />
      </main>
    </div>
  );
};

export default HomePage;
