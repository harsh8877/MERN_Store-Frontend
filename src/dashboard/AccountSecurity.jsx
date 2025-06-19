import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Main_Navbar from "../pages/Main_Navbar";
import Panelsidebar from "./Panelsidebar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";

const AccountSecurity = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reset-password`,
        { password: data.password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("res.data", res.data);

      reset();

      toast.success("Password reset successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      toast.error("Error occurred while resetting password.");
    }
  };

  return (
    <>
      <Main_Navbar />
      <div style={{ border: "1px solid #e4e6eb", marginBottom: "20px" }}></div>
      <main>
        <div className="container">
          <div className="wrapper">
            <div className="admin">
              <div className="row">
                <div className="col-12 col-md-5 col-xl-3">
                  <Panelsidebar />
                </div>
                <div className="col-12 col-md-7 col-xl-9">
                  <div className="panel-body">
                    <div className="subpage-header">
                      <h3 style={{ fontSize: "17px" }}>Account Security</h3>
                    </div>
                    <div
                      style={{
                        border: "1px solid #eceef3",
                        marginTop: "20px",
                        marginBottom: "20px",
                      }}
                    ></div>
                    <h4 style={{ fontSize: "16px" }}>Reset Password</h4>
                    <div className="subpage-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <div className="input-box">
                              <label>Password</label>
                              <div className="input-text-block">
                                <input
                                  type="password"
                                  placeholder="Please Enter Your New Password"
                                  {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                      value: 6,
                                      message:
                                        "Password must be a least 6 characters",
                                    },
                                  })}
                                />
                              </div>
                              {errors.password && (
                                <p style={{ color: "red", fontSize: "14px" }}>
                                  {errors.password.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-12 col-md-6">
                            <div className="input-box">
                              <label>Confirm Password</label>
                              <div className="input-text-block">
                                <input
                                  type="password"
                                  placeholder="Please Confirm Your Password"
                                  {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: (value) =>
                                      value === watch("password") ||
                                      "Passwords do not match",
                                  })}
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

                        <div
                          style={{
                            border: "1px solid #eceef3",
                            marginTop: "20px",
                            marginBottom: "20px",
                          }}
                        ></div>
                        <div className="profile-actions">
                          <button
                            type="submit"
                            className="input-btn custom-btn-secondary md text-only icon-left"
                          >
                            <span>Reset Password</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div style={{ border: "1px solid #e4e6eb", marginTop: "20px" }}></div>

      <Footer />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AccountSecurity;
