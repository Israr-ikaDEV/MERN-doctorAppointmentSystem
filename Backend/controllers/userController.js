import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a strong password",
      });
    }
    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !gender || !dob) {
      return res.json({ success: false, message: "Data missing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address,
      dob,
      gender,
    });
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imgURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imgURL });
    }
    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // Fetch doctor data
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    // Checking if the selected slotTime is available (if it's already booked)
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        // If not, book the slot
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    // Fetch user data
    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked; // Remove the booked slots from the doctor data to prevent circular references

    // Appointment data
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    // Create a new appointment and save it
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update the doctor's slots_booked data with the newly booked slot
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to list user appointments
const listAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId, userId } = req.body;

    if (!appointmentId) {
      return res.json({ success: false, message: "Appointment ID is missing" });
    }

    // Find the appointment data by ID
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Verify if the appointment belongs to the authenticated user
    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

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

//api for payment

const payAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Find the appointment by its ID
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Check if the appointment has already been paid
    if (appointment.payment) {
      return res.json({ success: false, message: "Payment already made" });
    }

    // Update the payment status to true
    appointment.payment = true;
    await appointment.save();

    res.json({ success: true, message: "Payment successful" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteCancelledAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body; // Get the appointment ID from the request body

    // Find the appointment by its ID
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Check if the appointment is cancelled
    if (!appointment.cancelled) {
      return res.json({
        success: false,
        message: "Appointment is not cancelled",
      });
    }

    // Delete the cancelled appointment
    await appointmentModel.findByIdAndDelete(appointmentId);

    return res.json({
      success: true,
      message: "Cancelled appointment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

const deleteCompletedAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body; // Get the appointment ID from the request body

    // Find the appointment by its ID
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Check if the appointment is compeleted
    if (!appointment.isCompleted) {
      return res.json({
        success: false,
        message: "Appointment is not compeleted",
      });
    }

    // Delete the cancelled appointment
    await appointmentModel.findByIdAndDelete(appointmentId);

    return res.json({
      success: true,
      message: "Completed appointment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  payAppointment,
  deleteCancelledAppointment,
  deleteCompletedAppointment,
};
