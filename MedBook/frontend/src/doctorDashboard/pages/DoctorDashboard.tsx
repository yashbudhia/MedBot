// components/doctor/DoctorDashboard.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../componenets/doctor/DashboardLayout"; // Ensure 'componenets' is correct
import { Stats } from "../../componenets/doctor/Stats";
import { PatientCard } from "../../componenets/doctor/PatientCard";
import { AppointmentList } from "../../componenets/doctor/AppointmentList";
import { AlertsPanel } from "../../componenets/doctor/AlertsPanel";
import axios from "axios";

interface Patient {
  id: string;
  name: string;
  condition: string;
  status: "critical" | "moderate" | "stable";
  lastVisit: string;
}

export function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const mockPatients: Patient[] = [
    {
      id: "P001",
      name: "John Doe",
      condition: "Hypertension",
      status: "critical",
      lastVisit: "2024-03-15",
    },
    {
      id: "P002",
      name: "Sarah Johnson",
      condition: "Diabetes Type 2",
      status: "stable",
      lastVisit: "2024-03-14",
    },
    {
      id: "P003",
      name: "Mike Peters",
      condition: "Post-surgery recovery",
      status: "moderate",
      lastVisit: "2024-03-13",
    },
  ];

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/doctor/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDoctorName(response.data.name);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        setError("Failed to fetch profile. Please try again.");
        setLoading(false);

        // Optionally, handle token expiration by redirecting to sign-in
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userType");
          navigate("/doctor/signin");
        }
      }
    };

    fetchDoctorProfile();
  }, [navigate]);

  const handlePatientSelect = (patientId: string) => {
    navigate(`/doctor/patient/${patientId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Welcome back, Doctor {doctorName}
        </h2>
        <h3 className="text-lg text-gray-600 dark:text-gray-300">
          Hope you have a wonderful day ahead
        </h3>

        <Stats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => handlePatientSelect(patient.id)}
                />
              ))}
            </div>
            <AppointmentList />
          </div>

          <div className="space-y-6">
            <AlertsPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
