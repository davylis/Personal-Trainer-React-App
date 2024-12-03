import { useState, useEffect } from 'react'; // Import useState and useEffect
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar
import { fetchTrainings } from '../ptapi';

const localizer = momentLocalizer(moment);

function CalendarList() {
  const [events, setEvents] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchCalendarData = () => {
      fetchTrainings()
      .then((trainings) => {
        const formattedEvents = trainings.map((training) => {
          return {
            title: `${training.activity} - ${training.customer.firstname} ${training.customer.lastname}`,
            start: new Date(training.date),
            end: new Date(new Date(training.date).getTime() + training.duration * 60000),
            customer: `${training.customer?.firstname} ${training.customer?.lastname}`.trim(),
            description: `Training with ${training.customer?.firstname} ${training.customer?.lastname}`.trim(),
          };
        });
        setEvents(formattedEvents);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
    <div>
      <Calendar
        localizer={localizer}
        events={events} 
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.activity === 'Yoga' ? '#ff8fab' : '#3f51b5', // Set color based on activity type (example)
            color: '#fff', // White text color for better visibility
          },
        })}
      />
      {/* Snackbar for error handling */}
      <Snackbar
        open={openSnackbar}
        message="Failed to fetch training data."
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      />
    </div>
  );
}

export default CalendarList;