 import React from 'react';

    const ProgressBar = ({ completed, color = 'blue', height = '20px' }) => {
      const fillerStyles = {
        height: height,
        width: `${completed}%`,
        backgroundColor: color,
        borderRadius: 'inherit',
        textAlign: 'right',
        transition: 'width 0.5s ease-in-out', // Optional: for smooth animation
      };

      const containerStyles = {
        height: height,
        width: '100%',
        backgroundColor: '#e0e0de',
        borderRadius: '50px',
        overflow: 'hidden', // Ensures filler stays within bounds
      };

      return (
        <div style={containerStyles}>
          <div style={fillerStyles}>
            <span style={{ padding: '5px', color: 'white', fontWeight: 'bold' }}>
              {`${completed}%`}
            </span>
          </div>
        </div>
      );
    };

    export default ProgressBar;