"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BMIRecord {
  id: string;
  weight: number;
  height: number;
  bmi: number;
  result: string;
  date: string;
}

export default function BMIChart({ records }: { records: BMIRecord[] }) {
  // Reverse records for chart (oldest to newest)
  const data = [...records].reverse().map(r => ({
    ...r,
    date: new Date(r.date).toLocaleDateString(),
  }));

  return (
    <div className="mt-8 overflow-hidden rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">BMI Trend</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" domain={['auto', 'auto']} />
            <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="bmi" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
