import MySleepCard from "@/components/client/sleepTracking/MySleepCard"
import WeeklySleepChart from "@/components/client/sleepTracking/WeeklySleepChart"
import SleepTipsCard from "@/components/client/sleepTracking/SleepTipCard"
import LogSleepCard from "@/components/client/sleepTracking/LogSleepCard"
import { useWeeklySleepReport } from "@/hooks/client/nutrition/useSleep"

export default function SleepDashboard() {
  const { data, isLoading } = useWeeklySleepReport()

  const latest =
    data?.data?.length > 0
      ? data.data[data.data.length - 1]
      : null

  return (
    <div className="space-y-6">
      <LogSleepCard />

      {isLoading ? (
        <p className="text-gray-400">Loading latest sleep...</p>
      ) : (
        <MySleepCard latest={latest} />
      )}

      <WeeklySleepChart />
      <SleepTipsCard />
    </div>
  )
}
