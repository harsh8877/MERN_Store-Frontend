import React, { useEffect } from "react";
import "./Address.css";
import Main_Navbar from "../pages/Main_Navbar";
import Panelsidebar from "./Panelsidebar";
import { useState } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import addressicon from "../images/address.png";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

const Address = () => {
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [addressList, setAddressList] = useState([]);

  // const [formData, setFormData] = useState({
  //   address: "",
  //   city: "",
  //   state: "",
  //   country: "",
  //   zipcode: "",
  //   isDefault: false,
  // });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      isDefault: false,
    },
  });

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      reset();
      setEditMode(false);
      setSelectedId(null);
    }
  };

  // const resetForm = () => {
  //   setFormData({
  //     address: "",
  //     city: "",
  //     state: "",
  //     country: "",
  //     zipcode: "",
  //     isDefault: false,
  //   });
  //   setEditMode(false);
  //   setSelectedId(null);
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to perform this action.");
        return;
      }
      if (editMode) {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/address/${selectedId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          toast.success("Address updated successfully");
        } else {
          toast.error("Failed to update address.");
        }
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/address`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          toast.success("Address added successfully");
        } else {
          toast.error("Failed to add address.");
        }
      }

      reset();
      setShowForm(false);
      fetchAddress();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong.");
    }
  };

  const handleEdit = (item) => {
    setSelectedId(item._id);
    setEditMode(true);
    setShowForm(true);
    for (const key in item) {
      if (key in item) {
        setValue(key, item[key]);
      }
    }
  };

  const fetchAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to view addresses.");
        return;
      }

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/getaddress`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddressList(res.data);
    } catch (err) {
      console.error("Error Fetching Address : ", err);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;

    // const confirmDelete = window.confirm(
    //   "Are you sure you want to delete this address?"
    // );
    // if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/address/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Address deleted successfully");
        reset();
        setShowForm(false);
        fetchAddress();
      } else {
        toast.error("Failed to delete address.");
      }
    } catch (error) {
      console.error("Delete Error : ", error);
      toast.error("Something went wrong while deleting.");
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
                    <div className="address-dashboard">
                      <div className="subpage-header">
                        <h3>
                          {showForm
                            ? editMode
                              ? "Edit Address"
                              : "Add Address"
                            : "Address"}
                        </h3>
                        <div className="action">
                          <button
                            className="input-btn custom-btn-none sm text-only icon-left"
                            onClick={toggleForm}
                          >
                            <span>{showForm ? "Cancel" : "Add"}</span>
                          </button>
                        </div>
                      </div>
                      {showForm && (
                        <div className="subpage-body">
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>Address</label>
                                  <div className="input-text-block">
                                    <input
                                      {...register("address", {
                                        required: true,
                                      })}
                                      placeholder="Street, House No / Apt No"
                                    />
                                  </div>
                                  {errors.address && (
                                    <p
                                      className="error-text"
                                      style={{ color: "red", fontSize: "14px" }}
                                    >
                                      Address is required.
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>City</label>
                                  <div className="input-text-block">
                                    <input
                                      {...register("city", { required: true })}
                                      placeholder="City"
                                    />
                                  </div>
                                  {errors.city && (
                                    <p
                                      className="error-text"
                                      style={{ color: "red", fontSize: "14px" }}
                                    >
                                      City is required.
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-lg-6">
                                <div className="input-box">
                                  <label>State</label>
                                  <div className="input-text-block">
                                    <input
                                      {...register("state", { required: true })}
                                      placeholder="State"
                                    />
                                  </div>
                                  {errors.state && (
                                    <p
                                      className="error-text"
                                      style={{ color: "red", fontSize: "14px" }}
                                    >
                                      State is required.
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-lg-6">
                                <div className="input-box">
                                  <label>Country</label>
                                  <div className="input-text-block">
                                    <input
                                      {...register("country", {
                                        required: true,
                                      })}
                                      placeholder="Country"
                                    />
                                  </div>
                                  {errors.country && (
                                    <p
                                      className="error-text"
                                      style={{ color: "red", fontSize: "14px" }}
                                    >
                                      Country is required.
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-lg-6">
                                <div className="input-box">
                                  <label>Zipcode</label>
                                  <div className="input-text-block">
                                    <input
                                      {...register("zipcode", {
                                        required: true,
                                      })}
                                      placeholder="Zipcode"
                                    />
                                  </div>
                                  {errors.zipcode && (
                                    <p
                                      className="error-text"
                                      style={{ color: "red", fontSize: "14px" }}
                                    >
                                      Zipcode is required.
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-md-12">
                                <div className="checkbox default-icon">
                                  <input
                                    type="checkbox"
                                    {...register("isDefault")}
                                    className="input-checkbox"
                                  />
                                  <label className="ms-2">As the Default</label>
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
                                <span>
                                  {editMode ? "Update Address" : "Add Address"}
                                </span>
                              </button>
                              {editMode && (
                                <button
                                  type="button"
                                  className="input-btn custom-btn-danger bg-danger md text-only icon-left ms-2"
                                  onClick={() => handleDelete(selectedId)}
                                >
                                  <span className="text-white">Delete</span>
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
                      )}
                      {!showForm && (
                        <div className="address-body">
                          {addressList.map((item) => (
                            <div
                              key={item._id}
                              className="address-block"
                              onClick={() => handleEdit(item)}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="address-icon">
                                <img src={addressicon} alt="" />
                              </div>
                              <div className="address-content">
                                <div className="address-title">
                                  <h3>
                                    {item.isDefault
                                      ? "Default Delivery Address"
                                      : "Delivery Address"}
                                  </h3>
                                  {item.isDefault && (
                                    <div className="address-check-icon">
                                      <i className="fa-solid fa-check"></i>
                                    </div>
                                  )}
                                </div>
                                <ul className="address-list">
                                  <li>
                                    <strong>{item.address}</strong>
                                    <span>
                                      {item.city}, {item.state}, {item.country}{" "}
                                      - {item.zipcode}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          ))}
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

      <div style={{ border: "1px solid #e4e6eb", marginTop: "20px" }}></div>

      <Footer />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Address;
