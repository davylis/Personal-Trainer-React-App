import { useState, useEffect } from "react";
import { fetchCustomers, deleteCustomer } from "../ptapi";
import AddCustomer from "./AddCustomer";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import EditCustomer from "./EditCustomer";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Box, Typography } from "@mui/material";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "../Customerlist.css";

function Customerlist() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = snackbarState;

  const [columns] = useState([
    {
      field: "firstname",
      headerName: "First Name",
      filter: true,
      width: 200,
      headerClass: "custom-header",
    },
    {
      field: "lastname",
      headerName: "Last Name",
      filter: true,
      width: 200,
      headerClass: "custom-header",
    },
    {
      field: "streetaddress",
      headerName: "Street Address",
      filter: true,
      width: 200,
      headerClass: "custom-header",
    },
    {
      field: "postcode",
      headerName: "Postcode",
      filter: true,
      width: 200,
      headerClass: "custom-header",
    },
    {
      field: "city",
      headerName: "City",
      filter: true,
      width: 200,
      headerClass: "custom-header",
    },
    {
      field: "email",
      headerName: "Email",
      filter: true,
      width: 200,
      headerClass: "custom-header",
    },
    {
      field: "phone",
      headerName: "Phone",
      filter: true,
      width: 200,
      headerClass: "custom-header",
    },
    {
      cellRenderer: (params) => (
        <EditCustomer
          handleFetch={handleFetch}
          data={params.data}
          variant="contained"
          color="primary"
          size="small"
        />
      ),
      headerClass: "custom-header",
      width: 120,
    },
    {
      cellRenderer: (params) => (
        <Button
          color="error"
          size="small"
          onClick={() => handleDelete(params.data._links.self.href)}
        >
          <PersonRemoveIcon />
        </Button>
      ),
      headerClass: "custom-header",
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
          setSnackbarState({
            open: true,
            vertical: "top",
            horizontal: "center",
          });
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
      console.error("Grid API is not set");
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
        <Box sx={{ padding: 2 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 2, color: "#9a8774" }}
          >
            Customers
          </Typography>

          <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <AddCustomer handleFetch={handleFetch} />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ffb061",
                color: "white",
                "&:hover": { backgroundColor: "#e67612" },
              }}
              startIcon={<FileUploadIcon />}
              onClick={onBtnExport}
            >
              Export to CSV
            </Button>
          </Box>
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
          <div
            className="ag-theme-material"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact
              rowData={customers}
              columnDefs={columns}
              pagination
              paginationAutoPageSize
              suppressCellFocus
              onGridReady={onGridReady}
              paginationPageSize={10}
            />
          </div>
        </Box>

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
