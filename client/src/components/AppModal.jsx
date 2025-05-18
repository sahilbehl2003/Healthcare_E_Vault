
import React, { useState, useEffect } from "react";
import axios from "axios";

const AppModal = ({ isOpen, onClose, onSubmit, username }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/doctors/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      patient: username,
      doctor: e.target.elements.doctor.value,
      appointment_date: e.target.elements.appointmentDate.value,
      reason: e.target.elements.reason.value,
      status: e.target.elements.status.value,
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/users/appointments/", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white p-8 rounded-lg max-w-md mx-auto">
        <h2 className="text-2xl mb-4">Make an Appointment</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="appointmentDate">
              Appointment Date:
            </label>
            <input
              id="appointmentDate"
              name="appointmentDate"
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="doctor">
              Doctor:
            </label>
            <select
              id="doctor"
              name="doctor"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
            >
              <option value="">Select a Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.user.username}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="reason">
              Reason:
            </label>
            <textarea
              id="reason"
              name="reason"
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="status">
              Status:
            </label>
            <select
              id="status"
              name="status"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded-md mr-2"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppModal;
