import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import { saveTraining, fetchCustomers } from "../ptapi";

AddTraining.propTypes = {
  handleFetch: PropTypes.func.isRequired, //validate that handleFetch is a required function
};

function AddTraining(props) {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [training, setTraining] = useState({
    activity: "",
    date: dayjs().toISOString(),
    duration: "",
    customer: "",
  });

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = () => {
    fetchCustomers()
      .then((data) => {
        console.log("Fetched customer data:", data);
        setCustomers(data._embedded.customers);
      })
      .catch((err) => console.error("Error fetching data: ", err));
  };

  const handleClickOpen = () => {
    setTraining({
      activity: "",
      date: dayjs().toISOString(), //reset to current date
      duration: "",
      customer: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    //console.log("Training payload:", training);
    saveTraining(training)
      .then(() => {
        props.handleFetch();
        handleClose();
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (event) => {
    setTraining({ ...training, [event.target.name]: event.target.value });
  };

  const handleDateChange = (date) => {
    setTraining({ ...training, date: date ? date.toISOString() : null });
  };

  return (
    <>
      <Button
        startIcon={<SportsGymnasticsIcon />}
        variant="contained"
        sx={{
          backgroundColor: "#ffb061",
          color: "white",
          "&:hover": { backgroundColor: "#e67612" },
        }}
        onClick={handleClickOpen}
      >
        Add Training
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Training</DialogTitle>
        <DialogContent>
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date - Time"
              value={training.date ? dayjs(training.date) : dayjs()}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
            />
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
            select
            margin="dense"
            name="customer"
            label="Customer"
            value={training.customer || ""}
            onChange={handleChange}
            fullWidth
            variant="standard"
          >
            {customers.map((customer) => (
              <MenuItem
                key={customer._links.self.href}
                value={customer._links.self.href}
              >
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
