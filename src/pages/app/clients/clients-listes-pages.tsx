import apiRoutes from "@/api/apiRoutes.ts";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, PlusIcon, EyeIcon } from "lucide-react";
import apiService from "@/api/apiService.ts";

type Client = {
  id: string;
  last_name: string;
  first_name: string;
  primary_phone: string;
  city: string;
  account_type: string;
  status: string;
  join_date: string;
};

export default function ClientsListesPages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
     { url: apiRoutes.admin.app.clients.list },
     { userToken: user?.token ?? "" }
     );
      setClients(response?.data?.list ?? []);
    } catch (error) {
      console.error("Erreur chargement clients", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-6 h-6 text-green-700" />
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        </div>
        <Button
          onClick={() => navigate(routeHelpers.dashboard.clients.create)}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Ajouter un client
        </Button>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun client trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">Nom</th>
                    <th className="py-3 px-4">Téléphone</th>
                    <th className="py-3 px-4">Ville</th>
                    <th className="py-3 px-4">Type de compte</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Date d'adhésion</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        {client.last_name} {client.first_name}
                      </td>
                      <td className="py-3 px-4">{client.primary_phone}</td>
                      <td className="py-3 px-4">{client.city}</td>
                      <td className="py-3 px-4">{client.account_type}</td>
                      <td className="py-3 px-4">
                        <span className= {`px-2 py-1 rounded-full text-xs font-medium ${
                          client.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {client.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="py-3 px-4">{client.join_date}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`${routeHelpers.dashboard.clients.show}/${client.id}`)}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}