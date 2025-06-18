import React from "react";
import banner1 from "../images/banner-1.jpg";
import banner2 from "../images/banner-2.jpg";
import banner3 from "../images/banner-3.jpg";
import banner4 from "../images/banner-4.jpg";
import banner5 from "../images/banner-5.jpg";

const Carousel = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="d-flex flex-column h-100 justify-content-between">
              <img
                src={banner1}
                alt=""
                style={{
                  width: "265.5px",
                  height: "217.22px",
                  margin: "0 auto",
                }}
              />
              <img
                src={banner2}
                alt=""
                style={{
                  width: "265.5px",
                  height: "110.08px",
                  margin: "0 auto",
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex flex-column h-100 justify-content-between">
              <div
                id="carouselExampleControls"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src={banner4}
                      className="d-block w-100"
                      alt="..."
                      style={{
                        width: "547px",
                        height: "364.66px",
                        margin: "auto",
                      }}
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={banner5}
                      className="d-block w-100"
                      alt="..."
                      style={{
                        width: "547px",
                        height: "364.66px",
                        margin: "auto",
                      }}
                    />
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="d-flex flex-column h-100 justify-content-between">
              <img
                src={banner1}
                alt=""
                style={{
                  width: "265.5px",
                  height: "217.22px",
                  margin: "0 auto",
                }}
              />
              <img
                src={banner3}
                alt=""
                style={{
                  width: "265.5px",
                  height: "110.08px",
                  margin: "0 auto",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
