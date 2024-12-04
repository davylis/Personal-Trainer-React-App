import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Snackbar from "@mui/material/Snackbar";
import { Box, Typography } from "@mui/material";
import { fetchTrainings } from "../ptapi"; // Assuming this function fetches training data

const localizer = momentLocalizer(moment);

function CalendarList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  //color mapping for activities
  const activityColors = {
    Default: "#ffb061",
  };

  //fetch calendar data and transform it to event format
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const trainings = await fetchTrainings();
        const formattedEvents = trainings.map((training) => ({
          title: `${training.activity} - ${training.customer.firstname} ${training.customer.lastname}`,
          start: new Date(training.date),
          end: new Date(
            new Date(training.date).getTime() + training.duration * 60000
          ),
          customer: `${training.customer.firstname} ${training.customer.lastname}`,
          description: `Training with ${training.customer.firstname} ${training.customer.lastname}`,
          activity: training.activity, // Adding the activity to the event for styling
        }));
        setEvents(formattedEvents);
      } catch (err) {
        setError(err.message);
        setOpenSnackbar(true); 
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ width: "100%", marginTop: 0 }}>
      <Box sx={{ padding: 2 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 2, color: "#9a8774" }}
        >
          Training Calendar
        </Typography>
      </Box>

      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: 2,
          padding: 2,
          marginTop: 2,
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={(event) => {
            const activityColor =
              activityColors[event.activity] || activityColors.Default;
            return {
              style: {
                backgroundColor: activityColor, 
                color: "#fff",
              },
            };
          }}
        />
      </Box>

      <Snackbar
        open={openSnackbar}
        message="Failed to fetch training data."
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default CalendarList;
