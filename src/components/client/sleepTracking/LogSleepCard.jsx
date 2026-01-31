import { useState } from "react";
import { useLogSleep,useWeeklySleepReport } from "@/hooks/client/nutrition/useSleep";

export default function LogSleepCard() {
const [form, setForm] = useState({
sleep_date: "",
sleep_time: "",
wake_time: ""
});


const { mutate, isPending, isSuccess, data } = useLogSleep();


const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};


const handleSubmit = (e) => {
e.preventDefault();
mutate(form);
};


return (
<div className="rounded-2xl bg-gradient-to-b from-[#0B1D3A] to-[#08162E] p-6 shadow-lg">
<h2 className="text-white text-lg font-semibold mb-4">Add Sleep Log</h2>


<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
<input
type="date"
name="sleep_date"
required
onChange={handleChange}
className="rounded-lg bg-[#0F254A] text-white p-2 outline-none"
/>


<input
type="time"
name="sleep_time"
required
onChange={handleChange}
className="rounded-lg bg-[#0F254A] text-white p-2 outline-none"
/>


<input
type="time"
name="wake_time"
required
onChange={handleChange}
className="rounded-lg bg-[#0F254A] text-white p-2 outline-none"
/>


<button
disabled={isPending}
className="md:col-span-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white py-2"
>
{isPending ? "Saving..." : "Save Sleep Log"}
</button>
</form>


{isSuccess && (
<p className="mt-3 text-green-400">
You slept {data.hours_slept} hours 😴
</p>
)}
</div>
);
}