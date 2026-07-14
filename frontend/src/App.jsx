import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddProduct from "./pages/AddProduct";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";
import Notifications from "./pages/Notifications";

// NEW PAGES
import MyOffers from "./pages/MyOffers";
import ReceivedOffers from "./pages/ReceivedOffers";
import MyWishlist from "./pages/MyWishlist";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-products"
          element={
            <ProtectedRoute>
              <MyProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-product/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        {/* NEW ROUTE */}
        <Route
          path="/my-offers"
          element={
            <ProtectedRoute>
              <MyOffers />
            </ProtectedRoute>
          }
        />

        {/* NEW ROUTE */}
        <Route
          path="/received-offers"
          element={
            <ProtectedRoute>
              <ReceivedOffers />
            </ProtectedRoute>
          }
        />
        <Route
           path="/wishlist"
           element={
             <ProtectedRoute>
             <MyWishlist />
             </ProtectedRoute>
            }
          />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/notifications"
          element={
        <ProtectedRoute>
         <Notifications />
        </ProtectedRoute>
      }
      />
      </Routes>
      
    </>
  );
}

export default App;