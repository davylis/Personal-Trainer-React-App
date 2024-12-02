import { useState, useEffect } from "react";
import { fetchCustomers, deleteCustomer } from "../ptapi";
import AddCustomer from "./AddCustomer";
import ExportData from "./ExportData";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import EditCustomer from "./EditCustomer";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function Customerlist() {
  //state variable which holds an array
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = snackbarState;

  const [columns] = useState([
    { field: "firstname", filter: true, width: 150},
    { field: "lastname", filter: true, width: 150},
    { field: "streetaddress", filter: true, width: 150},
    { field: "postcode", filter: true, width: 150},
    { field: "city", filter: true, width: 150},
    { field: "email", filter: true, width: 150},
    { field: "phone", filter: true, width: 150},
    {
      cellRenderer: (params) => {
        console.log(params.data);
        return(
        <EditCustomer
          handleFetch={handleFetch}
          data={params.data}
          variant="contained"
          color="primary"
          size="small"
        />
      );
    },
      width: 120,
    },
    {
      cellRenderer: (params) => (
                <Button
                  color="error"
                  size="small"
                  onClick={() => handleDelete(params.data._links.self.href)}
                >
                  <HighlightOffIcon />
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
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
    //close the snackbar
    setSnackbarState({ ...snackbarState, open: false });
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
        <AddCustomer handleFetch={handleFetch} />
        <ExportData handleFetch={handleFetch} />
      </div>

      <div className="ag-theme-material" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={customers}
          columnDefs={columns}
        pagination={true}
        paginationAutoPageSize={true}
        suppressCellFocus={true}
        
        />
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Customer deleted"
      />
    </div>
  );
}

export default Customerlist;
