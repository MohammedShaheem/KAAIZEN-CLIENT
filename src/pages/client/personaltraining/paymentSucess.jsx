import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "@/components/client/layout/ClientLayout";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait 2 seconds then go to booking
    const timer = setTimeout(() => {
      navigate("/booking", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <ClientLayout>
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful 
        </h1>
        <p className="mt-3 text-gray-600">
          Redirecting you to booking setup...
        </p>
      </div>
    </ClientLayout>
  );
};

export default PaymentSuccess;