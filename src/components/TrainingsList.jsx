import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import dayjs from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import { fetchTrainings, deleteTraining } from "../ptapi";
import AddTraining from "./AddTraining";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography } from "@mui/material";

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

  const columnDefs = [
    {
      field: "activity",
      headerName: "Activity",
      filter: true,
      sortable: true,
      headerClass: "custom-header",
      width: 300,
    },
    {
      field: "date",
      headerName: "Date",
      filter: true,
      sortable: true,
      headerClass: "custom-header",
      width: 300,
      valueFormatter: (params) =>
        dayjs(params.value).format("DD.MM.YYYY HH:mm"),
    },
    {
      field: "duration",
      headerName: "Duration (min)",
      filter: true,
      sortable: true,
      headerClass: "custom-header",
      width: 300,
    },
    {
      field: "customer",
      headerName: "Customer",
      filter: true,
      sortable: true,
      width: 300,
      headerClass: "custom-header",
      valueGetter: (params) =>
        `${params.data.customer?.firstname} ${params.data.customer?.lastname}`,
    },
    {
      cellRenderer: (params) => (
        <Button
          color="error"
          size="small"
          onClick={() =>
            handleDelete(
              `${import.meta.env.VITE_API_URL}trainings/${params.data.id}`
            )
          }
        >
          <DeleteIcon />
        </Button>
      ),
      width: 300,
      headerClass: "custom-header",
    },
  ];

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = () => {
    fetchTrainings()
      .then((data) => setTrainings(data))
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching trainings:", err);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (url) => {
    if (window.confirm("Are you sure you want to delete?")) {
      deleteTraining(url)
        .then(() => {
          handleFetch();
          setSnackbarState({ ...snackbarState, open: true });
        })
        .catch((error) => {
          console.error("Error deleting training:", error);
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

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ width: "100%", marginTop: 0 }}>
      <Box sx={{ padding: 2 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 2, color: "#9a8774" }}
        >
          Trainings
        </Typography>

        <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <AddTraining handleFetch={handleFetch} />
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
            rowData={trainings}
            columnDefs={columnDefs}
            pagination={true}
            paginationAutoPageSize={true}
            suppressCellFocus={true}
            onGridReady={onGridReady}
          />
        </div>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Training deleted"
      />
    </Box>
  );
}

export default TrainingsList;
