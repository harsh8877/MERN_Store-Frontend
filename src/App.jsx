import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Forgot_Password from "./pages/Forgot_Password";
import Shop from "./components/Shop";
import Reset_Password from "./pages/Reset_Password";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./dashboard/Dashboard";
import AccountDetails from "./dashboard/AccountDetails";
import AccountSecurity from "./dashboard/AccountSecurity";
import Address from "./dashboard/Address";
import Products from "./dashboard/Products";
import Merchants from "./dashboard/Merchants";
import Categories from "./dashboard/Categories";
import Brand from "./dashboard/Brand";
import Users from "./dashboard/Users";
import Seller from "./pages/Seller";
import Shipping from "./pages/Shipping";
import ProtectedRoute from "./hooks/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import Reviews from "./dashboard/Reviews";
import OrderSuccess from "./pages/OrderSuccess";
import WishList from "./dashboard/WishList";
import Brands from "./pages/Brands";
import Order from "./dashboard/Order";
import OrderDetails from "./pages/OrderDetails";
import { ToastContainer, toast } from "react-toastify";

import Default from "./components/layout/Default";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Default />}>
            <Route path="/" element={<Navbar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<Forgot_Password />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/reset-password/:token" element={<Reset_Password />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/seller" element={<Seller />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route
              path="/reset-password/:token"
              element={<AccountSecurity />}
            />
            <Route path="/order/success/:orderId" element={<OrderSuccess />} />
            <Route path="/order/details/:orderId" element={<OrderDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Route>

          <Route
            path="/dashboard/accountdetails"
            element={
              <ProtectedRoute allowedRoles={["member", "merchant", "admin"]}>
                <AccountDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/accountsecurity"
            element={
              <ProtectedRoute allowedRoles={["member", "merchant", "admin"]}>
                <AccountSecurity />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/address"
            element={
              <ProtectedRoute allowedRoles={["member", "merchant", "admin"]}>
                <Address />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/merchants"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Merchants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/categories"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/brand"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Brand />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reviews"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/order"
            element={
              <ProtectedRoute allowedRoles={["member", "merchant", "admin"]}>
                <Order />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/wishlist"
            element={
              <ProtectedRoute allowedRoles={["member", "merchant", "admin"]}>
                <WishList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
