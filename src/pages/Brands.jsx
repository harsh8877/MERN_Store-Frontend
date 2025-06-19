import React from "react";
import "./Brands.css";
import Main_Navbar from "../pages/Main_Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/SearchContext";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const { brandFilter, setBrandFilter } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/getbrand`,
          {
            brand: brandFilter,
          }
        );
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands : ", error);
      }
    };
    fetchBrands();
  }, []);

  const handleBrandClick = (brand) => {
    setBrandFilter(brand);
    navigate(`/shop?brand=${brand}`);
  };

  return (
    <>
      <Main_Navbar />

      <div style={{ border: "1px solid #e4e6eb", marginBottom: "20px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="brands-page">
              <div className="brands-list">
                <h3 className="brands-list-text">Shop By Brand</h3>
                <div className="brands-list-line"></div>
                <div className="flex-sm-row row">
                  {brands.map((brand) => (
                    <div
                      key={brand._id}
                      className="mb-3 px-2 col-6 col-md-4 col-lg-3"
                      onClick={() => handleBrandClick(brand.name)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="brands-box">
                        <h5 className="brands-list-text-1">{brand.name}</h5>
                        <p className="brands-list-description-1">
                          {brand.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginTop: "50px" }}></div>

      <Footer />
    </>
  );
};

export default Brands;
