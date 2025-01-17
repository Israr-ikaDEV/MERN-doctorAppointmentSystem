import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "signup") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex items-center min-h-[80vh] "
    >
      <div className="flex  text-sm shadow-lg flex-col items-start text-gray-600 shadow-black gap-3 m-auto border border-gray-300  rounded-xl min-w-[340px] sm:min-w-96 p-8">
        <p className="text-2xl text-gray-800  font-semibold">
          {state === "signup" ? "Create Account" : "Login"}
        </p>
        <p className="text-sm text-semibold">
          Please {state === "signup" ? "sign up" : "Login"} to book appointement
        </p>
        {state === "signup" && (
          <div className=" flex flex-col gap-2">
            <p className="text-sm text-semibold ">Full Name</p>
            <input
              className="border border-gray-300 rounded w-full p-1 min-w-[300px]"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
        <div className=" flex flex-col gap-2">
          <p className="text-sm text-semibold ">Email</p>
          <input
            className="border border-gray-300 rounded w-full p-1 min-w-[300px]"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="  flex flex-col gap-2">
          <p className="text-sm text-semibold">Password</p>
          <input
            className="border border-gray-300 rounded min-w-[300px] p-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary rounded w-full py-2 text-white"
        >
          {state === "signup" ? "Create Account" : "Login"}
        </button>
        {state === "signup" ? (
          <p>
            Already have an Account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            {" "}
            Create a new account?{" "}
            <span
              onClick={() => setState("signup")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>{" "}
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
