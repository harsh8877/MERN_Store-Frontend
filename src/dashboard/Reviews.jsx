import React, { useEffect, useState } from "react";
import Main_Navbar from "../pages/Main_Navbar";
import Footer from "../components/Footer";
import Panelsidebar from "./Panelsidebar";
import axios from "axios";
import "./Review.css";
import format from "date-fns/format";
import { ToastContainer, toast } from "react-toastify";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${process.env.VITE_API_URL}/api/getreviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(
        `${process.env.VITE_API_URL}/api/deletereviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviews(reviews.filter((review) => review._id !== reviewId));
      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting review");
    }
  };

  return (
    <>
      <Main_Navbar />

      <div style={{ border: "1px solid #e4e6eb", marginBottom: "30px" }}></div>

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
                        Reviews
                      </h3>
                    </div>
                    <p></p>
                    {reviews.map((review, index) => (
                      <div className="review-list" key={index}>
                        <div className="review-box">
                          <div className="mb-3 p-4">
                            <div className="d-flex flex-row mx-0 mb-2 mb-lg-3 align-items-center justify-content-between">
                              <div className="review-content">
                                <div className="d-flex flex-row mx-0 mb-2 align-items-center justify-content-between">
                                  <p className="mb-0 fw-medium fs-16 text-truncate">
                                    {review.title}
                                  </p>
                                </div>
                                <p className="mb-0 fw-normal fs-14 word-break-all">
                                  {review.comment}
                                </p>
                              </div>
                              {/* <div className="review-img"></div> */}
                            </div>
                            <div
                              className="review-star"
                              style={{ marginTop: "20px" }}
                            >
                              <p>
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className="fa-solid fa-star"
                                    style={{
                                      color:
                                        i < review.rating
                                          ? "gold"
                                          : "lightgray",
                                    }}
                                  ></i>
                                ))}
                              </p>
                            </div>
                            <div
                              className="review-date"
                              style={{ marginTop: "20px" }}
                            >
                              <p>
                                Review Added on{" "}
                                {review.createdAt
                                  ? !isNaN(new Date(review.createdAt).getTime())
                                    ? format(
                                        new Date(review.createdAt),
                                        "EEEE, M/d/yyyy"
                                      )
                                    : "Invalid date"
                                  : "Date not available"}
                              </p>
                            </div>
                            <div
                              style={{
                                border: "1px solid rgba(0,0,0,0.1",
                                borderColor: "#eceef3",
                              }}
                            ></div>
                            <div className="review-status">
                              <div className="review-icon">
                                <i className="fa-solid fa-check"></i>
                                <p>Approved</p>
                              </div>
                              <button
                                className="input-btn mt-3 mt-lg-0 custom-btn-secondary md with-icon icon-left"
                                onClick={() => handleDelete(review._id)}
                              >
                                <div className="btn-icon-1">
                                  <i
                                    className="fa-regular fa-trash-can"
                                    style={{ color: "#434343" }}
                                  ></i>
                                  <span className="ms-2">Delete</span>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default Reviews;
