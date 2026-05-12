import { Calendar, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePublicPlans, useClientPlans } from "@/hooks/client/personaltraining/publicPlan";
import ClientLayout from "@/components/client/layout/ClientLayout";
import { useEffect } from "react";

const PublicTrainingPlans = () => {
  const navigate = useNavigate();

  const {
    data: plans = [],
    isLoading,
    isError,
    error,
  } = usePublicPlans();

  const { data: clientPlans = [] } = useClientPlans();
  console.log('plan:',clientPlans)
  useEffect(() => {
    const paidPlan = clientPlans.find((p) => p.status === "paid");

    if (!paidPlan) return; 

    if (paidPlan.is_active === false) {
      navigate("/booking", { replace: true });
    } else if (paidPlan.is_active === true) {
      navigate("/current-plan", { replace: true });
    }
  }, [clientPlans, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  
  if (isError) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-red-600 font-medium">
          {error?.message || "Failed to load training plans"}
        </p>
      </div>
    );
  }

  
  if (plans.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
        <p className="text-gray-600 font-medium">
          No training plans are available at the moment.
        </p>
      </div>
    );
  }

  
  return (
    <ClientLayout
      headerProps={{
        userName: "Client",
        location: "Training Plans",
      }}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Choose Your Training Plan
          </h1>
          <p className="text-gray-600 mt-2">
            Flexible plans designed to match your fitness goals
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {plan.name}
                </h2>

                <p className="text-gray-600 text-sm mb-4">
                  {plan.description || "No description available"}
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    {plan.duration_days} days
                  </p>

                  <p className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                    ₹{Number(plan.price).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <button
                className="mt-6 w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                onClick={() =>
                  navigate(`/training-plans/${plan.id}`)
                }
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
};

export default PublicTrainingPlans;
