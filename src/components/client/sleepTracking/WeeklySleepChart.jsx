import { useState } from "react";
import { useLogSleep,useWeeklySleepReport } from "@/hooks/client/nutrition/useSleep";
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
ReferenceLine
} from "recharts";


export default function WeeklySleepChart({ goal = 8 }) {
const { data, isLoading, error } = useWeeklySleepReport();


if (isLoading) return <p className="text-white">Loading chart...</p>;
if (error) return <p className="text-red-400">Failed to load report</p>;


return (
<div className="rounded-2xl bg-gradient-to-b from-[#0B1D3A] to-[#08162E] p-6 shadow-lg">
<div className="flex justify-between items-center mb-4">
<h2 className="text-white text-lg font-semibold">Sleep Analysis</h2>
<span className="text-gray-400 text-sm">Last 7 days</span>
</div>


<p className="text-gray-300 mb-2">Goal: {goal}h</p>


<div className="h-64">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={data.data}>
<XAxis dataKey="date" stroke="#aaa" />
<YAxis stroke="#aaa" />
<Tooltip />


<ReferenceLine
y={goal}
stroke="#ffffff"
strokeDasharray="4 4"
label="Goal"
/>


<Line
type="monotone"
dataKey="hours"
stroke="#3B82F6"
strokeWidth={3}
dot={{ r: 4 }}
/>
</LineChart>
</ResponsiveContainer>
</div>


<div className="flex justify-between mt-4 text-gray-300">
<p>Avg: {data.average_sleep}h</p>
<p>Total: {data.total_sleep}h</p>
</div>
</div>
);
}