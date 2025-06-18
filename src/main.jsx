// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SearchProvider } from "../src/hooks/SearchContext.jsx";
import { Auth0Provider } from "@auth0/auth0-react";
// import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./hooks/AuthContext.jsx";
import { CartProvider } from "../src/hooks/CartContext.jsx";

// const domain = "dev-ehomaxfiiddbqnsx.au.auth0.com";
// const clientId = "c3DNlnBECd074BAtCxZPoy9YInr0odwQ";

// Auth0 Code : 5VECDHS95X1SMC4V2CYQ5J9V

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  // <BrowserRouter>
  <SearchProvider>
    <AuthProvider>
      <Auth0Provider
        domain="dev-ehomaxfiiddbqnsx.au.auth0.com"
        clientId="c3DNlnBECd074BAtCxZPoy9YInr0odwQ"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <CartProvider>
          {/* // Cart Item Add to Bag */}
          <App />
        </CartProvider>
      </Auth0Provider>
    </AuthProvider>
  </SearchProvider>
  // </BrowserRouter>

  // {/* </StrictMode> */}
);
