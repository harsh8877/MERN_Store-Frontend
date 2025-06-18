import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";
import Footer from "../components/Footer";
import Panelsidebar from "./Panelsidebar";

const Dashboard = () => {
  const { auth } = useContext(AuthContext);

  if (auth.isLoading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      {/* <Main_Navbar /> */}
      <div style={{ border: "1px solid #e4e6eb", marginBottom: "20px" }}></div>

      <main>
        <div className="container">
          <div className="wrapper">
            <div className="admin row">
              <div className="col-12 col-md-5 col-xl-3">
                <Panelsidebar />
              </div>
              <div className="col-12 col-md-7 col-xl-9">
                <Outlet /> {/* 👈 This will render child routes */}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div style={{ border: "1px solid #e4e6eb", marginTop: "20px" }}></div>
      <Footer />
    </>
  );
};

export default Dashboard;
