import React, { useContext, useState, useEffect } from 'react';
import { EdubukContexts } from '../../Context/EdubukContext';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import './navbar.css';
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose, MdOutlineCheckCircle } from "react-icons/md";
import Sidebar from '../Sidebar/Sidebar';
import logo from '../../assets/newlogo.jpg';
import { connectWallet } from '../../Utils/apiFeature';
import WalletInfo from '../WalletInfo/WalletInfo';

const Navbar = () => {
  const { openSidebar, setOpenSidebar, setAccount, account, chainId } = useContext(EdubukContexts);
  const [activeNav, setActiveNav] = useState("Home");
  const [showWalletInfo, setShowWalletInfo] = useState(false);
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

  const walletConnectHandler = async () => {
    const connectedAccount = await connectWallet();
    setAccount(connectedAccount);
  }


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
        {!account &&
          <button onClick={walletConnectHandler}>Connect Wallet</button>
        }
        {account &&
          <button id="connected-icon" onClick={() => setShowWalletInfo(!showWalletInfo)}><MdOutlineCheckCircle id='icon' /> <span id='account-num'>{account?.substring(0, 6)}...{account?.substring(account?.length - 5)}</span></button>
        }
        {
          showWalletInfo && <WalletInfo showWalletInfo={showWalletInfo} setShowWalletInfo={setShowWalletInfo} />
        }
      </div>
      {openSidebar && <Sidebar navData={navData} />}
    </>
  );
};

export default Navbar;
