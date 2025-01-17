import express from "express";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/authUser.js";
import {
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
} from "../controllers/userController.js";
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointments);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/pay-appointment", authUser, payAppointment);
userRouter.post("/delete-cancelled-appointment", deleteCancelledAppointment);
userRouter.post("/delete-completed-appointment", deleteCompletedAppointment);

export default userRouter;
