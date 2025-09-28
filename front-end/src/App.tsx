import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ModernLogin from "./pages/ModernLogin";
import ModernProductInfo from "./pages/ModernProductInfo";
import ModernRegister from "./pages/ModernRegister";
import ModernHome from "./pages/ModernHome";
import ModernCart from "./pages/ModernCart";
// import CheckOut from "./pages/CheckOut";
import ModernNavBar from "./components/ModernNavBar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-100">
        <ModernNavBar />
        <Routes>
          <Route index path="/" element={<ModernHome />} />
          <Route path="/register" element={<ModernRegister />} />
          <Route path="/login" element={<ModernLogin />} />
          <Route path="/product-info" element={<ModernProductInfo />} />
          <Route path="/cart" element={<ModernCart />} />
          {/* <Route path="/checkout" element={<CheckOut />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
export default App;
