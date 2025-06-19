import React from "react";
import { ToastContainer, toast } from "react-toastify";

import "./OrderDetails.css";
import Footer from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchOrderAndUser = async () => {
      try {
        // 1. Fetch Order Details
        const orderRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/order/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(orderRes.data);

        // 2. Fetch Logged-in User Details (with role)
        const userRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/getuser`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserRole(userRes.data.role); // e.g., "admin", "member", etc.
        // console.log(res.data.role);
      } catch (err) {
        console.error("Error fetching order or user info:", err);
      }
    };

    fetchOrderAndUser();
  }, [orderId]);

  if (!order || !order.productIds) {
    return (
      <div className="container">
        <h6>Loading order details...</h6>
      </div>
    );
  }

  const taxRate = 0.05; // 5% tax

  // Calculate the subtotal
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Calculate taxable subtotal only
  const texableSubtotal = order.items.reduce(
    (acc, item) =>
      item.product.texable ? acc + item.product.price * item.quantity : acc,
    0
  );

  const estimatedTax = texableSubtotal * taxRate;
  const shipping = subtotal > 500 ? 0 : 25; // Free shipping for over $500
  const total = subtotal + estimatedTax + shipping;

  // Function to handle order cancellation
  const handleCancelOrder = () => {
    const token = localStorage.getItem("token");

    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Order Cancelled successfully");
        setOrder(null);
        navigate("/dashboard/order");
      })
      .catch((error) => {
        console.error("Error cancelling order : ", error);
        toast.error("Failed to cancel order");
      });
  };

  // Function to handle status change
  const handleStatusChange = async (itemId, newStatus) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/order/${orderId}/item/${itemId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrder(res.data.order); // update order state
      toast.success("Status updated successfully");
      navigate("/dashboard/order");
    } catch (error) {
      console.error("Failed to update item status:", error);
      toast.error("Failed to update item status");
    }
  };

  return (
    <>
      {/* <Main_Navbar /> */}

      <div style={{ border: "1px solid #e4e6eb", marginBottom: "5px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="details-page">
              <div className="row">
                <div className="col-12 col-md-12">
                  <div className="details-meta">
                    <div className="d-flex align-items-center justify-content-between mb-3 title">
                      <h2 className="details-title">Order Details</h2>
                      <button className="input-btn custom-btn-link sm with-icon icon-left gap-2">
                        <i
                          className="fa-solid fa-arrow-left"
                          style={{
                            color: "black",
                            fontSize: "13px",
                          }}
                        ></i>
                        <Link
                          to="/dashboard/order"
                          style={{
                            fontSize: "12px",
                            color: "#323232",
                            fontWeight: "400",
                            textDecoration: "none",
                          }}
                        >
                          Back to orders
                        </Link>
                      </button>
                    </div>
                    <div className="row">
                      <div className="col-12 col-md-8">
                        <div className="row">
                          <div className="col-4">
                            <p style={{ fontSize: "14px", color: "#323232" }}>
                              Order ID
                            </p>
                          </div>
                          <div className="col-8">
                            <span style={{ fontWeight: "500" }}>
                              {order._id}
                            </span>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-4">
                            <p style={{ fontSize: "14px", color: "#323232" }}>
                              Order Date
                            </p>
                          </div>
                          <div className="col-8">
                            <span style={{ fontWeight: "500" }}>
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left text-md-right col-12 col-md-4">
                        <button
                          className="input-btn custom-btn-secondary sm text-only icon-left"
                          type="button"
                          onClick={handleCancelOrder}
                        >
                          <span>Cancel Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {order.items.map((item, index) => (
                <div className="mt-5 row" key={index}>
                  <div className="col-12 col-lg-8">
                    <div className="order-items pt-3">
                      <h2
                        style={{
                          fontSize: "18px",
                          color: "#262626",
                          fontWeight: "600",
                        }}
                      >
                        Order Items
                      </h2>
                      <div className="row">
                        <div className="item col-12">
                          <div className="order-details-item-box">
                            <div className="d-flex justify-content-between flex-column flex-md-row">
                              <div className="d-flex align-items-center box">
                                <img
                                  src={`http://localhost:5000/api/uploads/${item.product.file}`}
                                  alt={item.product.name}
                                  style={{
                                    width: "95px",
                                    height: "110px",
                                    borderRadius: "3px",
                                  }}
                                />
                                <div className="d-md-flex flex-1 align-items-start ml-4 item-box">
                                  <div className="item-details">
                                    <Link
                                      to={`/product/${item.product._id}`}
                                      style={{
                                        fontSize: "16px",
                                        textDecoration: "none",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {item.product.name}
                                    </Link>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <span style={{ fontWeight: "400" }}>
                                        ${item.product.price}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="d-none d-md-flex justify-content-between align-items-center box">
                                <div className="text-center">
                                  <p
                                    style={{
                                      color: "#758696",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {item.status}
                                  </p>
                                  <p>Status</p>
                                </div>
                                <div className="text-center">
                                  <p style={{ fontWeight: "500" }}>
                                    {item.quantity}
                                  </p>
                                  <p>Quantity</p>
                                </div>
                                <div className="text-center">
                                  <p style={{ fontWeight: "500" }}>
                                    ${item.product.price * item.quantity}
                                  </p>
                                  <p>Total Price</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right mt-2 mt-md-0">
                              <div className="text-right mt-2 mt-md-0">
                                {userRole === "admin" ? (
                                  // Admin status dropdown
                                  <div className="dropdown">
                                    <button
                                      className="btn dropdown-toggle"
                                      type="button"
                                      id="statusDropdown"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      style={{
                                        border: "1px solid rgb(236, 238, 243)",
                                      }}
                                    >
                                      Change Status
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleStatusChange(
                                              item._id,
                                              "Processing"
                                            )
                                          }
                                        >
                                          Processing
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleStatusChange(
                                              item._id,
                                              "Shipped"
                                            )
                                          }
                                        >
                                          Shipped
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleStatusChange(
                                              item._id,
                                              "Delivered"
                                            )
                                          }
                                        >
                                          Delivered
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={handleCancelOrder}
                                        >
                                          Cancelled
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleStatusChange(
                                              item._id,
                                              "Not Processed"
                                            )
                                          }
                                        >
                                          Not Processed
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                ) : (
                                  // Non-admin sees CANCEL option
                                  <div className="dropdown">
                                    <button
                                      className="btn dropdown-toggle"
                                      type="button"
                                      id="dropdownMenuButton"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      style={{
                                        border: "1px solid rgb(236, 238, 243)",
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <ul
                                      className="dropdown-menu dropdown-menu-end"
                                      aria-labelledby="dropdownMenuButton"
                                      style={{ border: "none" }}
                                    >
                                      <li>
                                        <a
                                          className="dropdown-item"
                                          href="#"
                                          style={{
                                            textAlign: "center",
                                            fontSize: "14px",
                                            color: "#323232",
                                          }}
                                        >
                                          Are you sure you want to <br /> cancel{" "}
                                          {item.product.name}?
                                        </a>
                                        <button
                                          style={{
                                            borderRadius: "3px",
                                            backgroundColor: "#dc3545",
                                            border: "none",
                                            color: "white",
                                            padding: "6px 10px",
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            display: "block",
                                            margin: "auto",
                                            marginTop: "5px",
                                          }}
                                          onClick={handleCancelOrder}
                                        >
                                          Confirm Cancel
                                        </button>
                                      </li>
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
                  <div className="mt-5 mt-lg-0 col-12 col-lg-4">
                    <div className="order-summary pt-3 col">
                      <h2 style={{ fontSize: "18px", color: "#262626" }}>
                        Order Summary
                      </h2>
                      <div className="d-flex align-items-center summary-item">
                        <p>Subtotal</p>
                        <p className="summary-value ml-auto">
                          ${subtotal.toFixed(2)}
                        </p>
                      </div>
                      <div className="d-flex align-items-center summary-item">
                        <p>Est. Sales Tax</p>
                        <p className="summary-value ml-auto">
                          ${estimatedTax.toFixed(2)}
                        </p>
                      </div>
                      <div className="d-flex align-items-center summary-item">
                        <p>Shipping & Handling</p>
                        <p className="summary-value ml-auto">
                          ${shipping.toFixed(2)}
                        </p>
                      </div>
                      <div
                        style={{
                          border: "1px solid #eceef3",
                          marginTop: "16px",
                          marginBottom: "16px",
                        }}
                      ></div>
                      <div className="d-flex align-items-center summary-item">
                        <p>Total</p>
                        <p className="summary-value ml-auto">
                          ${total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginTop: "60px" }}></div>

      <Footer />

      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </>
  );
};

export default OrderDetails;
