import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, doctors } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { AppContext } from "../AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors } = useContext(AppContext);

  const navigate = useNavigate();
  const { backendUrl, getDoctorsData, token } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Fetch doctor info based on docId
  const fetchInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };

  // Get available slots for the doctor
  const getAvailableSlots = async () => {
    setDocSlots([]); // Reset available slots

    let today = new Date();

    // Loop for the next 7 days
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Set end time for the day (9 PM)
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // Set starting time for today and the future days
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeslots = [];

      // Generate time slots for the day
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;

        // Check if slots_booked exists and if slotDate has booked slots
        const isSlotAvailable =
          docInfo.slots_booked && Array.isArray(docInfo.slots_booked[slotDate])
            ? !docInfo.slots_booked[slotDate].includes(formattedTime) // If booked, do not show slot
            : true; // If slots_booked or slotDate is missing, assume slot is available

        if (isSlotAvailable) {
          timeslots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // Update slots after generating timeslots
      setDocSlots((prev) => [...prev, timeslots]);
    }
  };

  // Book the appointment with the selected slot
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book");
      return navigate("/login");
    }
    try {
      const date =
        docSlots[slotIndex] && docSlots[slotIndex][0]
          ? docSlots[slotIndex][0].dateTime
          : null;
      if (!date) {
        toast.error("Please select a time slot");
        return;
      }
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <div>
            <img
              className="bg-primary rounded-lg w-full sm:max-w-72"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-500 p-8 rounded-lg bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="text-2xl flex items-center gap-2">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>

            <div className="flex gap-2 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="border border-black px-2 py-0.5 text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div>
              <p className="flex gap-2 items-center text-gray-900 text-sm font-medium">
                ABOUT <img src={assets.info_icon} alt="" />
              </p>
            </div>

            <p className="max-w-[700px] text-sm mt-1 text-gray-600">
              {docInfo.about}
            </p>

            <p className="text-gray-500 font-medium mt-4">
              Appointment Fee:{" "}
              <span className="text-gray-900">
                {assets.currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        <div className=" sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className=" flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-300"
                  }`}
                >
                  <p>{item[0] ? daysOfWeek[item[0].dateTime.getDay()] : ""}</p>
                  <p>{item[0] ? item[0].dateTime.getDate() : ""}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 overflow-x-scroll w-full mt-4 mr-4">
            {docSlots.length > 0 &&
              docSlots[slotIndex] &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "border border-gray-400"
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full mt-6"
          >
            Book an appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
