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
    
      useEffect(() => {
        handleFetch();
      }, []);

      console.log("Trainings:", trainings);

      const handleFetch = () => {
        fetchTrainings()
          .then(data => setTrainings(data._embedded.trainings))
          .catch(err => console.error("Error fetching trainings:", err));
      };


    
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