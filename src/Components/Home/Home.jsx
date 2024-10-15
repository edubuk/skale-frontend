import React from 'react';
import { Link } from 'react-router-dom';
import hero from '../../assets/hero.png';
import './home.css';

const Home = () => {
  return (
    <div className='home-wrapper'>
      <div className='home-image-container'>
        <img src={hero} alt="hero" className='home-hero-image' />
      </div>
      <div className='home-content'>
        <h1 className='home-introduction'>INTRODUCING</h1>
        <h1 className='home-title'>EDUBUK</h1>
        <div className='home-description'>
          <p>Digitally Record & Verify Educational Transcripts and Work-Experience Certificates on Blockchain, making the Background Verification Process Significantly Cheaper & Faster.</p>
        </div>
        <div className='home-button-container'>
          <Link to="/issuer" className="home-issue-button">Issue A Credential</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
