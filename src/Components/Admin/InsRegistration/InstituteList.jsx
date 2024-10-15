import React, { useState } from 'react';
import './institutelist.css'; // Add your custom styles

const InstituteList = ({ instituteList }) => {

  return (
    <div className="institute-list-container">
      <h2 className="title">Registered Institutes</h2>
      {instituteList?.length === 0 ? (
        <p>No institutes registered yet.</p>
      ) : (
        <ul className="institute-list">
          {instituteList?.map((institute, index) => (
            <li key={index} className="institute-item">
              <div className="institute-details">
                <span className="institute-name">{institute[0]}</span>
                <span className="wallet-address">{institute[1].substring(0, 6)}...{institute[1]?.substring(institute[1].length - 4)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InstituteList;
