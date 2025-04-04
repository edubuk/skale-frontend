import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';
import { EdubukContexts } from '../../Context/EdubukContext';
import logo from '../../assets/newlogo.jpg'
const Sidebar = ({navData}) => {
  const {openSidebar, setOpenSidebar} = useContext(EdubukContexts);


  return (
    <div>
      <div className={`sidebar ${openSidebar ? 'open' : ''}`}>
      <img src={logo} alt='logo '></img>
      <div className='sidebar-link-section'>
          {navData?.map((link, index) => (
            <div key={index} className='side-link'>
              <Link to={link.path} onClick={()=>setOpenSidebar(false)}>
                {link.name}
              </Link>
            </div>
          ))}
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
