import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  LineChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Brush,
} from "recharts";
import { fetchTrainings } from "../ptapi";
import { Box, Typography } from "@mui/material";
import _ from "lodash";

export default function StatisticsList() {
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainings()
      .then((data) => {
        //group data by activity and sum the duration for each activity
        const groupedData = _(data)
          .groupBy("activity")
          .map((trainings, activity) => ({
            activity,
            totalTime: _.sumBy(trainings, "duration"), // Calculate total duration
          }))
          .value(); 

        setTrainingData(groupedData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ width: "88%", marginTop: 0 }}>
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
        <div className="line-charts">
          <div className="composed-chart-wrapper">
            <ResponsiveContainer width="100%" height={700}>
              <ComposedChart
                data={trainingData}
                margin={{ top: 20, right: 20, bottom: 5, left: 20 }}
              >
                <CartesianGrid stroke="#ffe3c7" />
                <XAxis
                  dataKey="activity"
                  label={{
                    value: "Activities",
                    position: "insideBottom",
                    offset: -15,
                  }}
                />
                <YAxis
                  label={{
                    value: "Duration (min)",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />

                <Bar dataKey="totalTime" fill="#ffb061" />

                <Brush>
                  <LineChart>
                    <Line dataKey="totalTime" stroke="#ff7300" dot={false} />
                  </LineChart>
                </Brush>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Box>
    </Box>
  );
}
