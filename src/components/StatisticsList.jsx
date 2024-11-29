
import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  LineChart,
  ReferenceLine,
  ReferenceDot,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Brush,
} from 'recharts';
import { fetchTrainings } from "../ptapi";
import _ from "lodash";

export default function StatisticsList() {
    const [trainingData, setTrainingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchTrainings()
      .then((data) => {
        //using lodash to group by activity and sum the duration for each activity
        const groupedData = _(data)
          .groupBy("activity") //group data by antivity
          .map((trainings, activity) => ({
            activity, 
            totalTime: _.sumBy(trainings, 'duration'), //total sum: duration
          }))
          .value();//finalize the lodash chain and conert to plain object

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
  <div className="line-charts">
      <div className="composed-chart-wrapper">
        <ResponsiveContainer width="100%" height={700}>
          <ComposedChart
            width={800}
            height={400}
            data={trainingData}
            margin={{ top: 20, right: 20, bottom: 5, left: 20 }}
          >
            <CartesianGrid stroke="#f5f5f5" />
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
            <Legend layout="vertical" align="right" verticalAlign="middle" />
            
           
            {/* Bar chart showing total time */}
            <Bar dataKey="totalTime" fill="#ff7300" />
            
            {/* Scatter chart for additional visualisation */}
            <Brush>
              <LineChart>
                <Line dataKey="totalTime" stroke="#ff7300" dot={false} />
              </LineChart>
            </Brush>

            {/* Optionally, add a reference line for maximum total time */}
            <ReferenceLine y={Math.max(...trainingData.map(item => item.totalTime))} label="Max Time" stroke="red" />
            <ReferenceDot x="Activity C" y={1300} stroke="red" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
    );
};