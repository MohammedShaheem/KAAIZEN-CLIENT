import MySleepCard from "@/components/client/sleepTracking/MySleepCard"
import WeeklySleepChart from "@/components/client/sleepTracking/WeeklySleepChart"
import SleepTipsCard from "@/components/client/sleepTracking/SleepTipCard"
import LogSleepCard from "@/components/client/sleepTracking/LogSleepCard"
import { useWeeklySleepReport } from "@/hooks/client/nutrition/useSleep"
import ClientLayout from "@/components/client/layout/ClientLayout"
import ReminderToggle from "@/components/notification/client/ReminderToggle"

export default function SleepDashboard() {
  const { data, isLoading } = useWeeklySleepReport()

  const latest =
    data?.data?.length > 0
      ? data.data[data.data.length - 1]
      : null

  return (
    <ClientLayout
      headerProps={{
        userName: "Client",
        location: "Training Plans",
      }}
    >
    <div className="space-y-6">
      <LogSleepCard />

      {isLoading ? (
        <p className="text-gray-400">Loading latest sleep...</p>
      ) : (
        <MySleepCard latest={latest} />
      )}
      <ReminderToggle reminderType="sleep" />

      <WeeklySleepChart />
      <SleepTipsCard />
    </div>
    </ClientLayout>
  )
}
