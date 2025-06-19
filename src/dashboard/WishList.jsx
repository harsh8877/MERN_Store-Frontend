import React, { useEffect, useState } from "react";
import "./WishList.css";
import Main_Navbar from "../pages/Main_Navbar";
import Panelsidebar from "./Panelsidebar";
import axios from "axios";
import Footer from "../components/Footer";

const WishList = () => {
  const [wishlist, setWishList] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // const wishlistIds = res.data.wishlist.map((item) => item._id);

        // console.log("Fetched wishlist:", res.data.wishlist);
        setWishList(res.data.wishlist || []);
      } catch (error) {
        console.error("Error fetching wishlist : ", error);
      }
    };
    fetchWishlist();
  }, []);

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
                    <div className="subpage-header">
                      <h3 style={{ fontSize: "17px", paddingBottom: "10px" }}>
                        Wish List
                      </h3>
                    </div>
                    {wishlist.length === 0 ? (
                      <p className="mt-3">No products in wishlist.</p>
                    ) : (
                      <ul className="wishlist">
                        {wishlist.map((product, index) => (
                          <li key={index} className="wishlist-item">
                            <div className="wishlist-image">
                              <img
                                src={`http://localhost:5000/api/uploads/${product.file}`}
                                alt={product.name}
                              />
                            </div>
                            <div className="wishlist-details">
                              <h4 className="wishlist-title">{product.name}</h4>
                              <p className="wishlist-brand">
                                {product.selectedProduct}
                              </p>
                              <p className="wishlist-description">
                                {product.description}
                              </p>
                              <p className="wishlist-price">
                                Price: ${product.price}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginTop: "20px" }}></div>

      <Footer />
    </>
  );
};

export default WishList;
