import { useState, useEffect } from "react";
import { fetchCustomers, deleteCustomer } from "../ptapi";
import AddCustomer from "./AddCustomer";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import EditCustomer from "./EditCustomer";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Box, Typography } from "@mui/material";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function Customerlist() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  
  // Define snackbar state with anchor origin positions
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = snackbarState;

  const [columns] = useState([
    { field: "firstname", filter: true, width: 200},
    { field: "lastname", filter: true, width: 200},
    { field: "streetaddress", filter: true, width: 200},
    { field: "postcode", filter: true, width: 200},
    { field: "city", filter: true, width: 200},
    { field: "email", filter: true, width: 200},
    { field: "phone", filter: true, width: 200},
    {
      cellRenderer: (params) => {
        return (
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
          // Open snackbar after deleting
          setSnackbarState({ open: true, vertical: "top", horizontal: "center" });
        })
        .catch((err) => {
          console.error("Error deleting customer:", err);
          alert("An error occurred while deleting the customer!");
        });
    }
  };

  const handleCloseSnackbar = () => {
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
    <Box sx={{ width: "100%", marginTop: 0 }}>
      <div className="full-width">
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <Box sx={{ padding: 2 }}>
            {/* Customer Heading */}
            <Typography
              variant="h5"
              component="h2"
              sx={{ mb: 2, color: "#6c757d" }}
            >
              Customers
            </Typography>
  
            <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <AddCustomer handleFetch={handleFetch} />
              <Button variant="contained" color="primary" onClick={onBtnExport}>
                Export to CSV
              </Button>
            </Box>
          </Box>
        </div>
  
        {/* Box containing the customer list (AgGridReact) with an outline */}
        <Box
          sx={{
            border: "1px solid #ddd",  // Adding border
            borderRadius: "8px",       // Optional: rounded corners
            boxShadow: 2,              // Optional: add shadow for better visual appeal
            padding: 2,                // Optional: space inside the Box
            marginTop: 2,              // Optional: gap above the table
          }}
        >
          <div className="ag-theme-material" style={{ height: 500, width: "100%" }}>
            <AgGridReact
              rowData={customers}
              columnDefs={columns}
              pagination={true}
              paginationAutoPageSize={true}
              suppressCellFocus={true}
              onGridReady={onGridReady}
              paginationPageSize={10} 
            />
          </div>
        </Box>
  
        {/* Snackbar for customer deletion */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message="Customer deleted"
        />
      </div>
    </Box>
  );
}

export default Customerlist;
