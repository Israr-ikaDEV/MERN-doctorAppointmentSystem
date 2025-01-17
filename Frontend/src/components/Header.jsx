import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="   bg-primary  rounded  items-center flex  flex-wrap flex-col md:flex-row px-8 md:px-10 lg:px-15">
      <div className="flex md:w-1/2 gap-6 flex-col items-start justify-center py-10 m-auto  md:py-[10vw] md:mb-[-30px]">
        <p className=" text-white text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-tight ">
          Book Appointment <br /> With Trusted Doctors
        </p>

        <div className="flex  flex-col md:flex-row gap-3 font-light  text-white text-sm items-center">
          <img className=" w-28" src={assets.group_profiles} alt="" />
          <p>
            Simply browse through our extensive list of trusted doctors,
            <br className=" hidden sm:block" /> schedule your appointment
            hassle-fre
          </p>
        </div>

        <div
          className=" flex   items-center justify-center
rounded-full bg-white  py-3 px-8 gap-2 text-gray-600 text-sm  md:m-0 hover:scale-105  cursor-pointer transition-all duration-200"
        >
          <a href="#speciality"> Book appointment</a>
          <img className="w-3" src={assets.arrow_icon} />
        </div>
      </div>

      <div className=" md:w-1/2 relative">
        <img
          className=" w-full md:absoloute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
        />
      </div>
    </div>
  );
};

export default Header;
