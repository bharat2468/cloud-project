import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ModernLogin from "./pages/ModernLogin";
import ModernProductInfo from "./pages/ModernProductInfo";
import ModernRegister from "./pages/ModernRegister";
import ModernHome from "./pages/ModernHome";
import ModernCart from "./pages/ModernCart";
import ModernProfile from "./pages/ModernProfile";
import ModernCheckout from "./pages/ModernCheckout";
import ModernNavBar from "./components/ModernNavBar";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import "./utils/debug"; // Load debug utilities

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-base-100 flex flex-col">
          <ModernNavBar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<ModernHome />} />
              <Route path="/login" element={<ModernLogin />} />
              <Route path="/register" element={<ModernRegister />} />
              <Route path="/product-info" element={<ModernProductInfo />} />
              <Route path="/cart" element={<ModernCart />} />
              <Route path="/profile" element={<ModernProfile />} />
              <Route path="/checkout" element={<ModernCheckout />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
