import { Link } from "react-router-dom";
import ClientLayout from "@/components/client/layout/ClientLayout";

const PaymentCancel = () => {
  return (
    <ClientLayout>
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold text-red-600">
          Payment Cancelled ❌
        </h1>
        <p className="mt-3 text-gray-600">
          Your payment was not completed.
        </p>

        <Link
          to="/training-plans"
          className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
        >
          Go Back to Plans
        </Link>
      </div>
    </ClientLayout>
  );
};

export default PaymentCancel;