import {useState, useEffect} from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import dayjs from "dayjs";
import Snackbar from '@mui/material/Snackbar';
import { fetchTrainings } from "../ptapi";

function TrainingsList() {
      const [trainings, setTrainings] = useState([]);
      const [open, setOpen] = useState(false);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [colDefs] = useState([
        { field: "activity", headerName: "Activity", filter: true, sortable: true, width: 250 },
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
          filte: true, 
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
      ]);
    
      useEffect(() => { handleFetchTraining() }, []);

      const handleFetchTraining = () => {
        fetchTrainings()
            .then(data => {
                setTrainings(data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };
      console.log("Trainings:", trainings);
  
      if (loading) {
        return <div>Loading data...</div>;
      }
    
      if (error) {
        return <div>Error: {error}</div>;
      }
    
  return (

<>
    <div className="ag-theme-material" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        rowData={trainings}
        columnDefs={colDefs}
        pagination={true}
        paginationAutoPageSize={true}
        suppressCellFocus={true}
      />
    </div>

    <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message="Training deleted"
            />
    </>
);
}

export default TrainingsList;