// components/patient/PatientDashboard.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Activity,
  Calendar,
  FileText,
  AlertCircle,
  Clock
} from 'lucide-react';

interface Appointment {
  _id: string;
  type: string;
  date: string;     // e.g. "2024-03-15T00:00:00.000Z"
  time: string;     // e.g. "10:00 AM"
  status?: string;  // e.g. "Scheduled"
  doctor?: {
    _id: string;
    name: string;
    email?: string;
    licenseNumber?: string;
  };
}

interface Medication {
  _id: string;
  name: string;
  dosage: string;
  schedule: string; // e.g. "8:00 AM"
  status?: string;
}

const PatientDashboard: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);

  // Retrieve token from localStorage
  const token = localStorage.getItem('token');

  // 1) On mount, get userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // 2) Fetch appointments
  const fetchAppointments = async () => {
    if (!token) return; // if not logged in, skip
    try {
      const response = await axios.get('http://localhost:5000/api/patient/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allAppointments: Appointment[] = response.data.appointments;

      // Sort appointments by creation time descending based on _id
      const sortedAppointments = allAppointments.sort((a, b) => {
        const aTimestamp = parseInt(a._id.substring(0, 8), 16);
        const bTimestamp = parseInt(b._id.substring(0, 8), 16);
        return bTimestamp - aTimestamp;
      });

      setAppointments(sortedAppointments);

      if (sortedAppointments.length > 0) {
        setNextAppointment(sortedAppointments[0]);
      } else {
        setNextAppointment(null);
      }
    } catch (err: any) {
      console.error('Fetch Appointments Error:', err);
    }
  };

  // 3) Fetch medications
  const fetchMedications = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/patient/medications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedications(response.data.medications);
    } catch (err: any) {
      console.error('Fetch Medications Error:', err);
    }
  };

  // 4) On mount, fetch both
  useEffect(() => {
    fetchAppointments();
    fetchMedications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prepare nextAppointment display
  const nextAptDate = nextAppointment
    ? new Date(nextAppointment.date).toLocaleDateString()
    : null;

  return (
    <div className="p-8 space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {userId}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your health overview
        </p>
      </header>

      {/* Vital Signs box */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Vital Signs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last updated 2h ago
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Blood Pressure</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">120/80</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Heart Rate</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">72 bpm</span>
            </div>
          </div>
        </div>

        {/* Next Appointment Box */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Next Appointment
              </h3>
              {nextAppointment ? (
                nextAppointment.doctor && typeof nextAppointment.doctor === 'object' ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Doctor: {nextAppointment.doctor.name}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    (Doctor info not populated)
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No upcoming appointment
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            {nextAppointment ? (
              <>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {nextAptDate}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {nextAppointment.type} at {nextAppointment.time}
                </p>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                You have no future appointments
              </p>
            )}
          </div>
        </div>

        {/* Recent Records Box */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Records
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                2 new updates
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Blood Test Results</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">2d ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">X-Ray Report</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">1w ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Another row with 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Upcoming Medications */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Upcoming Medications
            </h3>
            <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {medications.length > 0 ? (
              medications.map((med) => (
                <div key={med._id} className="flex items-center space-x-4">
                  <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {med.schedule}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {med.name} - {med.dosage}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No upcoming medications.
              </p>
            )}
          </div>
        </div>

        {/* Health Alerts placeholder */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Health Alerts
            </h3>
            <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-100 dark:border-yellow-700">
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                Upcoming vaccination due in 2 weeks
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-100 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Schedule your annual eye examination
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
