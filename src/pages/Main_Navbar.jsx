import React, { useEffect, useState } from "react";
import "./Main_Navbar.css";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/SearchContext";
import { useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";
import { useCart } from "../hooks/CartContext";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";

const Main_Navbar = () => {
  const { setAuth, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  console.log("isLoggedIn : ", isLoggedIn);
  const [showBrandDropdown, setShopBrandDropdown] = useState(false);

  const navigate = useNavigate();

  const { logout, isAuthenticated, user } = useAuth0();
  const { cartItems } = useCart();
  const {
    searchTerm,
    setSearchTerm,
    brandFilter,
    setBrandFilter,
    categoryFilter,
    setCategoryFilter,
  } = useSearch();

  // After login with Google, automatically save user data
  useEffect(() => {
    const saveGoogleUser = async (user) => {
      try {
        const res = await fetch("http://localhost:5000/api/save-google-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            password: user.password,
            picture: user.picture,
            sub: user.sub,
          }),
        });

        const result = await res.json();
        console.log("Backend response : ", result);
        if (res.ok) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("email", user.email);
          console.log("User saved to DB:", result);

          setAuth({
            isAuthenticated: true,
            user: user.email,
            role: result.role || "user",
            isLoading: false,
          });
          setIsLoggedIn(true);
          // toast.success("Google Login successful");
          // navigate("/dashboard/accountdetails");
        } else {
          console.error("Failed to save user:", result.message);
          toast.error(result.message);
        }
      } catch (err) {
        console.error("Error saving Google user:", err);
        toast.error("Something went wrong while saving Google user");
      }
    };

    if (isAuthenticated && user) {
      saveGoogleUser(user);
    }
  }, [isAuthenticated, user, setAuth, setIsLoggedIn]);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);

    setAuth({
      isAuthenticated: false,
      user: null,
      role: null,
    });

    logout({ returnTo: window.location.origin });
    // navigate("/login");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // console.log(searchTerm);
  };

  const handleBrandFilter = (brand, e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setBrandFilter(brand);
    setShopBrandDropdown(false); // Close the dropdown after selection
    navigate(`/shop?brand=${brand}`);
  };

  const handleCategoryFilter = (category, e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setCategoryFilter(category);
    handleClose();
    navigate(`/shop?category=${category}`);
  };

  const clearBrandFilter = () => {
    setBrandFilter(""); // Clear the brand filter
    setCategoryFilter(""); // Clear the category filter
  };

  return (
    <>
      <header>
        <div className="header-info">
          <div className="container">
            <div className="row">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-center col-md-4">
                  <i className="fa-solid fa-truck"></i>
                  <span>Free Shipping</span>
                </div>
                <div className="text-center col-md-4">
                  <i className="fa-regular fa-credit-card"></i>
                  <span>Payment Methods</span>
                </div>
                <div className="text-center col-md-4">
                  <i className="fa-solid fa-phone"></i>
                  <span>Call us 951-999-9999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container p-3">
          <div className="d-flex align-items-center row">
            <div className="brand d-flex align-items-center col-md-3">
              <i
                className="fa-solid fa-bars"
                onClick={handleShow}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#ccc",
                  marginTop: "3px",
                }}
              ></i>
              <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title></Offcanvas.Title>
                </Offcanvas.Header>
                <hr />
                <Offcanvas.Body>
                  <h6 style={{ marginLeft: "16px", fontSize: "16px" }}>
                    SHOP BY CATEGORY
                  </h6>
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        aria-current="page"
                        href="#"
                        onClick={(e) =>
                          handleCategoryFilter("Oversized T-Shirts", e)
                        }
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Oversized T-Shirts
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) => handleCategoryFilter("Topware", e)}
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Topware
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) =>
                          handleCategoryFilter("Men's Clothing", e)
                        }
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Men's Clothing
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) => handleCategoryFilter("Casual Wear", e)}
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Casual Wear
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) =>
                          handleCategoryFilter("Women's Clothing", e)
                        }
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Women's Clothing
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) => handleCategoryFilter("Sportswear", e)}
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Sportswear
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) =>
                          handleCategoryFilter("Undergarments", e)
                        }
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Urdergarments
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) => handleCategoryFilter("Accessories", e)}
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Accessories
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) =>
                          handleCategoryFilter("Kid's Clothing", e)
                        }
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Kid's Clothing
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) => handleCategoryFilter("Outerwear", e)}
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Outerwear
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) => handleCategoryFilter("Formal Wear", e)}
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Formal Wear
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        onClick={(e) => handleCategoryFilter("Footwear", e)}
                        style={{ color: "#323232", fontSize: "14px" }}
                      >
                        Footwear
                      </a>
                    </li>
                  </ul>
                </Offcanvas.Body>
              </Offcanvas>
              <Link
                to={"/"}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#323232",
                  textDecoration: "none",
                  marginLeft: "15px",
                }}
              >
                MERN Store
              </Link>
            </div>
            <div className="search-box col-md-5">
              <input
                type="text"
                placeholder="Search Products"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="d-flex justify-content-end align-items-center col-md-4">
              <nav className="navbar navbar-expand-md navbar-light bg-light d-flex justify-content-around align-items-center gap-3">
                <div
                  className="bag-icon"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#bagOffcanvas"
                  aria-controls="bagOffcanvas"
                  backdrop="true"
                  style={{ position: "relative" }}
                >
                  <i
                    className="fa-solid fa-bag-shopping"
                    style={{ fontSize: "20px", margin: "0px" }}
                  ></i>
                  {cartItems.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                      style={{
                        fontSize: "10px",
                        // marginLeft: "-238px",
                        // marginTop: "16px",
                      }}
                    >
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <ul className="navbar-nav d-flex flex-row align-items-center gap-3 mb-0">
                  <li className="nav-item">
                    <Dropdown
                      show={showBrandDropdown}
                      onToggle={(isOpen) => setShopBrandDropdown(isOpen)}
                    >
                      <Dropdown.Toggle
                        variant="null"
                        id="dropdown-basic"
                        style={{ color: "#65676B" }}
                      >
                        Brands
                      </Dropdown.Toggle>

                      <Dropdown.Menu
                        className="dropdown-left"
                        // style={{ border: "none" }}
                      >
                        <div className="mini-brand">
                          <div className="mini-brand-list">
                            <div className="mini-brand-title">
                              <h3 className="mini-brand-heading">
                                Shop By Brand
                              </h3>
                              <Link
                                to="/brands"
                                style={{
                                  fontSize: "14px",
                                  color: "#2962ff",
                                  textDecoration: "none",
                                }}
                              >
                                See All
                              </Link>
                            </div>
                            <div
                              style={{
                                border: "1px solid #eceef3",
                                marginTop: "10px",
                                marginBottom: "20px",
                              }}
                            ></div>

                            <div className="mini-brand-block">
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("Elegant Attire", e)
                                  }
                                >
                                  Elegant Attire
                                </a>
                              </div>
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("Style Sanctuary", e)
                                  }
                                >
                                  Style Sanctuary
                                </a>
                              </div>
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("Trendsetter's Hub", e)
                                  }
                                >
                                  Trendsetter's Hub
                                </a>
                              </div>
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("Vogue Vista", e)
                                  }
                                >
                                  Vogue Vista
                                </a>
                              </div>
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("Trendy Junction", e)
                                  }
                                >
                                  Trendy Junction
                                </a>
                              </div>
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("Chic Haven", e)
                                  }
                                >
                                  Chic Haven
                                </a>
                              </div>
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("The Souled Store", e)
                                  }
                                >
                                  The Souled Store
                                </a>
                              </div>
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("Modish Mania", e)
                                  }
                                >
                                  Modish Mania
                                </a>
                              </div>
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("Fashion Fusion", e)
                                  }
                                >
                                  Fashion Fusion
                                </a>
                              </div>
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("Fashionista's Den", e)
                                  }
                                >
                                  Fashionista's Den
                                </a>
                              </div>
                              <div className="mini-brand-item">
                                <a
                                  href=""
                                  className="mini-brand-link"
                                  onClick={(e) =>
                                    handleBrandFilter("Urban Threads", e)
                                  }
                                >
                                  Urban Threads
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <Dropdown.Item href="#/brand">Brand</Dropdown.Item> */}
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={"/shop"}
                      onClick={clearBrandFilter}
                      style={{
                        color: "#65676B",
                        fontSize: "16px",
                        textDecoration: "none",
                      }}
                    >
                      Shop
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="null"
                        id="dropdown-basic"
                        style={{ color: "#65676B" }}
                      >
                        {isLoggedIn ? "Admin" : "Welcome!"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {isLoggedIn ? (
                          <>
                            <Dropdown.Item as={"div"}>
                              <Link
                                to="/dashboard/accountdetails"
                                style={{
                                  textDecoration: "none",
                                  color: "#24292e",
                                }}
                              >
                                Dashboard
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={handleSignOut}
                              as={"div"}
                              style={{ cursor: "pointer" }}
                            >
                              Sign Out
                            </Dropdown.Item>
                          </>
                        ) : (
                          <>
                            <Dropdown.Item as={"div"}>
                              <Link
                                to={"/login"}
                                style={{
                                  textDecoration: "none",
                                  color: "#24292e",
                                }}
                              >
                                Login
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item as={"div"}>
                              <Link
                                to={"/signup"}
                                style={{
                                  textDecoration: "none",
                                  color: "#24292e",
                                }}
                              >
                                Sign Up
                              </Link>
                            </Dropdown.Item>
                          </>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Main_Navbar;
