import React from 'react';
import Button from '@mui/material/Button';

function TrainingsList() {

    const handleClickOpen = () => {
        setOpen(true);
      };
    
  return (
    <>
  <Button variant="outlined" onClick={handleClickOpen}>
  Add Training
</Button>
</>
);
}

export default TrainingsList;