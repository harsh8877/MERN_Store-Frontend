import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../hooks/CartContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const CartSheet = () => {
  const { cartItems, removeFromCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    // const token = localStorage.getItem("token");
    // if (!token) {
    //   toast.error("You must be logged in to place an order");
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

  const handlePlaceOrder = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to place an order");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/placeorder`,
        { items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("Received items : ", items);
        const orderId = res.data.orderId;
        toast.success("Order placed successfully!");
        // setTimeout(() => {
        navigate(`/order/success/${orderId}`);
        // }, 500);
      })
      .catch((err) => {
        toast.error("Order failed");
        console.error("Failed to place order", err);
      });
  };

  return (
    <>
      <div>
        <div
          className="offcanvas offcanvas-end custom-offcanvas-width"
          tabIndex="-1"
          id="bagOffcanvas"
          aria-labelledby="bagOffcanvasLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <hr />
          <div className="offcanvas-body">
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-1">
                  <i
                    className="fa-solid fa-bag-shopping"
                    style={{ fontSize: "40px" }}
                  ></i>
                  <p>Your shopping cart is empty</p>
                </div>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="cart-list-1 mb-3">
                  <div className="item-box-1">
                    <div className="container">
                      <div className="mb-2 align-items-center cart-container-1">
                        <div
                          className="pr-0 d-flex justify-content-between align-items-center"
                          style={{ width: "100%" }}
                        >
                          <img
                            className="item-image"
                            src={`http://localhost:5000/api/uploads/${item.file}`}
                            alt={item.name}
                          />
                          <h6>{item.name}</h6>
                          <div className="text-right col-2">
                            <i
                              className="fa-solid fa-trash"
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() => removeFromCart(item._id)}
                            ></i>
                          </div>
                        </div>
                      </div>
                      <div className="cart-price">
                        <p
                          style={{
                            margin: "0",
                            fontSize: "14px",
                            color: "#323232",
                            fontWeight: "400",
                          }}
                        >
                          Price
                        </p>
                        <span
                          style={{
                            fontSize: "18px",
                            color: "#323232",
                            fontWeight: "400",
                          }}
                        >
                          ${product.price}
                        </span>
                      </div>
                      <div className="cart-quantity">
                        <p
                          style={{
                            margin: "0",
                            fontSize: "14px",
                            color: "#323232",
                            fontWeight: "400",
                          }}
                        >
                          Quantity
                        </p>
                        <span
                          style={{
                            fontSize: "18px",
                            color: "#323232",
                            fontWeight: "400",
                          }}
                        >
                          {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="offcanvas-footer">
            <div className="cart-checkout">
              <div style={{ padding: "10px" }}>
                <div className="container">
                  <div className="cart-shipping">
                    <p
                      style={{
                        margin: "0",
                        fontSize: "14px",
                        color: "#323232",
                        fontWeight: "400",
                      }}
                    >
                      Shipping
                    </p>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "rgb(50, 50, 50)",
                        fontWeight: "500",
                      }}
                    >
                      Free
                    </span>
                  </div>
                  <div className="cart-total">
                    <p
                      style={{
                        margin: "0",
                        fontSize: "14px",
                        color: "#323232",
                        fontWeight: "400",
                      }}
                    >
                      Total
                    </p>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "rgb(50, 50, 50)",
                        fontWeight: "500",
                      }}
                    >
                      $
                      {cartItems
                        .reduce(
                          (acc, item) => acc + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart-button">
              <button
                className="cart-btn-1"
                data-bs-toggle="offcanvas"
                data-bs-target="#bagOffcanvas"
                aria-controls="bagOffcanvas"
              >
                <Link className="cart-btn-text" to="/shop">
                  Continue Shopping
                </Link>
              </button>
              <button
                className="cart-btn-2"
                data-bs-toggle="offcanvas"
                data-bs-target="#bagOffcanvas"
                aria-controls="bagOffcanvas"
                onClick={handlePlaceOrder}
              >
                <Link
                  className="cart-btn-text"
                  // to={`/products/${product._id}`}
                >
                  Place Order
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSheet;
