import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- import
import { Calendar, Clock, Plus } from 'lucide-react';

// If storing token in localStorage
const token = localStorage.getItem('token');

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    doctorUserId: '',
    date: '',
    time: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate(); // for routing after creation

  // OPTIONAL: fetch appointments on this page if you want to display them here
  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patient/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data.appointments);
    } catch (err) {
      console.error('Fetch Appointments Error:', err);
    }
  };

  // CREATE APPOINTMENT
  const handleCreateAppointment = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/patient/appointments',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If success, add new appointment to local state
      setAppointments((prev) => [...prev, response.data.appointment]);
      setShowForm(false);
      setFormData({ type: '', doctorUserId: '', date: '', time: '' });
      setError('');

      // <-- Navigate to the dashboard route so the user sees it in PatientDashboard
      navigate('/patientDashboard');
      // Make sure you have <Route path="/patientDashboard" element={<PatientDashboard />} />
      // in your React Router config.

    } catch (err: any) {
      console.error('Create Appointment Error:', err);
      if (err.response) {
        if (err.response.status === 404 && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError(err.response.data.error || 'Failed to create appointment');
        }
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  // DELETE APPOINTMENT
  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/patient/appointments/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments((prev) => prev.filter((apt) => apt._id !== appointmentId));
    } catch (err: any) {
      console.error('Delete Appointment Error:', err);
      setError(err.response?.data?.error || 'Failed to delete appointment');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Appointments
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Schedule and manage your medical appointments
        </p>
      </header>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-8"
      >
        <Plus className="w-4 h-4" />
        <span>Schedule Appointment</span>
      </button>

      {showForm && (
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Appointment Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Doctor User ID"
            value={formData.doctorUserId}
            onChange={(e) => setFormData({ ...formData, doctorUserId: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />

          <button
            onClick={handleCreateAppointment}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create
          </button>
        </div>
      )}

      {/* Optional local display */}
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {appointment.type}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Doctor: {appointment.doctor?.userId ?? 'N/A'}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{appointment.time}</span>
                    <span className="ml-2">
                      {appointment.date && appointment.date.substring(0, 10)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleDeleteAppointment(appointment._id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsPage;
