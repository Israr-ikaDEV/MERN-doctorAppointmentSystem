import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className=" md:mx-10 ">
      <div className="flex flex-col sm:grid grid-cols-[3fr,1fr,1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="cursor-pointer mb-5  w-44" src={assets.logo} alt="" />
          <p className=" w-full  md:w-2/3  text-gray-800 leading-6 text-xs">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        <div>
          <p className="text-xl mb-5 font-medium">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-800">
            <li className="hover:text-red-400" onClick={() => navigate("/")}>
              {" "}
              Home
            </li>
            <li
              className="hover:text-red-400"
              onClick={() => navigate("/about")}
            >
              About us
            </li>
            <li
              className="hover:text-red-400"
              onClick={() => navigate("/contact")}
            >
              Contact us
            </li>
            <li className="hover:text-red-400">Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl  mb-5  font-medium">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr className=" bg-black h-0.5" />
        <p className="text-center py-5">
          {" "}
          Copyright © 2024 GreatStack - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
