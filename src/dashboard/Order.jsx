import React, { useEffect, useState } from "react";
import "./Order.css";
import Main_Navbar from "../pages/Main_Navbar";
import Footer from "../components/Footer";
import Panelsidebar from "./Panelsidebar";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]); // Orders Filter

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or failed to fetch orders");
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data); // Initialize filtered orders
      })
      .catch((error) => {
        console.error("Error fetching orders : ", error);
      });
  }, []);

  const filterOrders = (value) => {
    if (!value.trim()) {
      setFilteredOrders(orders); // empty search returns all orders
    } else {
      const filtered = orders.filter((order) =>
        order._id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOrders(filtered);
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
                <div
                  className="col-12 col-md-7 col-xl-9"
                  style={{ overflowY: "auto" }}
                >
                  <div className="panel-body">
                    <div className="order-dashboard">
                      <div className="subpage">
                        <div className="subpage-header">
                          <h3>Your Orders</h3>
                        </div>
                        <div className="subpage-body">
                          <div className="mb-3">
                            <form onSubmit={(e) => e.preventDefault()}>
                              <div className="search-box inline-btn-box">
                                <div className="input-text-block">
                                  <input
                                    type="text"
                                    name="order"
                                    value={searchTerm}
                                    onChange={(e) => {
                                      setSearchTerm(e.target.value);
                                      filterOrders(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        filterOrders(searchTerm);
                                      }
                                    }}
                                    placeholder="Type The Complete Order ID"
                                  />
                                  <button
                                    type="submit"
                                    className="input-btn custom-btn-primary md text-only icon-left"
                                  >
                                    <span>Search</span>
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                          <p className="fw-normal">
                            {filteredOrders.length} orders
                          </p>
                          {filteredOrders.length === 0 ? (
                            <p>No orders found.</p>
                          ) : (
                            filteredOrders.map((order, index) => (
                              <div className="order-list" key={index}>
                                <div className="order-box">
                                  <Link
                                    to={`/order/details/${order._id}`}
                                    style={{ textDecoration: "none" }}
                                  >
                                    <div className="d-flex flex-column mb-3">
                                      <div key={order._id}>
                                        {order.items.map((item, index) => (
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "10px",
                                              marginBottom: "10px",
                                            }}
                                            key={index}
                                            className="d-flex flex-column flex-lg-row mb-3"
                                          >
                                            <div className="order-first-item p-lg-3">
                                              <img
                                                src={`http://localhost:5000/api/uploads/${item.file}`}
                                                alt={item.name}
                                                style={{
                                                  width: "100px",
                                                  height: "100px",
                                                  borderRadius: "3px",
                                                }}
                                              />
                                            </div>
                                            <div
                                              className="d-flex flex-column flex-xl-row justify-content-between flex-1 ml-lg-2 mr-xl-4 p-3"
                                              key={index}
                                            >
                                              <div className="order-details">
                                                <div className="mb-1">
                                                  <span
                                                    style={{
                                                      fontWeight: "400",
                                                      marginRight: "5px",
                                                    }}
                                                  >
                                                    Status
                                                  </span>
                                                  <span
                                                    style={{
                                                      color: "#758696",
                                                      fontWeight: "500",
                                                    }}
                                                  >
                                                    {item.status ||
                                                      "No status avaliable"}
                                                  </span>
                                                </div>
                                                <div className="mb-1">
                                                  <span
                                                    style={{
                                                      fontWeight: "400",
                                                      marginRight: "5px",
                                                    }}
                                                  >
                                                    Order
                                                  </span>
                                                  <span>#{order._id}</span>
                                                </div>
                                                <div className="mb-1">
                                                  <span
                                                    style={{
                                                      fontWeight: "400",
                                                      marginRight: "5px",
                                                    }}
                                                  >
                                                    Ordered On
                                                  </span>
                                                  <span>
                                                    {new Date(
                                                      order.createdAt
                                                    ).toLocaleDateString(
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
                                                <div className="mb-1">
                                                  <span
                                                    style={{
                                                      fontWeight: "400",
                                                      marginRight: "5px",
                                                    }}
                                                  >
                                                    Order Total
                                                  </span>
                                                  <span>${order.total}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
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

export default Order;
