import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Games from "./pages/Games";
import GameDetails from "./pages/GameDetails";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main style={{ minHeight: "80vh", padding: "16px" }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetails />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}