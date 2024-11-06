import { useState, useEffect } from "react";
import { fetchCustomers, deleteCustomer } from "../ptapi";
import AddCustomer from "./AddCustomer";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import EditCustomer from "./EditCustomer";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function Customerlist() {
  //state variable which holds an array
  const [customers, setCustomers] = useState([]);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const {vertical, horizontal, open} = snackbarState;

  const [colDefs] = useState([
    { field: "firstname", filter: true },
    { field: "lastname", filter: true },
    { field: "phone", filter: true, width: 150 },
    {
        cellRenderer: params => <EditCustomer
        handleFetch = {handleFetch}
        data={params.data} 
        variant="contained"
        color="primary"
        size="small" 
        />, 
      width:120
     },
     {
        headerName: "Actions",
        cellRenderer: params =>  (<Button
            onClick={() => handleDelete(params.data._links.self.href)}
            variant="contained"
            color="secondary"
            size="small"
          >
            Delete
          </Button>
        ),
        width: 120,
    },
  ]);

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = () => {
    fetchCustomers()
      .then((data) => setCustomers(data._embedded.customers))
      .catch((err) => console.error(err));
  };

  const handleDelete = (url) => {
    if (window.confirm("Are you sure?")) {
      deleteCustomer(url)
        .then(() => {
          handleFetch();
          setSnackbarState({ ...snackbarState, open: true });
        })
        .catch((err) => console.error("Error deleting car:", err));
    }
  };

  const handleCloseSnackbar = () => {
    // Close the snackbar
    setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <>
      <AddCustomer handleFetch={handleFetch} />
      <div className="ag-theme-material" style={{ height: 500, width: "100%" }}>

          <AgGridReact
            rowData={customers}
            columnDefs={colDefs}
            pagination={true}
            paginationAutoPageSize={true}
            domLayout="autoHeight"
            suppressCellFocus={true}
          />
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Car deleted"
      />
    </>
  );
}

export default Customerlist;
