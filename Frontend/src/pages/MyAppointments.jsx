import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData, userId } = useContext(AppContext); // Ensure userId is coming from context
  const [appointments, setAppointments] = useState([]);
  const months = [
    " ",
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { userId, appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const payAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-appointment`,
        { appointmentId }, // No need to send userId anymore
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeCancelledAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/delete-cancelled-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);

        // Remove the cancelled appointment from the state
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  //remove completed appointments
  const removeCompletedAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/delete-completed-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        // Remove the completed appointment from the state
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-500 border-b">
        My Appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] sm:flex gap-4 sm:gap-6 border-b py-2"
          >
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold ">
                {" "}
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 mt-1 font-medium">Address:</p>
              <p className="text-xs">{item.docData.address}</p>

              <p className="text-xs mt-1 ">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:{" "}
                </span>{" "}
                {slotDateFormat(item.slotDate)}| {item.slotTime}
              </p>
            </div>

            <div className="flex flex-col gap-2 justify-end">
              {/* Pay Here button */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => payAppointment(item._id)}
                  className="border border-gray-300 hover:bg-primary rounded hover:text-white py-2 sm:min-w-48 text-center text-sm cursor-pointer hover:scale-105 transition-all duration-500 "
                >
                  Pay Here
                </button>
              )}

              {/* Cancel Appointment button */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="border border-gray-300 hover:bg-red-500 hover:text-white rounded py-2 sm:min-w-48 text-center text-sm cursor-pointer hover:scale-105 transition-all duration-500"
                >
                  Cancel Appointment
                </button>
              )}

              {/* Appointment cancelled state */}
              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 border py-2 border-red-500 rounded text-red-500">
                  Appointment cancelled
                </button>
              )}

              {/* Payment successful state */}
              {item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 border py-2 border-green-500 rounded text-green-500">
                  Payment Successful
                </button>
              )}

              {/* Remove cancelled appointment button */}
              {item.cancelled && (
                <button
                  onClick={() => removeCancelledAppointment(item._id)}
                  className="sm:min-w-48 border py-2 border-gray-500 rounded text-gray-500 hover:bg-gray-200"
                >
                  Remove
                </button>
              )}

              {/* Completed state */}
              {item.isCompleted && (
                <button className="sm:min-w-48 border py-2 border-green-500 rounded text-green-500">
                  Completed
                </button>
              )}

              {/* Remove completed appointment button */}
              {item.isCompleted && (
                <button
                  onClick={() => removeCompletedAppointment(item._id)}
                  className="sm:min-w-48 border py-2 border-gray-500 rounded text-gray-500 hover:bg-gray-200"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
