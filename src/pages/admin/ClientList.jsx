import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClients } from "@/services/admin/admin";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients()
      .then((res) => {
        setClients(res.data.results || []);
        
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch clients:", err);
        setError("Failed to load clients.");
        setLoading(false);
      });
  }, []);
  console.log("clients:",clients);
  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr
              key={client.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate(`/admin/clients/${client.id}`)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  client.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {client.is_active ? "Active" : "Blocked"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(client.created_at).toDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clients.length === 0 && <p className="text-gray-500 text-center py-8">No clients found.</p>}
    </div>
  );
}