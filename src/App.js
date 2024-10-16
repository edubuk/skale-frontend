import "./App.css";
import NavBar from "./Components/NavBar/Navbar";
import { Route, Routes } from "react-router-dom";
import { Home, Admin, Institute, Holder } from "./Components/index";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Verifier from "./Components/Verifier/Verifier";
import Finder from "./Components/CredentialFinder/Finder";
import Preloader from "./Components/Preloader/Preloader"; // Import the Preloader

function App() {
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
    const timer = setTimeout(() => setLoading(false), 2000); // Adjust timing as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/issuer" element={<Institute />} />
        <Route path="/holder" element={<Holder />} />
        <Route path="/verifier" element={<Verifier />} />
        <Route path="/finder" element={<Finder />} />
      </Routes>
    </>
  );
}

export default App;
