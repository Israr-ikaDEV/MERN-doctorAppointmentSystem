import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";

const Doctors = () => {
  const { doctors } = useContext(AppContext);

  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFiter] = useState(false);
  const filterDocters = () => {
    speciality
      ? setFilterDoc(doctors.filter((doc) => doc.speciality === speciality))
      : setFilterDoc(doctors);
  };
  const navigate = useNavigate();

  useEffect(() => {
    filterDocters();
  }, [doctors, speciality]);
  return (
    <div className="p-2">
      <p className="text-gray-600"> Browse through the doctors specialist.</p>
      <div className="flex flex-col items-start sm:flex-row gap-5 mt-5">
        <button
          onClick={() => setShowFiter((prev) => !prev)}
          className={` border border-primary py-1 px-2 mb-3 text-sm  sm:hidden transition-all rounded ${
            showFilter ? "bg-primary text-white" : ""
          }`}
        >
          Filters
        </button>
        <div
          className={` flex-col text-sm text-gray-600 gap-4 ${
            showFilter ? "flex" : "hidden  sm:flex"
          }`}
        >
          <p
            onClick={() =>
              speciality === "General physician"
                ? navigate("/doctors")
                : navigate("/doctors/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded  cursor-pointer  ${
              speciality === "General physician"
                ? "bg-indigo-100 text-black"
                : ""
            } `}
          >
            General physician
          </p>
          <p
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded  cursor-pointer  ${
              speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""
            } `}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/Dermatologist")
            }
            className={`w-[94vw ] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded  cursor-pointer  ${
              speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""
            }  `}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality === "Pediatricians"
                ? navigate("/doctors")
                : navigate("/doctors/Pediatricians")
            }
            className={`w-[94vw ] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded  cursor-pointer  ${
              speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""
            } `}
          >
            Pediatricians
          </p>
          <p
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/Neurologist")
            }
            className={`w-[94vw ] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded  cursor-pointer  ${
              speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""
            } `}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gastroenterologist")
            }
            className={`w-[94vw ] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded  cursor-pointer ${
              speciality === "Gastroenterologist"
                ? "bg-indigo-100 text-black"
                : ""
            } `}
          >
            Gastroenterologist
          </p>
        </div>
        <div className="grid w-full grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className=" border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-20px] transition-all duration-500 mb-4"
            >
              <img className="bg-blue-100" src={item.image} alt="" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  {" "}
                  <p
                    className={`w-2 h-2 ${
                      item.available ? "bg-green-500 " : "bg-red-500"
                    } rounded-full`}
                  ></p>
                  <p
                    className={`${
                      item.available ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.available ? "Available" : "Not Available"}
                  </p>
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
        </div>{" "}
      </div>
    </div>
  );
};

export default Doctors;
{
}
