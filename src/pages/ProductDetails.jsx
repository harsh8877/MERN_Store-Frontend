import React, { useEffect, useState } from "react";
import "./ProductDetails.css";
import { ToastContainer, toast } from "react-toastify";

import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import pencil from "../images/pencil.jpg";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";
import { useCart } from "../hooks/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      title: "",
      comment: "",
      rating: 0,
      recommend: "",
    },
  });

  const selectedRating = watch("rating");

  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   toast.error("You must be logged in to view this page");

    //   return;
    // }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getproduct/${id}`, {
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("token")}`,
        // },
      })
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("Error fetching product", err);
        toast.error("Failed to load product");
      });
  }, [id]);

  const isInCart = product
    ? cartItems.some((item) => item._id === product._id)
    : false;

  const toggleCartItem = () => {
    if (!product) return;
    if (isInCart) {
      removeFromCart(product._id);
    } else {
      addToCart({ ...product, quantity });
    }
  };

  // const recommendValue = watch("recommend");

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/addreview`,
        {
          product: id,
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Review submitted!");
      reset();
    } catch (error) {
      console.error("Failed to submit review", error);
      toast.error("Failed to submit review");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
      {/* <Main_Navbar /> */}
      <div style={{ border: "1px solid #e4e6eb", marginBottom: "30px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="product-shop">
              <div className="flex-row row">
                <div className="mb-3 px-3 px-md-2 col-12 col-md-5 col-lg-5">
                  <img
                    src={`http://localhost:5000/api/uploads/${product.file}`}
                    alt={product.name}
                    style={{ width: "300px", height: "400px" }}
                  />
                </div>
                <div className="mb-3 px-3 px-md-2 col-12 col-md-7 col-lg-7">
                  <div className="product-container-1">
                    <div className="item-box-1">
                      <div className="item-details-1">
                        <h1 className="item-name-1">{product.name}</h1>
                        <p className="sku">{product.sku}</p>
                        <div
                          style={{
                            border: "1px solid rgba(0, 0, 0, .1)",
                            borderColor: "#eceef3",
                            marginBottom: "16px",
                            marginTop: "16px",
                          }}
                        ></div>
                        <p className="item-desc-1">
                          See More From {product.selectedProduct}
                        </p>
                        <p className="item-desc-1">{product.description}</p>
                        <p className="price-1">$ {product.price}</p>
                      </div>
                    </div>
                    <div className="item-customize-1">
                      <div className="input-box">
                        <label>Quantity</label>
                        <div className="input-text-block">
                          <input
                            type="number"
                            name="quantity"
                            placeholder="Product Quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="my-4 item-share-1">
                      <ul className="d-flex flex-row mx-0 mb-0 justify-content-center justify-content-md-start share-box-1">
                        <li>
                          <button style={{ border: "none" }}>
                            <i
                              className="fa-brands fa-facebook-f"
                              style={{
                                padding: "8px 12px",
                                borderRadius: "50%",
                                backgroundColor: "#4267B2",
                                color: "#fff",
                              }}
                            ></i>
                          </button>
                        </li>
                        <li>
                          <button style={{ border: "none" }}>
                            <i
                              className="fa-brands fa-twitter"
                              style={{
                                padding: "8px 9px",
                                borderRadius: "50%",
                                backgroundColor: "#1da1f2",
                                color: "#fff",
                              }}
                            ></i>
                          </button>
                        </li>
                        <li>
                          <button
                            style={{
                              border: "none",
                              padding: "4px 9px",
                              borderRadius: "50%",
                              backgroundColor: "#4267B2",
                              color: "#fff",
                            }}
                          >
                            <i className="fa-solid fa-envelope"></i>
                          </button>
                        </li>
                        <li>
                          <button
                            style={{
                              border: "none",
                              padding: "4px 10px",
                              borderRadius: "50%",
                              backgroundColor: "#128c7e",
                              color: "#fff",
                            }}
                          >
                            <i className="fa-brands fa-whatsapp"></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="item-actions-1">
                      <button
                        className="input-btn bag-btn custom-btn-primary md with-icon icon-left"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#bagOffcanvas"
                        onClick={toggleCartItem}
                      >
                        <div className="btn-icon-1">
                          <i
                            className="fa-solid fa-bag-shopping"
                            style={{
                              cursor: "pointer",
                              width: "20px",
                              height: "20px",
                              strokeWidth: "20px",
                              stroke: "#000",
                              color: "#000",
                            }}
                          ></i>
                        </div>
                        <span className="btn-text-1">
                          {isInCart ? "Remove from Bag" : "Add to Bag"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offcanvas for Bag */}

              {/* Review Section */}
              <div className="mt-md-4 product-reviews">
                <div className="flex-row row">
                  <div className="mb-3 px-3 px-md-2 col-12 col-md-5 col-lg-5">
                    <div className="bg-white p-4 box-shadow-primary review-summary">
                      <h2 className="mb-0">Rating</h2>
                      <div
                        style={{
                          border: "3px solid rgb(241, 241, 241)",
                          marginTop: "20px",
                          marginBottom: "16px",
                        }}
                      ></div>
                      <div className="not-found">
                        <img
                          src={pencil}
                          alt=""
                          style={{ width: "50px", height: "50px" }}
                        />
                        <p className="mb-2">Be the first to add a review.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 px-3 px-md-2 col-12 col-md-7 col-lg-7">
                    <div className="bg-white p-4 box-shadow-primary add-review">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <h3 className="mb-3">Add Review</h3>
                        <div className="row">
                          <div className="col-12">
                            <div className="input-box">
                              <label>Title</label>
                              <div className="input-text-block">
                                <input
                                  type="text"
                                  placeholder="Enter Review Title"
                                  {...register("title", { required: true })}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="input-box">
                              <label>Comment</label>
                              <div className="input-text-block">
                                <textarea
                                  rows="4"
                                  placeholder="Write Review"
                                  {...register("comment", { required: true })}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="input-box">
                              <label>Rating</label>
                              <div className="react-star">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <i
                                    key={star}
                                    className="fa-solid fa-star"
                                    style={{
                                      color:
                                        selectedRating >= star
                                          ? "gold"
                                          : "lightgray",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => setValue("rating", star)}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="input-box">
                              <label>Will you recommend this product?</label>
                              <div className="input-text-block">
                                <select
                                  className="form-select"
                                  {...register("recommend", { required: true })}
                                  style={{
                                    color: "#323232",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                  }}
                                >
                                  <option value="">Select the Option</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <button className="input-btn custom-btn-secondary md text-only icon-left">
                            <span>Publish Review</span>
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

export default ProductDetails;
