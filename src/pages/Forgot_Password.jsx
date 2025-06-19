import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Forgot_Password.css";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import forgotpasswordSchema from "../validators/forgotpasswordValidator";

const Forgot_Password = () => {
  // const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotpasswordSchema),
  });

  const onSubmit = async (data) => {
    // e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.VITE_API_URL}/api/forgot-password`,
        {
          email: data.email,
        }
      );
      setMessage(`${res.data.previewURL}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <>
      {/* <Main_Navbar /> */}

      <div style={{ border: "1px solid #e4e6eb", marginBottom: "10px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="forgot-form">
              <h2>Forgot Password</h2>
              <hr />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-box">
                      <label>Email Address</label>
                      <div className="input-text-block">
                        <input
                          type="text"
                          name="email"
                          placeholder="Please Enter Your Email"
                          // {...register("email", {
                          //   required: "Email is Required",
                          // })}
                          {...register("email")}
                          className={errors.email ? "input-error" : ""}
                        />
                      </div>
                      {errors.email && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                  <div className="d-flex justify-content-between align-items-center mb-3 mb-md-0">
                    <button className="input-btn">
                      <span>Send Email</span>
                    </button>
                  </div>
                  <Link
                    to={"/login"}
                    className="redirect-link"
                    style={{ fontSize: "14px", fontWeight: "400" }}
                  >
                    Back To Login
                  </Link>
                </div>
              </form>
              {message && (
                <p
                  style={{ color: "red", fontSize: "14px", marginTop: "15px" }}
                >
                  Email sent! Preview :{" "}
                  <a
                    href={message}
                    rel="noopener noreferrer"
                    style={{ color: "red" }}
                  >
                    {message}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginTop: "210px" }}></div>

      <Footer />
    </>
  );
};

export default Forgot_Password;
