import React, { useEffect, useState } from "react";
import "./Users.css";
import Main_Navbar from "../pages/Main_Navbar";
import Panelsidebar from "./Panelsidebar";
import axios from "axios";
import format from "date-fns/format";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import Footer from "../components/Footer";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { register, watch } = useForm();
  const searchTerm = watch("search") || "";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/getusers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const filteredUsers = response.data.filter(
          (user) =>
            user.role === "admin" ||
            user.role === "merchant" ||
            user.role === "member"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users. Please try again later.");
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleLabels = {
    admin: { label: "Admin", color: "#e74c3c" },
    member: { label: "Member", color: "#3498db" },
    merchant: { label: "Merchant", color: "#2ecc71" },
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
                <div className="col-12 col-md-7 col-xl-9">
                  <div className="panel-body">
                    <div className="subpage-header">
                      <h3 style={{ fontSize: "17px" }}>Users</h3>
                    </div>
                    <div className="users-data">
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="search-box inline-btn-box">
                          <div className="input-text-block">
                            <input
                              type="text"
                              placeholder="Type User Name Or Email"
                              {...register("search")}
                            />
                            <button className="input-btn custom-btn-primary md text-only icon-left">
                              <span>Search</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="users-list">
                      {filteredUsers.length === 0 ? (
                        <p>No users found</p>
                      ) : (
                        <ul>
                          {filteredUsers.map((user) => (
                            <li key={user._id} className="users-item">
                              <h3>Name</h3>
                              <p>{user.fname}</p>
                              <h3>Email</h3>
                              <p>{user.email}</p>
                              <h3>Provider</h3>
                              <p>
                                {user.provider === "google"
                                  ? "Google"
                                  : "Email"}
                              </p>
                              <h3>Account Created</h3>
                              <p>
                                {user.createdAt
                                  ? !isNaN(new Date(user.createdAt).getTime())
                                    ? format(
                                        new Date(user.createdAt),
                                        "EEEE, M/d/yyyy"
                                      )
                                    : "Invalid date"
                                  : "Date not available"}
                              </p>
                              <h3>Role</h3>
                              <p style={{ marginTop: "8px" }}>
                                {user.role && roleLabels[user.role] ? (
                                  <span
                                    style={{
                                      padding: "8px 8px",
                                      borderRadius: "4px",
                                      backgroundColor:
                                        roleLabels[user.role].color,
                                      color: "#fff",
                                      fontSize: "12px",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {roleLabels[user.role].label}
                                  </span>
                                ) : (
                                  <span style={{ color: "#999" }}>
                                    Role not set
                                  </span>
                                )}
                              </p>
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
        </div>
      </main>

      <Footer />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Users;
