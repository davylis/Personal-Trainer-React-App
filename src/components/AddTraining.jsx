import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { saveTraining, fetchCustomers } from "../ptapi";

AddTraining.propTypes = {
    handleFetch: PropTypes.func.isRequired, // Validate that handleFetch is a required function
  };

function AddTraining(props) {

    const [open, setOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [training, setTraining] = useState({
        activity: "",
        date: "",
        duration: "",
        customer: "",
    });

    useEffect(() => { handleFetch() }, []);

    const handleFetch = () => {
        fetchCustomers()
            .then(data => {
                setCustomers(data._embedded.customers);
            })
            .catch(err => console.error("Error fetching data: ", err));
    };

    const handleClickOpen = () => {
        setTraining({});
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const handleChange = (event) => {
        setTraining({ ...training, [event.target.name]: event.target.value });
      };
      const handleSave = () => {
        saveTraining(training)
          .then(() => {
            props.handleFetch();
            handleClose();
          })
          .catch((err) => console.error(err));
      };

    const handleDateChange = (date) => {
        setTraining({ ...training, date: date ? date.toISOString() : null });
    };

      return (
        <>
          <Button variant="outlined" onClick={handleClickOpen} style={{ zIndex: 10, position: 'relative' }}>
            Add Training
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Training</DialogTitle>
            <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
            label="Date - Time"
            value={training.date ? dayjs(training.date) : dayjs()}
            onChange={handleDateChange}
            format="DD/MM/YYYY" />
            </LocalizationProvider>
              <TextField
                margin="dense"
                name="activity"
                label="Activity"
                value={training.activity}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                name="duration"
                label="Duration (min)"
                type="number"
                value={training.duration}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
               <TextField
                margin="dense"
                name="customer"
                label="Customer"
                value={training.customer || ''}
                onChange={handleChange}
                fullWidth
                variant="standard"
              > 
              {Array.isArray(customers) && customers.map((customer) => (
                <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                    {customer.firstname} {customer.lastname}
                </MenuItem>
            ))}
        </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </Dialog>
        </>
      );
}
export default AddTraining;