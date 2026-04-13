import WalletPage from "@/components/wallet/WalletPage";
import ClientLayout from "@/components/client/layout/ClientLayout";
import {
  getClientWalletSummary,
  getClientWalletTransactions,
} from "../../../services/client/wallet";

export default function ClientWalletPage() {
  return (
    <ClientLayout>
    <WalletPage
      role="client"
      fetchSummary={getClientWalletSummary}
      fetchTransactions={getClientWalletTransactions}
    />
    </ClientLayout>
  );
}