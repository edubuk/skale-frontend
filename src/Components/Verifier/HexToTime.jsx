import React from 'react';

const HexToDateTime = ({ hexValue }) => {
  // Step 1: Convert hex to decimal
  const decimalValue = parseInt(hexValue, 16);

  // Step 2: Convert decimal to a date
  const date = new Date(decimalValue * 1000);

  // Step 3: Extract and format the date and time components
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return (
      <span>{`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`}</span>
  );
};

export default HexToDateTime;
