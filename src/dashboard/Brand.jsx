import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./Brand.css";
import Main_Navbar from "../pages/Main_Navbar";
import Panelsidebar from "./Panelsidebar";
import axios from "axios";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";

import { useSearch } from "../hooks/SearchContext";
import { useNavigate } from "react-router-dom";

const Brand = () => {
  const [showForm, setShowForm] = useState(false);
  const [brands, setBrands] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const navigate = useNavigate();

  // const [formData, setFormData] = useState({
  //   name: "",
  //   description: "",
  //   isActive: false,
  // });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      isActive: false,
    },
  });

  const { brandFilter, setBrandFilter } = useSearch();

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      // Reset form when closing
      reset();
      setEditMode(false);
      setSelectedBrandId(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editMode) {
        // Edit the existing brand
        const res = await axios.put(
          `${process.env.VITE_API_URL}/api/brand/${selectedBrandId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          toast.success("Brand updated successfully.");
          fetchBrands(); // Fetch updated brands
        } else {
          toast.error("Error updating brand: " + res.data.message);
        }
      } else {
        // Add new brand
        const res = await axios.post(
          `${process.env.VITE_API_URL}/api/brand`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          toast.success("Brand added successfully.");
          fetchBrands(); // Fetch updated brands
        } else {
          toast.error("Error adding brand: " + res.data.message);
        }
      }

      reset();
      setEditMode(false); // Reset edit mode after submission
      setShowForm(false); // Hide form after submission
    } catch (err) {
      console.error(err);
      toast.error("Error sending message. Please try again.");
    }
  };

  const handleEdit = (brand) => {
    setSelectedBrandId(brand._id);
    setValue("name", brand.name);
    setValue("description", brand.description);
    setValue("isActive", brand.isActive);
    setEditMode(true);
    setShowForm(true);
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${process.env.VITE_API_URL}/api/getbrand`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Fetched Brands:", res.data);
      setBrands(res.data);
    } catch (err) {
      console.error("Error Fetching Brands:", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const deleteBrand = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.VITE_API_URL}/api/brand/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Brand deleted successfully");
        setBrands((prevBrands) =>
          prevBrands.filter((brand) => brand._id !== id)
        );
        // After deletion, close the form and reset the state
        reset();
        setShowForm(false);
        setEditMode(false);
        setSelectedBrandId(null);
      } else {
        toast.error("Failed to delete brand.");
      }
    } catch (err) {
      console.error("Error deleting brand:", err);
      toast.error("Failed to delete brand.");
    }
  };

  const handleBrandFilter = (brand) => {
    setBrandFilter(brand);
    navigate(`/shop?brand=${brand}`);
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
                              ? "Edit Brand"
                              : "Add Brand"
                            : "Brands"}
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
                          {editMode && selectedBrandId && (
                            <div className="mb-3">
                              <p>
                                Editing :{" "}
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    handleBrandFilter(watch("name"))
                                  }
                                >
                                  {" "}
                                  {watch("name")}
                                </span>
                              </p>
                            </div>
                          )}
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>Name</label>
                                  <div className="input-text-block">
                                    <input
                                      type="text"
                                      placeholder="Brand Name"
                                      {...register("name", {
                                        required: true,
                                      })}
                                    />
                                  </div>
                                  {errors.name && (
                                    <small className="text-danger">
                                      Name is required
                                    </small>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>Description</label>
                                  <div className="input-text-block">
                                    <textarea
                                      placeholder="Brand Description"
                                      rows="4"
                                      {...register("description", {
                                        required: true,
                                      })}
                                    ></textarea>
                                  </div>
                                  {errors.description && (
                                    <small className="text-danger">
                                      Description is required
                                    </small>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <div className="form-check form-switch">
                                    <label
                                      className="form-check-label"
                                      htmlFor="switchCheckChecked"
                                    >
                                      Active ?
                                    </label>
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="switchCheckChecked"
                                      {...register("isActive")}
                                    />
                                  </div>
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
                                  {editMode ? "Update Brand" : "Add Brand"}
                                </span>
                              </button>
                              {editMode && (
                                <button
                                  type="button"
                                  className="input-btn custom-btn-secondary bg-danger md text-only icon-left ms-3"
                                  onClick={() => deleteBrand(selectedBrandId)}
                                >
                                  <span className="text-white">
                                    Delete Brand
                                  </span>
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
                      )}
                      {!showForm && (
                        <div className="brand-list">
                          <a className="d-block mb-3 brand-box">
                            {brands.length > 0 ? (
                              brands.map((brand) => (
                                <li
                                  className="brand-box-list"
                                  key={brand._id}
                                  onClick={() => handleEdit(brand)}
                                >
                                  <h4 className="brand-title">{brand.name}</h4>
                                  <p className="brand-decription">
                                    {brand.description}
                                  </p>
                                  <span>
                                    {brand.isActive ? "Active" : "Inactive"}
                                  </span>
                                </li>
                              ))
                            ) : (
                              <li>No brands found.</li>
                            )}
                          </a>
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

export default Brand;
