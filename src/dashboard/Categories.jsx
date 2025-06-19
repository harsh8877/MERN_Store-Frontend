import React, { useEffect, useRef, useState } from "react";
import "./Categories.css";
import Main_Navbar from "../pages/Main_Navbar";
import Panelsidebar from "./Panelsidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { useSearch } from "../hooks/SearchContext";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [showForm, setShowForm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedProduct, setSelectedProduct] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    selectedProduct: "",
    isActive: false,
  });
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  const { categoryFilter, setCategoryFilter } = useSearch();

  const productOptions = [
    "TSS Originals: Spirit Mosaic",
    "TSS Originals: Serene Meadows",
    "TSS Originals: Mystic Forest",
    "TSS Originals: Wild Safari",
    "TSS Originals: Radiant Blossoms",
    "TSS Originals: Aurora Borealis",
    "TSS Originals: Golden Sands",
    "TSS Originals: Moonlit Reflections",
    "TSS Originals: Spirit Mosaic",
    "Sample Product 1",
    "TSS Originals: Spirit unique",
    "TSS Originals: Spirit unique",
    "Sample Product 1",
    "Example Product 2",
    "Premium Selection",
    "New Item",
    "Special Edition",
    "Product X",
    "Exclusive Product",
    "Limited Edition",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleProductSelect = (product) => {
    // setSelectedProduct(product);
    setSearchTerm(product);
    setIsDropdownOpen(false);
    setCategoryData((prevData) => ({
      ...prevData,
      selectedProduct: product,
    }));
  };

  const filteredOptions = productOptions.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryData({
      ...categoryData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditClick = (category) => {
    setCategoryData({
      name: category.name,
      description: category.description,
      selectedProduct: category.selectedProduct,
      isActive: category.isActive,
    });
    setSearchTerm(category.selectedProduct || ""); // for dropdown
    setEditingId(category._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const token = localStorage.getItem("token");

      // if (!token) {
      //   toast.error("You must be logged in to view addresses.");
      //   return;
      // }
      let response;

      if (isEditing) {
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/category/${editingId}`,
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/category`,
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      if (response.data.success) {
        toast.success(isEditing ? "Category updated!" : "Category added!");
        fetchCategories();
        resetForm();
      } else {
        toast.error("Failed to save category.");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Something went wrong.");
    }
  };

  const resetForm = () => {
    setCategoryData({
      name: "",
      description: "",
      selectedProduct: "",
      isActive: false,
    });
    setSearchTerm("");
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/getcategory`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (editingId) => {
    if (!editingId) return;

    // const confirmDelete = window.confirm(
    //   "Are you sure you want to delete this category?"
    // );
    // if (!confirmDelete) return;

    try {
      const res = await axios.delete(`
          ${process.env.REACT_APP_API_URL}/api/category/${editingId}`);
      if (res.data.success) {
        toast.success("Category deleted successfully");
        resetForm();
        setShowForm(false);
        fetchCategories();
      } else {
        toast.error("Failed to delete category.");
      }
    } catch (error) {
      console.error("Delete Error : ", error);
      toast.error("Something went wrong while deleting.");
    }
  };

  const handleCategoryFilter = (brand) => {
    setCategoryFilter(brand);
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
                        <h3>{showForm ? "Add Category" : "Categories"}</h3>
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
                          {isEditing && categoryData && (
                            <div className="mb-3">
                              <p>
                                Editing category :
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    handleCategoryFilter(categoryData.name)
                                  }
                                >
                                  {` ${categoryData.name}`}{" "}
                                </span>
                              </p>
                            </div>
                          )}
                          <form onSubmit={handleSubmit}>
                            <div className="row">
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>Name</label>
                                  <div className="input-text-block">
                                    <input
                                      type="text"
                                      name="name"
                                      placeholder="Category Name"
                                      value={categoryData.name}
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>Description</label>
                                  <div className="input-text-block">
                                    <textarea
                                      name="description"
                                      placeholder="Category Description"
                                      rows="4"
                                      value={categoryData.description}
                                      onChange={handleInputChange}
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-md-12">
                                <div className="input-box" ref={dropdownRef}>
                                  <label>Select Products</label>
                                  <div
                                    className="input-text-block"
                                    onClick={() =>
                                      setIsDropdownOpen((prev) => !prev)
                                    }
                                    style={{
                                      //   border: "1px solid #ccc",
                                      //   borderRadius: "4px",
                                      //   padding: "8px",
                                      position: "relative",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      placeholder="Select Product..."
                                      value={searchTerm}
                                      onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setIsDropdownOpen(true);
                                      }}
                                      //   style={{
                                      //     width: "100%",
                                      //     border: "none",
                                      //     outline: "none",
                                      //   }}
                                    />
                                    <span
                                      style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "10px",
                                      }}
                                    >
                                      {isDropdownOpen ? "▲" : "▼"}
                                    </span>
                                  </div>
                                  {isDropdownOpen && (
                                    <ul
                                      style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: 0,
                                        border: "1px solid #ccc",
                                        borderTop: "none",
                                        maxHeight: "150px",
                                        overflowY: "auto",
                                        background: "#fff",
                                      }}
                                    >
                                      {filteredOptions.length > 0 ? (
                                        filteredOptions.map((option, index) => (
                                          <li
                                            key={index}
                                            onClick={() =>
                                              handleProductSelect(option)
                                            }
                                            style={{
                                              padding: "8px",
                                              cursor: "pointer",
                                              borderBottom: "1px solid #eee",
                                              fontSize: "14px",
                                              color: "#323232",
                                            }}
                                          >
                                            {option}
                                          </li>
                                        ))
                                      ) : (
                                        <li
                                          style={{
                                            padding: "8px",
                                            color: "#999",
                                          }}
                                        >
                                          No products found
                                        </li>
                                      )}
                                    </ul>
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
                                      role="switch"
                                      id="switchCheckChecked"
                                      name="isActive"
                                      checked={categoryData.isActive}
                                      onChange={handleInputChange}
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
                                  {isEditing
                                    ? "Update Category"
                                    : "Add Category"}
                                </span>
                              </button>
                              {isEditing && (
                                <button
                                  type="button"
                                  className="input-btn custom-btn-danger bg-danger md text-only icon-left ms-3"
                                  onClick={() => handleDelete(editingId)}
                                >
                                  <span className="text-white">Delete</span>
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
                      )}
                      {!showForm && (
                        <div className="category-body">
                          {categories.length > 0 ? (
                            <ul className="category-list">
                              {categories.map((category) => (
                                <li
                                  key={category._id}
                                  onClick={() => handleEditClick(category)}
                                >
                                  <h4>{category.name}</h4>
                                  <p>{category.description}</p>
                                  {/* <small>
                                    {category.isActive ? "Active" : "Inactive"}
                                  </small> */}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No categories found.</p>
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

export default Categories;
