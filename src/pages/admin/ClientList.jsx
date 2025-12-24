import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClients } from "@/services/admin";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients().then(res => setClients(res.data.results));
  }, []);

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Email</th>
          <th>Status</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        {clients.map(client => (
          <tr
            key={client.id}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/admin/clients/${client.id}`)}
          >
            <td>{client.email}</td>
            <td>{client.is_active ? "Active" : "Blocked"}</td>
            <td>{new Date(client.created_at).toDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
