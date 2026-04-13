import WalletPage from "@/components/wallet/WalletPage";
import Sidebar from "@/components/trainer/ui/sidebar";
import {
  getTrainerWalletSummary,
  getTrainerWalletTransactions,
} from "../../../services/trainer/wallet";

export default function TrainerWalletPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <WalletPage
          role="trainer"
          fetchSummary={getTrainerWalletSummary}
          fetchTransactions={getTrainerWalletTransactions}
        />
      </main>
    </div>
  );
}