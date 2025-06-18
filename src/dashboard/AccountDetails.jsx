import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Main_Navbar from "../pages/Main_Navbar";
import Footer from "../components/Footer";
import Panelsidebar from "./Panelsidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const AccountDetails = () => {
  const email = localStorage.getItem("email");
  const [data, setData] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const roleLabels = {
    admin: { label: "Admin", color: "#e74c3c" },
    member: { label: "Member", color: "#3498db" },
    merchant: { label: "Merchant", color: "#2ecc71" },
  };

  const fetchUserData = () => {
    if (email) {
      axios
        .get(`http://localhost:5000/api/getuser/${email}`)
        .then((res) => {
          const userData = res.data;

          reset({
            fname: userData.fname || "",
            lname: userData.lname || "",
            phone: userData.phone || "",
          });
          setData(userData);
        })
        .catch((err) => {
          console.log("Error fetching user:", err);
        });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onSubmit = (formData) => {
    axios
      .put(`http://localhost:5000/api/updateuser/${email}`, formData)
      .then(() => {
        toast.success("Account details updated successfully!");
        fetchUserData(); // Refresh Data
      })
      .catch((err) => {
        console.error("Error updating user: ", err);
        toast.error("Failed to update details.");
      });
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
                      <h3 style={{ fontSize: "17px" }}>Account Details</h3>
                    </div>

                    {data ? (
                      <div className="mt-3">
                        <p>
                          Email : {data.email}
                          {data.role && roleLabels[data.role] ? (
                            <span
                              style={{
                                marginLeft: "10px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                backgroundColor: roleLabels[data.role].color,
                                color: "#fff",
                                fontSize: "12px",
                                textTransform: "uppercase",
                              }}
                            >
                              {roleLabels[data.role].label}
                            </span>
                          ) : (
                            <span style={{ marginLeft: "10px", color: "#999" }}>
                              Role not set
                            </span>
                          )}
                        </p>
                      </div>
                    ) : (
                      <span style={{ marginLeft: "10px", color: "#999" }}>
                        Role not set
                      </span>
                    )}

                    <div className="subpage-body">
                      <div className="account-details">
                        <div className="info"></div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="row">
                            <div className="col-12 col-md-6">
                              <div className="input-box">
                                <label>First Name</label>
                                <div className="input-text-block">
                                  <input
                                    type="text"
                                    placeholder="Please Enter Your First Name"
                                    {...register("fname", {
                                      reguired: "First name is required",
                                    })}
                                  />
                                </div>
                                {errors.fname && (
                                  <p style={{ color: "red", fontSize: "14px" }}>
                                    {errors.fname.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-12 col-md-6">
                              <div className="input-box">
                                <label>Last Name</label>
                                <div className="input-text-block">
                                  <input
                                    type="text"
                                    placeholder="Please Enter Your Last Name"
                                    {...register("lname", {
                                      required: "Last name is required",
                                    })}
                                  />
                                </div>
                                {errors.lname && (
                                  <p style={{ color: "red", fontSize: "14px" }}>
                                    {errors.fname.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-12 col-md-12">
                              <div className="input-box">
                                <label>Phone Number</label>
                                <div className="input-text-block">
                                  <input
                                    type="text"
                                    placeholder="Please Enter Your Phone Number"
                                    {...register("phone")}
                                  />
                                </div>
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
                              <span>Save Changes</span>
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
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginTop: "20px" }}></div>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default AccountDetails;
