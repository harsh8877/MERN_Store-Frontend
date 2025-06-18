import React, { useState } from "react";
import "./Navbar.css";
import Carousel from "../pages/Carousel";
import Footer from "./Footer";

const Navbar = () => {
  return (
    <>
      <div style={{ overflowY: "hidden" }}>
        <div
          style={{ border: "1px solid #e4e6eb", marginBottom: "40px" }}
        ></div>

        <Carousel />

        <div style={{ border: "1px solid #e4e6eb", marginTop: "140px" }}></div>

        <Footer />
      </div>
    </>
  );
};

export default Navbar;
