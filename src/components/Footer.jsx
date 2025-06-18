import React from "react";
import "./Footer.css";
import instagram from "../images/instagram.jpg";
import facebook from "../images/facebook.jpg";
import twitter from "../images/twitter.jpg";
import pinterest from "../images/pinterest.jpg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-block">
              <div className="block-title">
                <h3 className="text-uppercase">Customer Service</h3>
              </div>
              <div className="block-content">
                <ul>
                  <li className="footer-link">
                    <Link to={"/contactus"}>Contact Us</Link>
                  </li>
                  <li className="footer-link">
                    <Link to={"/seller"}>Sell With Us</Link>
                  </li>
                  <li className="footer-link">
                    <Link to={"/shipping"}>Shipping</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-block">
              <div className="block-title">
                <h3 className="text-uppercase">Links</h3>
              </div>
              <div className="block-content">
                <ul>
                  <li className="footer-link">
                    <Link to={"/contactus"}>Contact Us</Link>
                  </li>
                  <li className="footer-link">
                    <Link to={"/seller"}>Sell With Us</Link>
                  </li>
                  <li className="footer-link">
                    <Link to={"/shipping"}>Shipping</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-block">
              <div className="block-title">
                <h3 className="text-uppercase">Newsletter</h3>
              </div>
              <div className="newsletter-form">
                <p>Sign Up for Our Newsletter</p>
                <form>
                  <div className="subscribe">
                    <div className="input-text-block">
                      <input
                        type="text"
                        placeholder="Please Enter Your Email"
                      />
                      <button className="input-btn custom-btn-primary md text-only icon-left ">
                        <span>Subscribe</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <span>@ 2025 MERN Store</span>
          </div>
          <ul className="footer-social-item">
            <li>
              <a href="">
                <img src={facebook} alt="" />
              </a>
            </li>
            <li>
              <a href="">
                <img src={instagram} alt="" />
              </a>
            </li>
            <li>
              <a href="">
                <img src={pinterest} alt="" />
              </a>
            </li>
            <li>
              <a href="">
                <img src={twitter} alt="" />
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
