import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Seller.css";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";

import aggrement from "../images/agreement.jpg";
import axios from "axios";
import sellerSchema from "../validators/sellerValidator";

const Seller = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sellerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/seller`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Form submitted successfully");
      reset();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <>
      {/* <Main_Navbar /> */}

      <div style={{ border: "1px solid #e4e6eb", marginBottom: "20px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="sell">
              <h3 className="text-uppercase">Become a MERN Store Seller!</h3>
              <hr />
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="add-merchant">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row">
                        <div className="col-12">
                          <div className="input-box">
                            <label>Name</label>
                            <div className="input-text-block">
                              <input
                                type="text"
                                name="name"
                                placeholder="Your Full Name"
                                {...register("name")}
                                className={errors.name ? "input-error" : ""}
                              />
                            </div>
                            {errors.name && (
                              <p style={{ fontSize: "14px", color: "red" }}>
                                {errors.name.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-box">
                            <label>Email Address</label>
                            <div className="input-text-block">
                              <input
                                type="email"
                                name="email"
                                placeholder="Your Email Address"
                                {...register("email")}
                                className={errors.email ? "input-error" : ""}
                              />
                            </div>
                            {errors.email && (
                              <p style={{ fontSize: "14px", color: "red" }}>
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-box">
                            <label>Phone Number</label>
                            <div className="input-text-block">
                              <input
                                type="number"
                                name="phone"
                                placeholder="Your Phone Number"
                                {...register("phone")}
                                className={errors.phone ? "input-error" : ""}
                              />
                            </div>
                            {errors.phone && (
                              <p style={{ fontSize: "14px", color: "red" }}>
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-box">
                            <label>Brand</label>
                            <div className="input-text-block">
                              <input
                                type="text"
                                name="brand"
                                placeholder="Your Business Brand"
                                {...register("brand")}
                                className={errors.brand ? "input-error" : ""}
                              />
                            </div>
                            {errors.brand && (
                              <p style={{ fontSize: "14px", color: "red" }}>
                                {errors.brand.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-box">
                            <label>Business</label>
                            <div className="input-text-block">
                              <textarea
                                name="business"
                                rows="4"
                                placeholder="Please Describe Your Business"
                                {...register("business")}
                                className={errors.business ? "input-error" : ""}
                              ></textarea>
                            </div>
                            {errors.business && (
                              <p style={{ fontSize: "14px", color: "red" }}>
                                {errors.business.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            border: "1px solid #eceef3",
                            marginBottom: "20px",
                            marginTop: "20px",
                          }}
                        ></div>
                        <div className="contact-actions">
                          <button className="input-btn custom-btn-secondary md text-only icon-left">
                            <span>Submit</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="row">
                    <div className="order-2 order-md-1 text-md-center mb-3 col-12">
                      <div className="agreement-banner-text">
                        <h3>
                          Would you like to sell your products on MERN Store!
                        </h3>
                        <h5>Grow Your business with MERN Store</h5>
                        <b>Apply Today</b>
                      </div>
                    </div>
                    <div className="order-1 order-md-2 text-center mb-3 mb-md-0 col-12">
                      <img src={aggrement} alt="" />
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

export default Seller;
