import React from 'react';
import Button from '@mui/material/Button';

function ExportData() {
  const handleExport = () => {
    // Placeholder function for data export logic
    console.log("Data exported!");
  };

  return (
    <Button
      variant="outlined" 
      color="primary"
      onClick={handleExport}
      style={{ display: "block", margin: "10px" }}
      >
        Export
      </Button>
  );
}

export default ExportData;