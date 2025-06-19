import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import { useForm } from "react-hook-form";
import resetpasswordSchema from "../validators/resetpasswordValidator";

const Reset_Password = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(resetpasswordSchema),
  });

  const handleResetPassword = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reset-password/${token}`,
        {
          password: data.password,
        }
      );

      toast.success("Password reset successfully. Redirecting to login...");
      // setTimeout(() => {
      navigate("/login");
      // }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error occurred";
      toast.error(errorMessage);
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
              <h2>Reset Password</h2>
              <hr />
              <form onSubmit={handleSubmit(handleResetPassword)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-box">
                      <label>Password</label>
                      <div className="input-text-block">
                        <input
                          type="password"
                          name="password"
                          placeholder="Please Enter Your Password"
                          // {...register("password", {
                          //   required: "Password is Required",
                          // })}
                          {...register("password")}
                          className={errors.password ? "input-error" : ""}
                        />
                      </div>
                      {errors.password && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="input-box">
                      <label>Confirm Password</label>
                      <div className="input-text-block">
                        <input
                          type="password"
                          name="confirmpassword"
                          placeholder="Please Enter Your Confirm Password"
                          // {...register("confirmPassword", {
                          //   required: "Confirm Password is Required",
                          // })}
                          {...register("confirmPassword")}
                          className={
                            errors.confirmPassword ? "input-error" : ""
                          }
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                  <div className="d-flex justify-content-between align-items-center mb-3 mb-md-0">
                    <button className="input-btn" type="submit">
                      <span>Submit</span>
                    </button>
                  </div>
                  {/* {message && <p style={{ marginTop: "10px" }}>{message}</p>} */}
                  <Link
                    to={"/login"}
                    className="redirect-link"
                    style={{ fontSize: "14px", fontWeight: "400" }}
                  >
                    Back To Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginTop: "160px" }}></div>

      <Footer />
    </>
  );
};

export default Reset_Password;
