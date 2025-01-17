import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
const Speciality = () => {
  return (
    <div
      className=" flex flex-col items-center  gap-4 py-14 text-gray-800"
      id="speciality"
    >
      <h1 className=" text-3xl font-medium ">Find by Speciality </h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>

      <div className="flex sm:justify-center  pt-5 overflow-scroll w-full gap-4 text-sm">
        {specialityData.map((item, index) => (
          <Link
            to={`/doctors/${item.speciality}`}
            key={index}
            onClick={() => scrollTo(0, 0)}
            className=" flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] duration-500 transition-all"
          >
            <img className="w-16 sm:w-24 mb-2" src={item.image} alt="" />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Speciality;
