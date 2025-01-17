import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
const TopDoctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center  gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className=" sm:w-1/3 text-center text-sm ">
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className=" w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className=" border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-20px] transition-all duration-500 mb-4"
          >
            <img className="bg-blue-100" src={item.image} alt="" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-green-500 text-sm">
                {" "}
                <p
                  className={`w-2 h-2 ${
                    item.available ? "bg-green-500 " : "bg-red-500"
                  }rounded-full`}
                ></p>
                <p>{item.available ? "Available" : "Not Available"}</p>
              </div>
            </div>
            <p className="px-4 text-lg text-gray-900 font-medium">
              {item.name}
            </p>
            <p className="px-4 pb-2 text-gray-600 text-sm  t  mb-2">
              {item.speciality}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className=" bg-blue-50 cursor-pointer text-gray-600 px-12 py-3 rounded-full hover:text-black hover:bg-blue-100 mt-10"
      >
        more
      </button>
    </div>
  );
};

export default TopDoctors;
