import React from "react";
import { useForm } from "react-hook-form";
import Main_Navbar from "../pages/Main_Navbar";
import Panelsidebar from "./Panelsidebar";
import { useState } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import { useEffect } from "react";
import "./Merchants.css";
import { ToastContainer, toast } from "react-toastify";

const Merchants = () => {
  const [showForm, setShowForm] = useState(false);
  const [merchantList, setMerchantList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   phonenumber: "",
  //   brand: "",
  //   business: "",
  // });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const filteredMerchants = merchantList.filter((merchant) => {
    const term = searchTerm.toLowerCase();
    return (
      merchant.name?.toLowerCase().includes(term) ||
      merchant.email?.toLowerCase().includes(term) ||
      merchant.phonenumber?.toLowerCase().includes(term) ||
      merchant.brand?.toLowerCase().includes(term) ||
      merchant.business?.toLowerCase().includes(term)
    );
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to perform this action.");
        return;
      }

      // Submit new merchant
      await axios.post(`${process.env.REACT_APP_API_URL}/api/merchants`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //  Immediately fetch updated merchant list from server
      const updatedList = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/getmerchants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMerchantList(updatedList.data);

      toast.success("Merchant added successfully!");
      reset();

      setShowForm(false);
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Failed to submit merchant.");
    }
  };

  const toggleDisableMerchant = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/merchants/${id}/disable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedMerchant = response.data.merchant;

      setMerchantList((prevList) =>
        prevList.map((merchant) =>
          merchant._id === id ? updatedMerchant : merchant
        )
      );
    } catch (error) {
      console.error("Failed to disable/enable merchant", error);
      toast.error("Something went wrong while updating status.");
    }
  };

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/getmerchants`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMerchantList(response.data);
      } catch (error) {
        console.error("Failed to fetch merchants", error);
      }
    };

    fetchMerchants();
  }, []);

  const deleteMerchant = async (id) => {
    // if (window.confirm("Are you sure you want to delete this merchant?")) {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/merchants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Remove the deleted merchant from the state
      setMerchantList((prev) => prev.filter((m) => m._id !== id));
      toast.success("Merchant deleted successfully!");
    } catch (error) {
      console.error("Failed to delete merchant", error);
      toast.error("Failed to delete merchant.");
    }
    // }
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
                    <div className="address-dashboard">
                      <div className="subpage-header">
                        <h3>{showForm ? "Add Merchants" : "Merchants"}</h3>
                        <div className="action">
                          <button
                            className="input-btn custom-btn-none sm text-only icon-left"
                            onClick={toggleForm}
                          >
                            <span>{showForm ? "Cancel" : "Add"}</span>
                          </button>
                        </div>
                      </div>

                      {/* <div
                        style={{
                          border: "1px solid #eceef3",
                          marginTop: "20px",
                          marginBottom: "30px",
                        }}
                      ></div> */}

                      {showForm && (
                        <div className="subpage-body">
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>Name</label>
                                  <div className="input-text-block">
                                    <input
                                      type="text"
                                      placeholder="Your Full Name"
                                      {...register("name", {
                                        required: true,
                                      })}
                                    />
                                  </div>
                                  {errors.name && (
                                    <p
                                      style={{ color: "red", fontSize: "14px" }}
                                    >
                                      Name is required
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>Email Address</label>
                                  <div className="input-text-block">
                                    <input
                                      type="email"
                                      placeholder="Your Email Address"
                                      {...register("email", {
                                        required: true,
                                      })}
                                    />
                                  </div>
                                  {errors.email && (
                                    <p
                                      style={{ color: "red", fontSize: "14px" }}
                                    >
                                      Email is required
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
                                      name="phonenumber"
                                      placeholder="Your Phone Number"
                                      {...register("phonenumber", {
                                        required: true,
                                      })}
                                    />
                                  </div>
                                  {errors.phonenumber && (
                                    <p
                                      style={{ color: "red", fontSize: "14px" }}
                                    >
                                      Phone Number is required
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>Brand</label>
                                  <div className="input-text-block">
                                    <input
                                      type="text"
                                      name="brand"
                                      placeholder="Your Business Brand"
                                      {...register("brand", { required: true })}
                                    />
                                  </div>
                                  {errors.brand && (
                                    <p
                                      style={{ color: "red", fontSize: "14px" }}
                                    >
                                      Brand is required
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>Business</label>
                                  <div className="input-text-block">
                                    <textarea
                                      type="text"
                                      placeholder="Please Describe Your Business"
                                      {...register("business", {
                                        required: true,
                                      })}
                                      rows="4"
                                    ></textarea>
                                  </div>
                                  {errors.business && (
                                    <p
                                      style={{ color: "red", fontSize: "14px" }}
                                    >
                                      Business is required
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                border: "1px solid #eceef3",
                                marginTop: "20px",
                                marginBottom: "30px",
                              }}
                            ></div>
                            <div className="profile-actions">
                              <button className="input-btn custom-btn-secondary md text-only icon-left">
                                <span>Add Merchant</span>
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                      {!showForm && (
                        <div className="merchant-data">
                          <form>
                            <div className="search-box inline-btn-box">
                              <div className="input-text-block">
                                <input
                                  type="text"
                                  name="merchant"
                                  placeholder="Type email, phone number, brand or status"
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                />
                                <button className="input-btn custom-btn-primary md text-only icon-left ">
                                  <span>Search</span>
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}

                      {!showForm && (
                        <div
                          style={{
                            marginTop: "10px",
                            padding: "8px 12px",
                            backgroundColor: "#f3f6fa",
                            border: "1px solid #dce3eb",
                            borderRadius: "6px",
                            display: "inline-block",
                            fontSize: "14px",
                          }}
                        >
                          Total Merchant : {filteredMerchants.length}
                        </div>
                      )}

                      {!showForm && (
                        <div className="merchant-list">
                          {filteredMerchants.length === 0 ? (
                            <p>No merchants available.</p>
                          ) : (
                            <ul>
                              {filteredMerchants.map((merchant) => (
                                <li
                                  className="merchant-item"
                                  key={merchant._id}
                                  style={{
                                    opacity: merchant.disabled ? 0.6 : 1,
                                    backgroundColor: merchant.disabled
                                      ? "#f8f8f8"
                                      : "#fff",
                                  }}
                                >
                                  <h4>Business</h4>
                                  <p>{merchant.business}</p>
                                  <h4>Brand</h4>
                                  <p>{merchant.brand}</p>
                                  <h4>Name</h4>
                                  <p>{merchant.name}</p>
                                  <h4>Phone Number</h4>
                                  <p>{merchant.phonenumber}</p>
                                  <h4>Email</h4>
                                  <p>{merchant.email}</p>
                                  <h4>Request Date</h4>
                                  <p>
                                    {new Date(
                                      merchant.createdAt
                                    ).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(
                                      merchant.createdAt
                                    ).toLocaleTimeString()}
                                  </p>

                                  <div
                                    style={{
                                      border: "1px solid #eceef3",
                                      marginTop: "20px",
                                      marginBottom: "20px",
                                    }}
                                  ></div>

                                  <div className="merchant-status">
                                    <div className="merchant-icon">
                                      <i className="fa-solid fa-check"></i>
                                      <p>Approved</p>
                                    </div>
                                    <div
                                      className="merchant-icon-1"
                                      onClick={() =>
                                        deleteMerchant(merchant._id)
                                      }
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </div>
                                  </div>

                                  <div className="disable-merchant">
                                    <button
                                      onClick={() =>
                                        toggleDisableMerchant(merchant._id)
                                      }
                                    >
                                      <span>
                                        {merchant.disabled
                                          ? "Enable Merchant"
                                          : "Disable Merchant"}
                                      </span>
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb" }}></div>

      <Footer />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Merchants;
