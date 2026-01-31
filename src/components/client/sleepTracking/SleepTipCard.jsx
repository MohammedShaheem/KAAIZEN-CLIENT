import { useState } from "react";
import { useLogSleep,useWeeklySleepReport } from "@/hooks/client/nutrition/useSleep";


export default function SleepTipsCard() {
return (
<div className="rounded-2xl bg-gradient-to-b from-[#0B1D3A] to-[#08162E] p-6 shadow-lg">
<h2 className="text-white text-lg font-semibold mb-3">
Tips To Sleep Better
</h2>


<p className="text-gray-300 leading-relaxed">
Increase your water intake 💧 throughout the day. Dehydration can
cause daytime fatigue and disrupt your sleep patterns. Try limiting
screen exposure at least 1 hour before bedtime and maintain a
consistent sleep schedule.
</p>
</div>
);
}