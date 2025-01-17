import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

//api for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "missing details" });
      console.log(req.body); // To debug what data is coming through
    }

    //validating email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter valid email" });
    }

    console.log({
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    });

    //password validating
    if (password.length < 8) {
      return res.json({ success: false, message: "enter strong passsword" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //image upload to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageURL = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageURL,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "doctor added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "inavlid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for getting all doctors list
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get all apointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    console.log("Fetched Appointments:", appointments);
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api appointment cancle
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Mark the appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // Release the doctor's booked slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    if (doctorData) {
      let slots_booked = doctorData.slots_booked;
      if (slots_booked && slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(
          (e) => e !== slotTime
        );
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
      }
    }

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
