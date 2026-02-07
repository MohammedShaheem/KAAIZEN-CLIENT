import { useState,useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ToggleRight, Users, Calendar, DollarSign, FileText, Clock, Edit } from "lucide-react";

import { useTrainingPlanDetail,useUpdateTrainingPlanStatus } from "@/hooks/admin/ClientPlans";
import ClientInput from "@/components/client/inputs/ClientInput";

const TrainingPlanDetail = () => {
  const { planId } = useParams();
  const {
    data: plan,
    isLoading,
    isError,
    error,
  } = useTrainingPlanDetail(planId);

  const updateStatusMutation = useUpdateTrainingPlanStatus();

  const [localIsActive, setLocalIsActive] = useState(plan?.is_active ?? true); 

  
  useEffect(() => {
  if (plan) {
    setLocalIsActive(plan.is_active);
  }
}, [plan]);


  const handleToggleActive = () => {
    const newActive = !localIsActive;
    setLocalIsActive(newActive); 
    updateStatusMutation.mutate(
      { planId, isActive: newActive },
      {
        onError: () => setLocalIsActive(!newActive),
      }
    );

  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-red-600 font-medium">
          {error?.response?.data?.detail ||
            error?.message ||
            "Failed to fetch plan details"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
        <Link
          to=".." 
          className="inline-flex items-center justify-center py-2 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          Back to Plans
        </Link>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-purple-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Plan Information</h3>
          <div className="space-y-2">
            <p className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Duration: {plan.duration_days} days
            </p>
            <p className="flex items-center text-gray-700">
              <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
              Price: ₹{Number(plan.price).toFixed(2)}
            </p>
            <p className="flex items-center text-gray-700">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Active Subscriptions: {plan.active_subscriptions}
            </p>
            <p className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Created: {new Date(plan.created_at).toLocaleDateString()}
            </p>
            <p className="flex items-center text-gray-700">
              <Edit className="w-5 h-5 mr-2 text-purple-600" />
              Updated: {new Date(plan.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Description</h3>
          <p className="text-gray-700">{plan.description || "No description available"}</p>
        </div>
      </div>

      
      <div className="flex items-center gap-4 mb-8">
        <span className="text-gray-700 font-medium">Active Status:</span>
        <button
          onClick={handleToggleActive}
          disabled={updateStatusMutation.isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            localIsActive ? "bg-green-600" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              localIsActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-sm text-gray-500">
          {updateStatusMutation.isLoading ? "Updating..." : localIsActive ? "Active" : "Inactive"}
        </span>
        {updateStatusMutation.isError && (
          <p className="text-red-500 text-sm">
            {updateStatusMutation.error?.response?.data?.detail || "Failed to update status"}
          </p>
        )}
      </div>

      
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Subscribed Clients</h3>
        {plan.clients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plan.clients.map((client) => (
                  <tr
                    key={client.client_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.client_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.client_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(client.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(client.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.is_active ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No clients subscribed to this plan yet.</p>
        )}
      </div>
    </div>
  );
};

export default TrainingPlanDetail;