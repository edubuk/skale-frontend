import React, { useEffect, useState } from "react";
import "./preloader.css";

const Preloader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress increment
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 10; // Increment by 10%
        if (newProgress >= 100) clearInterval(interval); // Stop at 100%
        return newProgress;
      });
    }, 100); // Adjust speed of loading

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="preloader-container">
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="progress-text">{progress}%</div>
    </div>
  );
};

export default Preloader;
