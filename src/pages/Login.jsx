import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";

import google from "../images/goggle.jpg";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import loginValidator from "../validators/loginValidator";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../hooks/AuthContext";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const {
    loginWithRedirect,
    user,
    // isAuthenticated,
    // logout,
    isLoading,
    // handleRedirectCallback,
    // loginWithPopup,
  } = useAuth0();
  const { setAuth, setIsLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();

  console.log("Current User : ", user, isLoading);

  const {
    register, // register method for inputs
    handleSubmit, // handleSubmit method to handle form submission
    formState: { errors }, // Access form errors
  } = useForm({
    resolver: zodResolver(loginValidator),
  });

  const handleLogin = async (data) => {
    const { email, password } = data;

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("email", email);

        const decoded = jwtDecode(result.token);
        setAuth({
          isAuthenticated: true,
          user: decoded.email,
          role: decoded.role,
        });
        setIsLoggedIn(true);
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <>
      <div style={{ border: "1px solid #e4e6eb", marginBottom: "40px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="login-form">
              <h2>Login</h2>
              <hr />
              <form onSubmit={handleSubmit(handleLogin)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-box">
                      <label>Email Address</label>
                      <div className="input-text-block">
                        <input
                          type="text"
                          name="email"
                          placeholder="Please Enter Your Email"
                          {...register("email")}
                          className={errors.email ? "input-error" : ""}
                        />
                      </div>
                      {errors.email && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="input-box">
                      <label>Password</label>
                      <div className="input-text-block">
                        <input
                          type="password"
                          name="password"
                          placeholder="Please Enter Your Password"
                          {...register("password")}
                          className={errors.password ? "input-error" : ""}
                        />
                      </div>
                      {errors.password && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="signup-provider">
                      <button
                        type="button"
                        // onClick={async () => {
                        //   loginWithPopup({
                        //     connection: "google-oauth2",
                        //   });
                        // }}
                        onClick={() => loginWithRedirect()}
                        style={{
                          border: "1px solid #eceef3",
                          padding: "12px 20px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <img src={google} alt="" />
                        <span className="btn-text">Login with Google</span>
                      </button>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                  <div className="d-flex justify-content-between align-items-center mb-3 mb-md-0">
                    <button className="input-btn" type="submit">
                      <span>Login</span>
                    </button>
                    <button className="input-btn ms-3 ">
                      <Link
                        to={"/signup"}
                        style={{
                          textDecoration: "none",
                          color: "#323232",
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        <span>Create An Account</span>
                      </Link>
                    </button>
                  </div>
                  <Link
                    to={"/forgot-password"}
                    className="redirect-link"
                    style={{ fontSize: "14px", fontWeight: "400" }}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginTop: "138px" }}></div>

      <Footer />

      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </>
  );
};

export default Login;
