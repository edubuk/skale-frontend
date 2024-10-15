import "./App.css";
import NavBar from "./Components/NavBar/Navbar";
import { Route, Routes } from "react-router-dom";
import  {Home, Admin, Institute,Holder}  from "./Components/index";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Verifier from "./Components/Verifier/Verifier";
import Finder from "./Components/CredentialFinder/Finder";
function App() {

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
  }
})
  return (
    <>
    <div><Toaster position="top-right"/></div>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/issuer" element={<Institute />} />
        <Route path="/holder" element={<Holder />} />
        <Route path="/verifier" element={<Verifier />} />
        <Route path="/finder" element={<Finder/>} />
      </Routes>
    </>
  );
}

export default App;
