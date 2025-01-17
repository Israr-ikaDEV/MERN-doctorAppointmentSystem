import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center  text-2xl pt-10 text-gray-500  ">
        <p>
          ABOUT <span className="text-gray-700 font-medium ">US</span>
        </p>
      </div>

      <div className=" py-10 flex flex-col items-center md:flex-row gap-12">
        <img
          className=" w-full max-w-[360px]"
          src={assets.about_image}
          alt=""
        />

        <div className="text-xs justify-center flex flex-col gap-6 md:w-2/4 text-gray-700 sm:px-5">
          <p className="text-xs   font-light text-gray-600 leading-6">
            Welcome to Prescripto, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Prescripto, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p className="text-xs text-gray-600 leading-6">
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>
          <b className="text-sm font-semibold text-gray-800">Our Vision</b>
          <p className="text-xs text-gray-600 leading-6  ">
            Our vision at Prescripto is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>
      <div className="text-xl my-4 ">
        <p className="text-gray-500 font-medium">
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row  mb-20 rounded">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col   text-[15px] hover:text-white  hover:bg-primary  transition-all duration-500  text-gray-700 cursor-pointer border-gray-300">
          <b>Efficiency:</b>
          <p>
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col   text-[15px] hover:text-white  hover:bg-primary  transition-all duration-500  text-gray-700 cursor-pointer border-gray-300">
          <b>Convenience:</b>
          <p>
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col   text-[15px] hover:text-white  hover:bg-primary  transition-all duration-500  text-gray-700 cursor-pointer border-gray-300">
          <b>Personalization:</b>
          <p>
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
