import { useState, useEffect } from "react";
import PropTypes from 'prop-types'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { updateCustomer } from "../ptapi"

EditCustomer.propTypes = {
    handleFetch: PropTypes.func
};

export default function EditCustomer(props) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState({
    firstname: "",
    lastname: "",
    phone: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
    console.log(props.data);
    setCustomer({
      firstname: props.data.firstname,
      lastname: props.data.lastname,
      phone: props.data.phone,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  //For saving information to the right field
  const handleChange = (event) => {
    setCustomer({ ...customer, [event.target.name]: event.target.value });
  };

  const handleSave = () => {
    updateCustomer(props.data._links.customer.href, customer)
      .then(() => {
        props.handleFetch();
        handleClose();
      })
      .catchError((err) => console.error(err));
  };

  return (
    <>
      <Button size="small" onClick={handleClickOpen}>
        Edit customer
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="firstname"
            label="Firstname"
            value={customer.firstname}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="lastname"
            label="Lastname"
            value={customer.lastname}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            value={customer.phone}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
