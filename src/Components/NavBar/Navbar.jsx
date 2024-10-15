import React, { useContext, useState, useEffect } from 'react';
import { EdubukContexts } from '../../Context/EdubukContext';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import './navbar.css';
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import Sidebar from '../Sidebar/Sidebar';
import logo from '../../assets/EdubukLogo.png';

const Navbar = () => {
  const { openSidebar, setOpenSidebar, account } = useContext(EdubukContexts);
  const [activeNav, setActiveNav] = useState("Home");
  const location = useLocation(); // Get the current URL

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const navData = [
    { name: "Home", path: "/" },
    { name: "Issuer", path: "/issuer" },
    { name: "Verifier", path: "/verifier" },
    { name: "Holder", path: "/holder" },
    { name: "Finder", path: "/finder" },
    { name: "Admin", path: "/admin" },
  ];


  useEffect(() => {
    const currentPath = location.pathname;
    const activeRoute = navData.find((nav) => nav.path === currentPath);
    
    if (activeRoute) {
      setActiveNav(activeRoute.name);
    }
  }, [location.pathname]); 

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className='header-container'>
        <div className='nav-logo'>
          <img src={logo} alt='logo' />
          {windowDimensions?.width >= 768 ? (
            <nav>
              {navData.map((data, i) => (
                <Link
                  key={i}
                  to={data.path}
                  onClick={() => setActiveNav(data.name)}
                  className={activeNav === data.name ? "navActive" : ""}
                >
                  {data.name}
                </Link>
              ))}
              <div className='animation start-home'></div>
            </nav>
          ) : !openSidebar ? (
            <GiHamburgerMenu className='menu-btn' onClick={() => setOpenSidebar(true)} />
          ) : (
            <MdClose className='menu-btn' onClick={() => setOpenSidebar(false)} />
          )}
        </div>
        <div className='account-info'>
          <p>Connected With : <span>{account?.slice(0, 12)}...</span></p>
        </div>
      </div>
      {openSidebar && <Sidebar navData={navData} />}
    </>
  );
};

export default Navbar;
