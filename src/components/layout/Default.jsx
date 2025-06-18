import React from "react";
import Main_Navbar from "../../pages/Main_Navbar";
import { Outlet } from "react-router-dom";
import CartSheet from "../common/cart-sheet";
import { CartProvider } from "../../hooks/CartContext";
import "react-toastify/dist/ReactToastify.css";

const Default = () => {
  return (
    <div>
      <CartProvider>
        <Main_Navbar />
        <Outlet />
        <CartSheet />
      </CartProvider>
    </div>
  );
};

export default Default;
