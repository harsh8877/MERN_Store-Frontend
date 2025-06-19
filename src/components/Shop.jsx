import React, { useEffect, useState } from "react";
import "./Shop.css";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import axios from "axios";
import { useSearch } from "../hooks/SearchContext";
import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Shop = () => {
  const { searchTerm, brandFilter, categoryFilter } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("NewestFirst");
  const [products, setProducts] = useState([]);
  const [priceLimit, setPriceLimit] = useState(3000); // Default value for the slider
  const [ratingRange, setRatingRange] = useState([0, 5]); // Default rating range
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0); // Total number of products
  const [wishlistedProducts, setWishlistedProducts] = useState([]); // State to manage wishlisted products
  const navigate = useNavigate();

  const productsPerPage = 10;

  const handleSliderChange = (event, newValue) => {
    setPriceLimit(newValue);
    setCurrentPage(1);
  };

  const handleRatingChange = (e, newValue) => {
    // setRatingRange([0, newValue[1]]);
    setRatingRange(newValue);
    setCurrentPage(1);
  };

  const getSortValue = () => {
    switch (sortOption) {
      case "PriceHightoLow":
        return "price_desc";
      case "PriceLowtoHigh":
        return "price_asc";
      default:
        return "createdAt_desc";
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getproduct`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },

          params: {
            page: currentPage,
            limit: productsPerPage,
            search: searchTerm,
            sort: getSortValue(),
            brand: brandFilter,
            category: categoryFilter,
            maxPrice: priceLimit,
            minRating: ratingRange[0],
            maxRating: ratingRange[1],
          },
        }
      );

      console.log("RESPONSES : ", response.data);
      setProducts(response.data.products || []);
      setTotalPages(response.data.pages || 1);
      setTotalProducts(response.data.total || 0);
      // console.log(response.data);
      // setProducts(
      //   Array.isArray(response.data)
      //     ? response.data
      //     : response.data.products || []
      // );
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  };

  // Fetch wishlist products
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const wishlistProducts = response.data.wishlist || [];

      setWishlistedProducts(wishlistProducts.map((p) => p._id));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist(); // Fetch wishlist on first load
  }, []);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchProducts();
    }, 300); // delay of 300ms

    return () => clearTimeout(debounceFetch);
  }, [
    currentPage,
    sortOption,
    priceLimit,
    ratingRange,
    searchTerm,
    brandFilter,
    categoryFilter,
  ]);

  // const product = Shop_Products;

  // Sort the Product select sort option
  // let sortedProducts = [...products];

  // if (sortOption === "NewestFirst") {
  //   sortedProducts = [...sortedProducts];
  // } else if (sortOption === "PriceHightoLow") {
  //   sortedProducts.sort((a, b) => b.price - a.price);
  // } else if (sortOption === "PriceLowtoHigh") {
  //   sortedProducts.sort((a, b) => a.price - b.price);
  // }

  // const filteredProducts = sortedProducts.filter(
  //   (product) =>
  //     product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     product.price <= value
  // );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Pagination Logic
  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = filteredProducts.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );
  // const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle toggle wishlist
  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to wishlist a product");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/wishlist/toggle`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedWishlist = response.data.wishlist || []; // Update local state (based on response)
      setWishlistedProducts(updatedWishlist);

      if (updatedWishlist.includes(productId)) {
        toast.success("Added to wishlist successfully");
      } else {
        toast.success("Removed from wishlist successfully");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Error updating wishlist");
    }
  };

  return (
    <>
      {/* <Main_Navbar /> */}

      <div style={{ border: "1px solid #e4e6eb", marginBottom: "20px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="shop">
              <div className="row rows-cols-12">
                <div className="col-12 col-lg-3">
                  <div className="product-filter">
                    <div className="mb-4 card">
                      <h3 className="card-header">Price</h3>
                      <div className="card-body">
                        <div className="mx-2 mb-3">
                          <Box
                            sx={{
                              width: 300,
                              style: "#2962ff",
                            }}
                          >
                            <Slider
                              value={priceLimit}
                              min={1}
                              max={5000}
                              onChange={handleSliderChange}
                              aria-label="Price Slider"
                              valueLabelDisplay="auto"
                              valueLabelFormat={(val) => `$${val}`} // No conversion needed now
                              sx={{
                                color: "#2962ff", // Blue accent
                                width: "84%",
                                "& .MuiSlider-thumb": {
                                  backgroundColor: "#2962ff",
                                  fontSize: "14px",
                                  width: "15px",
                                  height: "15px",
                                },
                                "& .MuiSlider-track": {
                                  backgroundColor: "#2962ff",
                                },
                                "& .MuiSlider-rail": {
                                  opacity: 0.3,
                                  backgroundColor: "#b0bec5",
                                },
                              }}
                            />

                            <Grid container justifyContent="space-between">
                              <Typography
                                variant="body2"
                                sx={{ color: "#000", fontSize: "14px" }}
                              >
                                <span style={{ fontSize: "16px" }}>$1</span>
                              </Typography>

                              {/* <Typography
                                variant="body2"
                                sx={{ color: "#2962ff", fontWeight: 500 }}
                              >
                                Up to ${value}
                              </Typography> */}

                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#000",
                                  fontSize: "14px",
                                  paddingRight: "55px",
                                }}
                              >
                                <span style={{ fontSize: "16px" }}>$5000</span>
                              </Typography>
                            </Grid>
                          </Box>
                        </div>
                      </div>
                    </div>

                    {/* Rating Filter  */}

                    <div className="card">
                      <h3 className="card-header">Rating</h3>
                      <div className="card-body">
                        <Box sx={{ width: 270, px: 2 }}>
                          <Slider
                            value={ratingRange}
                            min={0}
                            max={5}
                            step={0.5}
                            // onChange={(e, newValue) => setRatingRange(newValue)}
                            onChange={handleRatingChange}
                            aria-label="Rating Slider"
                            valueLabelDisplay="auto"
                            valueLabelFormat={(val) => `${val} ★`}
                            sx={{
                              color: "#fbc02d", // Gold
                              "& .MuiSlider-thumb": {
                                backgroundColor: "#2962ff",
                                width: "15px",
                                height: "15px",
                              },
                              "& .MuiSlider-track": {
                                backgroundColor: "#2962ff",
                              },
                              "& .MuiSlider-rail": {
                                opacity: 0.3,
                                backgroundColor: "#ccc",
                              },
                            }}
                          />
                          <Grid container justifyContent="space-between">
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "16px" }}
                            >
                              {ratingRange[0]}
                              <span
                                style={{
                                  color: " rgb(255, 179, 2)",
                                  fontSize: "22px",
                                  marginLeft: "3px",
                                }}
                              >
                                ★
                              </span>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "16px" }}
                            >
                              {ratingRange[1]}{" "}
                              <span
                                style={{
                                  color: " rgb(255, 179, 2)",
                                  fontSize: "22px",
                                }}
                              >
                                ★
                              </span>
                            </Typography>
                          </Grid>
                        </Box>
                      </div>
                    </div>
                  </div>
                </div>

                {/* // Product List  */}

                <div className="col-12 col-lg-9">
                  <div className="shop-toolbar row align-items-center bg-white mx-0 my-4 py-3">
                    <div className="col-lg-6">
                      {/* <span>Showing:</span> {indexOfFirstProduct + 1}-
                      {Math.min(indexOfLastProduct, products.length)} of{" "}
                      {products.length} products */}
                      Showing : {(currentPage - 1) * productsPerPage + 1} -{" "}
                      {Math.min(currentPage * productsPerPage, totalProducts)}{" "}
                      products of {totalProducts} products
                    </div>
                    <div className="col-lg-6 text-end">
                      <span>Sort by</span>
                      <div className="dropdown d-inline ms-2">
                        <button
                          className="btn bg-light dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ border: "1px solid #e4e6eb" }}
                        >
                          {/* {sortOption === "NewestFirst"
                            ? "Newest First"
                            : sortOption === "PriceHightoLow"
                            ? "Price High to Low"
                            : "Price Low to High"} */}
                          {
                            {
                              NewestFirst: "Newest First",
                              PriceHightoLow: "Price High to Low",
                              PriceLowtoHigh: "Price Low to High",
                            }[sortOption]
                          }
                        </button>
                        <ul className="dropdown-menu">
                          {[
                            "NewestFirst",
                            "PriceHightoLow",
                            "PriceLowtoHigh",
                          ].map((option) => (
                            <li key={option}>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => setSortOption(option)}
                              >
                                {
                                  {
                                    NewestFirst: "Newest First",
                                    PriceHightoLow: "Price High to Low",
                                    PriceLowtoHigh: "Price Low to High",
                                  }[option]
                                }
                              </a>
                            </li>
                          ))}
                          {/* <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={() => setSortOption("NewestFirst")}
                            >
                              Newest First
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={() => setSortOption("PriceHightoLow")}
                            >
                              Price High to Low
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={() => setSortOption("PriceLowtoHigh")}
                            >
                              Price Low to High
                            </a>
                          </li> */}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* // Display Products */}

                  <div className="product-list-1">
                    {products.length === 0 ? (
                      <div
                        style={{
                          width: "100%",
                          textAlign: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                          marginLeft: "167%",
                        }}
                      >
                        No products found.
                      </div>
                    ) : (
                      products.map((product, index) => (
                        <div
                          className="mb-3"
                          key={index}
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          <div className="product-container">
                            <div
                              className="add-wishlist-box"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product._id);
                              }}
                            >
                              <i
                                className="fa-solid fa-heart"
                                style={{
                                  fontSize: "20px",
                                  color: wishlistedProducts.includes(
                                    product._id
                                  )
                                    ? "red"
                                    : "#aab8c2",

                                  transition:
                                    "transform 0.2s ease, color 0.3s ease",
                                  transform: wishlistedProducts.includes(
                                    product._id
                                  )
                                    ? "scale(1.2)"
                                    : "scale(1)",
                                }}
                                // style={{ fontSize: "20px", color: "#aab8c2" }}
                              ></i>
                            </div>
                            <div className="product-img">
                              <img
                                src={`${
                                  import.meta.env.VITE_API_URL
                                }/api/uploads/${product.file}`}
                                alt={product.name}
                              />
                            </div>
                            <div className="item-body">
                              <div className="item-name">
                                <h1>{product.name}</h1>
                              </div>
                              <div className="item-details">
                                <p>
                                  By {product.selectedProduct} <br />
                                  {product.description}
                                </p>
                              </div>
                              <div className="item-price">
                                <p>$ {product.price}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pagination */}

                  <div className="pagination-box">
                    <nav aria-label="Page navigation">
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage - 1)}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li
                            key={i}
                            className={`page-item ${
                              currentPage === i + 1 ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => paginate(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
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

export default Shop;
