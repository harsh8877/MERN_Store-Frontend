import React, { useEffect, useState } from "react";
import "./OrderSuccess.css";
import Footer from "../components/Footer";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrder(res.data))
      .catch((err) => console.error("Failed to load order", err));
  }, [orderId]);

  if (!order) {
    return (
      <div className="loading-state">
        <h2>Loading your order...</h2>
      </div>
    );
  }

  return (
    <>
      {/* <Main_Navbar /> */}

      <div style={{ border: "1px solid #e4e6eb", marginBottom: "30px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="order-success">
              <div className="order-message">
                <h2 className="order-success-text">
                  Thank you for your order!
                </h2>
                {order ? (
                  <ul style={{ listStyle: "none", paddingLeft: "0px" }}>
                    {order.items.map((product, index) => (
                      <li key={index} className="order-success-item">
                        Order #
                        <Link
                          to={`/order/details/${order._id}`}
                          style={{
                            fontWeight: "500",
                            color: "#65676b",
                            textDecoration: "none",
                          }}
                        >
                          {product._id}
                        </Link>
                        is complete
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No product information available.</p>
                )}
                <p className="order-success-para">
                  A confirmation email will be sent to you shortly.
                </p>
                <div className="order-success-actions">
                  <Link to="/dashboard/order" className="order-success-link">
                    Manage Orders
                  </Link>
                  <Link to="/shop" className="order-success-link ms-2">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginTop: "300px" }}></div>

      <Footer />
    </>
  );
};

export default OrderSuccess;
