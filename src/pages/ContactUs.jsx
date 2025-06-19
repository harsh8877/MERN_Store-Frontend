import React from "react";
import "./ContactUs.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";

import Footer from "../components/Footer";
import axios from "axios";
import { useForm } from "react-hook-form";
import contactusSchema from "../validators/contactusValidator";

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactusSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.VITE_API_URL}/api/contactus`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Message sent successfully.");
        reset();
      } else {
        toast.error("Error sending message : " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending message. Please try again.");
    }
  };

  return (
    <>
      {/* <Main_Navbar /> */}

      <div style={{ border: "1px solid #e4e6eb", marginBottom: "20px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="login-form">
              <h3 className="text-uppercase">CONTACT INFORMATION</h3>
              <hr />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="input-box">
                      <label>Name</label>
                      <div className="input-text-block">
                        <input
                          type="text"
                          name="name"
                          placeholder="Please Enter Your Name"
                          {...register("name")}
                          className={errors.name ? "input-error" : ""}
                        />
                      </div>
                      {errors.name && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="input-box">
                      <label>Email</label>
                      <div className="input-text-block">
                        <input
                          type="text"
                          name="email"
                          placeholder="Please Enter Your Email"
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
                  <div className="col-12 col-md-12">
                    <div className="input-box">
                      <label>Message</label>
                      <div className="input-text-block">
                        <textarea
                          typeof="textarea"
                          name="message"
                          rows="4"
                          placeholder="Please Describe Your Message"
                          {...register("message")}
                          className={errors.message ? "input-error" : ""}
                        ></textarea>
                      </div>
                      {errors.message && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid #eceef3",
                    marginBottom: "10px",
                    marginTop: "30px",
                  }}
                ></div>

                <div className="contact-actions">
                  <button className="input-btn custom-btn-secondary md text-only icon-left">
                    <span>Submit</span>
                  </button>
                </div>
              </form>
              {/* {message && <p style={{ marginTop: "20px" }}>{message}</p>} */}
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginTop: "80px" }}></div>

      <Footer />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ContactUs;
