import { useState, useEffect } from "react";
import Customerlist from "./components/Customerlist";
import TrainingsList from "./components/TrainingsList";
import CalendarList from "./components/CalendarList";
import StatisticsList from "./components/StatisticsList";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from '@mui/material/MenuItem';
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

function App() {
  //state to handle menu
  const [anchorEl, setAnchorEl] = useState(null);
  //navigation hook
  const navigate = useNavigate();
  //hook to get current path
  const location = useLocation();

  //handle menu open
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor element to open the menu
  };

  //handle menu close
  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  return (
    <Container maxwidth="xl">
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Personal Trainer App</Typography>
        </Toolbar>
      </AppBar>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          selected={location.pathname === "/customers"}
          onClick={() => {
            navigate("/customers");
            handleClose();
          }}
          component={Link}
          to="/customers"
        >
          Customers
        </MenuItem>
        <MenuItem
          selected={location.pathname === "/trainings"}
          onClick={() => {
            navigate("/trainings");
            handleClose();
          }}
          component={Link}
          to="/trainings"
        >
          Trainings
        </MenuItem>
        <MenuItem
          selected={location.pathname === "/calendar"}
          onClick={() => {
            navigate("/calendar");
            handleClose();
          }}
          component={Link}
          to="/calendar"
        >
          Calendar
        </MenuItem>
        <MenuItem
          selected={location.pathname === "/statistics"}
          onClick={() => {
            navigate("/statistics");
            handleClose();
          }}
          component={Link}
          to="/statistics"
        >
          Statistics
        </MenuItem>
      </Menu>
      <Routes>
        <Route path="/customers" element={<Customerlist />} />
        <Route path="/trainings" element={<TrainingsList/>} />
        <Route path="/calendar" element={<CalendarList/>} />
        <Route path="/statistics" element={<StatisticsList/>} />
        <Route path="/" element={<div>Welcome to the Personal Trainer App</div>} />
      </Routes>
    </Container>
  );
}

export default App;
