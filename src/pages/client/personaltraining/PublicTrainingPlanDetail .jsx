import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  ArrowLeft,
  Clock,
  Repeat,
} from "lucide-react";
import {usePublicPlanDetail, useCreateCheckoutSession, useClientPlans } from "@/hooks/client/personaltraining/publicPlan";
import ClientLayout from "@/components/client/layout/ClientLayout";
import { useEffect } from "react";

const PublicTrainingPlanDetail = () => {
  const { planId } = useParams();
  const navigate = useNavigate();


  const {
    data: plan,
    isLoading,
    isError,
    error,
  } = usePublicPlanDetail(planId);
  const { data: clientPlans = [] } = useClientPlans();
  const checkoutMutation = useCreateCheckoutSession();

  useEffect(() => {
    const hasPaidPlan = clientPlans.some(
      (p) => p.status === "paid"
    );
    if (hasPaidPlan) {
      navigate("/booking", { replace: true });
    }
  }, [clientPlans, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-red-600 font-medium">
          {error?.message || "Training plan not found"}
        </p>

        <Link
          to="/training-plans"
          className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Link>
      </div>
    );
  }

  
  const handleChoosePlan = () => {
    checkoutMutation.mutate({
      plan_id: plan.id,
    });
  };

  return (
    <ClientLayout
      headerProps={{
        userName: "Client",
        location: "Training Plans",
      }}
    >
      <div className="max-w-5xl mx-auto p-6">
        <Link
          to="/training-plans"
          className="inline-flex items-center text-purple-600 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Get Started Today
          </h2>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
            Start Your Fitness Journey with Confidence
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            A structured training plan designed to keep you consistent,
            focused, and progressing every single day.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            <p className="text-gray-600 mt-2">
              {plan.description || "No description available"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-3 text-purple-600" />
              Duration: {plan.duration_days} days
            </div>

            <div className="flex items-center text-gray-700">
              <DollarSign className="w-5 h-5 mr-3 text-purple-600" />
              Price: ₹{Number(plan.price).toFixed(2)}
            </div>

            <div className="flex items-center text-gray-700">
              <Repeat className="w-5 h-5 mr-3 text-purple-600" />
              Sessions per day: 1
            </div>

            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-3 text-purple-600" />
              Session duration: 60 minutes
            </div>
          </div>

          <div className="border-t pt-6 flex justify-center">
            <button
              className="px-10 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
              onClick={handleChoosePlan}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending
                ? "Redirecting to Payment..."
                : "Choose This Plan"}
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default PublicTrainingPlanDetail;