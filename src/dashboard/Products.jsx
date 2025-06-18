import React from "react";
// import { useForm, Controller } from "react-hook-form";
import "./Products.css";
import Main_Navbar from "../pages/Main_Navbar";
import Panelsidebar from "./Panelsidebar";
import { useState } from "react";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productData, setProductData] = useState({
    sku: "",
    name: "",
    description: "",
    quantity: "",
    price: "",
    taxable: "",
    selectedProduct: "",
    selectedCategory: [],
    file: null,
    isActive: false,
  });
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const productOptions = [
    "The Souled Store",
    "Modish Mania",
    "Style Sanctuary",
    "Trendsetter's hub",
    "Elegant Attire",
    "Fashion Fusion",
    "Fashionista's Den",
    "Trendy Junction",
    "Vogue Vista",
    "Chic Haven",
    "Urban Threads",
  ];

  const categoryOptions = [
    "Oversized T-Shirts",
    "Topware",
    "Men's Clothing",
    "Casual Wear",
    "Women's Clothing",
    "Sportswear",
    "Undergarments",
    "Accessories",
    "Kids' Clothing",
    "Outerwear",
    "Formal Wear",
    "Footwear",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleProductSelect = (product) => {
    setProductData({ ...productData, selectedProduct: product });
    setSearchTerm(product);
    setIsDropdownOpen(false);
  };

  const filteredOptions = productOptions.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categoryOptions.filter((opt) =>
    opt.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "taxable" && value !== "yes" && value !== "no") {
      return; // Do nothing if invalid value is selected
    }

    setProductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setProductData({ ...productData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !productData.sku ||
      !productData.name ||
      !productData.description ||
      !productData.quantity ||
      !productData.price ||
      !productData.taxable ||
      !productData.selectedProduct ||
      !productData.selectedCategory ||
      !productData.file
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    for (let key in productData) {
      formData.append(key, productData[key]);
    }

    try {
      const method = isEditMode ? "put" : "post";
      const url = isEditMode
        ? `http://localhost:5000/api/product/${productData._id}`
        : "http://localhost:5000/api/product";

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add a product.");
        return;
      }

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success(
          `Product ${isEditMode ? "updated" : "added"} successfully!`
        );
        setShowForm(false);
        setIsEditMode(false);
        setProductData({
          sku: "",
          name: "",
          description: "",
          quantity: "",
          price: "",
          taxable: "",
          selectedProduct: "",
          selectedCategory: "",
          file: null,
          isActive: false,
        });
        fetchProducts();
      } else {
        toast.error(`Failed to ${isEditMode ? "update" : "add"} product`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("There was an error submitting the product.");
    }
  };

  const handleEditClick = (product) => {
    setProductData(product);
    setIsEditMode(true);
    setShowForm(true);
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to view products.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/getproduct", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("API Response:", response.data);
      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        toast.error("Failed to load products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("There was an error fetching products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = async (productId) => {
    // if (window.confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Product deleted successfully!");
        fetchProducts(); // Refresh product list
        setShowForm(false);
      } else {
        toast.error("Failed to delete the product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("There was an error deleting the product.");
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
                        <h3>{showForm ? "Add Product" : "Products"}</h3>
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
                          {isEditMode && productData && (
                            <div className="edit-brand-info mb-3">
                              <p>
                                Product Link :
                                <Link
                                  to={`/product/${productData._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "#323232",
                                  }}
                                >
                                  {" "}
                                  {productData.name}
                                </Link>
                              </p>
                            </div>
                          )}

                          <form onSubmit={handleSubmit}>
                            <div className="row">
                              <div className="col-12 col-lg-6">
                                <div className="input-box">
                                  <label>Sku</label>
                                  <div className="input-text-block">
                                    <input
                                      type="text"
                                      name="sku"
                                      placeholder="Product Sku"
                                      value={productData.sku}
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-lg-6">
                                <div className="input-box">
                                  <label>Name</label>
                                  <div className="input-text-block">
                                    <input
                                      type="text"
                                      name="name"
                                      placeholder="Product Name"
                                      value={productData.name}
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
                                      type="textarea"
                                      name="description"
                                      rows="4"
                                      placeholder="Product Description"
                                      value={productData.description}
                                      onChange={handleInputChange}
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-lg-6">
                                <div className="input-box">
                                  <label>Quantity</label>
                                  <div className="input-text-block">
                                    <input
                                      type="number"
                                      name="quantity"
                                      placeholder="Product Quantity"
                                      value={productData.quantity}
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-lg-6">
                                <div className="input-box">
                                  <label>Price</label>
                                  <div className="input-text-block">
                                    <input
                                      type="number"
                                      name="price"
                                      placeholder="Product Price"
                                      value={productData.price}
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>Texable</label>
                                  <div className="input-text-block">
                                    <select
                                      name="taxable"
                                      value={productData.taxable}
                                      onChange={handleInputChange}
                                      className="form-select"
                                      aria-label="Default select example"
                                      style={{
                                        color: "#323232",
                                        fontWeight: "400",
                                        fontSize: "14px",
                                      }}
                                    >
                                      <option value="">
                                        Select the Option
                                      </option>
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                                    </select>
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
                                      position: "relative",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      placeholder="No Options Selected"
                                      value={searchTerm}
                                      onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setIsDropdownOpen(true);
                                      }}
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
                                <div
                                  className="input-box"
                                  ref={categoryDropdownRef}
                                >
                                  <label>Select Categories</label>

                                  {/* Input for search */}
                                  <div
                                    className="input-text-block"
                                    onClick={() =>
                                      setIsCategoryDropdownOpen((prev) => !prev)
                                    }
                                    style={{
                                      position: "relative",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      placeholder="Search Categories"
                                      value={categorySearchTerm}
                                      onChange={(e) => {
                                        setCategorySearchTerm(e.target.value);
                                        setIsCategoryDropdownOpen(true);
                                      }}
                                    />
                                    <span
                                      style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "10px",
                                      }}
                                    >
                                      {isCategoryDropdownOpen ? "▲" : "▼"}
                                    </span>
                                  </div>

                                  {/* Selected categories display with remove option */}
                                  <div
                                    style={{
                                      marginTop: "10px",
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: "5px",
                                    }}
                                  >
                                    {(Array.isArray(
                                      productData.selectedCategory
                                    )
                                      ? productData.selectedCategory
                                      : productData.selectedCategory
                                      ? [productData.selectedCategory]
                                      : []
                                    ).map((cat, idx) => (
                                      <span
                                        key={idx}
                                        style={{
                                          padding: "5px 10px",
                                          backgroundColor: "#f0f0f0",
                                          borderRadius: "20px",
                                          fontSize: "13px",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "5px",
                                        }}
                                      >
                                        {cat}
                                        <span
                                          style={{
                                            cursor: "pointer",
                                            color: "red",
                                          }}
                                          onClick={() => {
                                            setProductData({
                                              ...productData,
                                              selectedCategory: (Array.isArray(
                                                productData.selectedCategory
                                              )
                                                ? productData.selectedCategory
                                                : productData.selectedCategory
                                                ? [productData.selectedCategory]
                                                : []
                                              ).filter((c) => c !== cat),
                                            });
                                          }}
                                        >
                                          ✕
                                        </span>
                                      </span>
                                    ))}
                                  </div>

                                  {/* Dropdown list */}
                                  {isCategoryDropdownOpen && (
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
                                      {filteredCategories.length > 0 ? (
                                        filteredCategories.map(
                                          (option, index) => (
                                            <li
                                              key={index}
                                              onClick={() => {
                                                const currentSelected =
                                                  Array.isArray(
                                                    productData.selectedCategory
                                                  )
                                                    ? productData.selectedCategory
                                                    : productData.selectedCategory
                                                    ? [
                                                        productData.selectedCategory,
                                                      ]
                                                    : [];
                                                if (
                                                  !currentSelected.includes(
                                                    option
                                                  )
                                                ) {
                                                  setProductData({
                                                    ...productData,
                                                    selectedCategory: [
                                                      ...currentSelected,
                                                      option,
                                                    ],
                                                  });
                                                }
                                                setCategorySearchTerm("");
                                              }}
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
                                          )
                                        )
                                      ) : (
                                        <li
                                          style={{
                                            padding: "8px",
                                            color: "#999",
                                          }}
                                        >
                                          No categories found
                                        </li>
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </div>

                              <div className="col-12 col-md-12">
                                <div className="input-box">
                                  <label>File</label>
                                  <div className="input-text-block">
                                    <input
                                      type="file"
                                      name="file"
                                      onChange={handleFileChange}
                                    />
                                  </div>
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
                                      checked={productData.isActive}
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
                                  {isEditMode
                                    ? "Update Product"
                                    : "Add Product"}
                                </span>
                              </button>
                              {isEditMode && (
                                <button
                                  type="button"
                                  className="input-btn custom-btn-danger bg-danger md text-only icon-left ms-3"
                                  onClick={() =>
                                    handleDeleteClick(productData._id)
                                  }
                                >
                                  Delete Product
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
                      )}
                      {!showForm && (
                        <div className="product-list">
                          <ul>
                            {products.length > 0 ? (
                              products.map((product) => (
                                <div className="product-box" key={product._id}>
                                  <li
                                    className="product-item"
                                    onClick={() => handleEditClick(product)}
                                  >
                                    <div className="product-image">
                                      <img
                                        src={`http://localhost:5000/api/uploads/${product.file}`}
                                        alt={product.name}
                                      />
                                    </div>
                                    <div className="product-name">
                                      <h4>{product.name}</h4>
                                      <p>{product.description}</p>
                                    </div>
                                  </li>
                                </div>
                              ))
                            ) : (
                              <li>No products found.</li>
                            )}
                          </ul>
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

export default Products;
