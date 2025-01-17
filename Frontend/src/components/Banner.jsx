import React from "react";
import { assets } from "../assets/assets";

const Banner = () => {
  return (
    <div className="  flex bg-primary rounded-lg px-6 sm:px-10 md:px=14 lg:px-12 my-20 md:mx-10 ">
      <div className="flex-1  py-8 md:py-16 sm:py-10 lg:py-24 lg:pl-5">
        <div className=" text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight mb-5">
          <p>Book Appointment </p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
        </div>

        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className=" bg-white py-3 px-8 rounded-full text-gray-900  hover:scale-105 transition-all duration-300 "
        >
          Create account
        </button>
      </div>

      <div className=" hidden md:block relative md:w-1/2 lg:w-[370px] ">
        <img
          className=" w-full absolute  bottom-0 right-0 max-w-md"
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
