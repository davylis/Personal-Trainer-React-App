import {useState, useEffect} from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import dayjs from "dayjs";
import Snackbar from '@mui/material/Snackbar';
import { fetchTrainings, deleteTraining } from "../ptapi";
import AddTraining from './AddTraining'; 
import Button from "@mui/material/Button";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


function TrainingsList() {
      const [trainings, setTrainings] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [gridApi, setGridApi] = useState(null);

      const [snackbarState, setSnackbarState] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
      });

      const { vertical, horizontal, open } = snackbarState;

      const [colDefs] = useState([
        { field: "activity", 
          headerName: "Activity", 
          filter: true, 
          sortable: true, 
          width: 250 },
        {
          field: "date",
          headerName: "Date",
          filter: true,
          sortable: true,
          width: 300,
          valueFormatter: params => dayjs(params.value).format("DD.MM.YYYY HH:mm")
        },
        { field: "duration", 
          headerName: "Duration (min)", 
          width: 150, 
          filter: true, 
          sortable: true },
        { 
          field: "customer", 
          headerName: "Customer",
          filter: true,
          sortable: true,
          width: 150,
          valueGetter: params => {
            return `${params.data.customer?.firstname} ${params.data.customer?.lastname}`;
          }
        },
        {
          cellRenderer: (params) => (
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleDelete(import.meta.env.VITE_API_URL + "trainings/" + params.data.id)}
                    >
                      <HighlightOffIcon />
                    </Button>
          ),
          width: 120,
        },
      ]);
    
      useEffect(() => { 
        handleFetch() 
      }, []);

      const handleFetch = () => {
          fetchTrainings()
              .then((data) => {
                  setTrainings(data);
              })
              .catch((err) => { 
                setError(err.message);
                console.error("Error fetching trainings:", err);
            })
              .finally(() => setLoading(false));
      };
        console.log("Trainings:", trainings);

        const handleDelete = (url) => {
          if (window.confirm("Are you sure you want to delete?")) {
              deleteTraining(url)
                  .then(() => { 
                  handleFetch();
                  setSnackbarState({ ...snackbarState, open: true });
                  })
                  .catch((error) => {
                      console.error("Error deleting customer: ", error);
                  });
        }
      };
  
      const handleCloseSnackbar = () => {
        //close the snackbar
        setSnackbarState({ ...snackbarState, open: false });
      };

      

      const onGridReady = (params) => {
        setGridApi(params.api);
    };
    
    const onBtnExport = () => {
        if (gridApi) {
            gridApi.exportDataAsCsv();
        } else {
            console.error('Grid API is not set');
        }
    };
    
  
      if (loading) {
        return <div>Loading data...</div>;
      }
    
      if (error) {
        return <div>Error: {error}</div>;
      }
    
  return (
<div className="full-width">
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>    
        <AddTraining handleFetch={handleFetch} />
        <Button
                variant="contained"
                color="primary"
                onClick={onBtnExport}
            >
                Export to CSV
            </Button>
      </div>

    <div className="ag-theme-material" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        rowData={trainings}
        columnDefs={colDefs}
        pagination={true}
        paginationAutoPageSize={true}
        suppressCellFocus={true}
        onGridReady={onGridReady}
      />
    </div>

    <Snackbar
    anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={3000}
      onClose={handleCloseSnackbar}
      message="Training deleted"
    />
    </div>
);
}

export default TrainingsList;