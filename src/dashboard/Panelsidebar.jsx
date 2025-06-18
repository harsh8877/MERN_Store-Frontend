import React from "react";
import "./Panelsidebar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";

const Panelsidebar = () => {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <div className="panel-sidebar">
        <h3 className="panel-title">Account</h3>
        <nav className="navbar navbar-expand-md navbar-light bg-light">
          <div className="collapse navbar-collapse">
            <ul className="panel-links">
              <li>
                <Link to="/dashboard/accountdetails" className="active-link">
                  Account Details
                </Link>
              </li>
              <li>
                <Link to="/dashboard/accountsecurity" className="active-link">
                  Account Security
                </Link>
              </li>
              <li>
                <Link to="/dashboard/address" className="active-link">
                  Address
                </Link>
              </li>
              {auth.role === "admin" && (
                <>
                  <li>
                    <Link to="/dashboard/products" className="active-link">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/categories" className="active-link">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/brand" className="active-link">
                      Brand
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/users" className="active-link">
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/merchants" className="active-link">
                      Merchants
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/dashboard/order" className="active-link">
                  Orders
                </Link>
              </li>
              {auth.role === "admin" && (
                <>
                  <li>
                    <Link to="/dashboard/reviews" className="active-link">
                      Reviews
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/dashboard/wishlist" className="active-link">
                  WishList
                </Link>
              </li>
              <li style={{ borderBottom: "1px solid #eceef3" }}>
                <a href="" className="active-link">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Panelsidebar;
