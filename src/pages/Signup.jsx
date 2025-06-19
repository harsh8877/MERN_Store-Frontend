import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Signup.css";
import { ToastContainer, toast } from "react-toastify";
import goggle from "../images/goggle.jpg";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import signupValidator from "../validators/signupValidator";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";
import { useEffect } from "react";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(signupValidator),
  });

  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const { setAuth, setIsLoggedIn } = useContext(AuthContext);

  const onSubmit = async (data) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("Signup successful");
      navigate("/login");
    } else {
      toast.error(result.message || "An Error Occurred.");
    }
  };

  useEffect(() => {
    const saveGoogleUser = async (user) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/save-google-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              picture: user.picture,
              sub: user.sub,
            }),
          }
        );

        const result = await res.json();
        if (res.ok) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("email", user.email);

          setAuth({
            isAuthenticated: true,
            user: user.email,
            role: result.role || "user",
          });

          setIsLoggedIn(true);
          toast.success("Google Sign-up successful");
          navigate("/dashboard/accountdetails");
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        console.error("Error saving Google user : ", err);
        toast.error("Something went wrong during Google Sign-up");
      }
    };

    if (isAuthenticated && user) {
      saveGoogleUser(user);
    }
  }, [isAuthenticated, user, setAuth, setIsLoggedIn, navigate]);

  return (
    <>
      {/* <Main_Navbar /> */}

      <div style={{ border: "1px solid #e4e6eb", marginBottom: "10px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="login-form">
              <h2>Sign Up</h2>
              <hr />
              <form onSubmit={handleSubmit(onSubmit)}>
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
                      <label>First Name</label>
                      <div className="input-text-block">
                        <input
                          type="text"
                          name="fname"
                          placeholder="Please Enter Your First Name"
                          {...register("fname")}
                          className={errors.fname ? "input-error" : ""}
                        />
                      </div>
                      {errors.fname && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {errors.fname.message}
                        </p>
                      )}
                    </div>
                    <div className="input-box">
                      <label>Last Name</label>
                      <div className="input-text-block">
                        <input
                          type="text"
                          name="lname"
                          placeholder="Please Enter Your Last Name"
                          {...register("lname")}
                          className={errors.lname ? "input-error" : ""}
                        />
                      </div>
                      {errors.lname && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {errors.lname.message}
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
                    <div className="input-box">
                      <label>Role</label>
                      <div className="input-text-block">
                        <select
                          name="role"
                          {...register("role")}
                          className={errors.role ? "input-error" : ""}
                        >
                          <option value="">Select a role</option>
                          <option value="admin">Admin</option>
                          <option value="merchant">Merchant</option>
                          <option value="member">Member</option>
                        </select>
                      </div>
                      {errors.role && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="signup-provider">
                      <button
                        type="button"
                        onClick={() =>
                          loginWithRedirect({ connection: "google-oauth2" })
                        }
                        style={{
                          border: "1px solid #eceef3",
                          padding: "12px 20px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <img src={goggle} alt="" />
                        <span style={{ marginLeft: "5px" }}>
                          Sign up with Google
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <hr />
                <div className="checkbox default-icon">
                  <input type="checkbox" className="input-checkox" />
                  <label className="ms-2">Subscribe to newsletter</label>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                  <button className="input-btn">
                    <span>Sign Up</span>
                  </button>
                  <Link
                    to={"/login"}
                    className="redirect-link"
                    style={{ fontSize: "14px" }}
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginBottom: "40px" }}></div>

      <Footer />

      {/* <ToastContainer position="top-right" autoClose={5000} /> */}
    </>
  );
};

export default Signup;
