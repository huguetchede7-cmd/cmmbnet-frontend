import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, PlusIcon, EyeIcon } from "lucide-react";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";

type Compte = {
  id: string;
  numero_compte: string;
  client: { last_name: string; first_name: string; member_number: string };
  type_compte: string;
  solde: number;
  status: string;
  date_ouverture: string;
};

export default function ComptesListesPages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComptes = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
        { url: apiRoutes.admin.app.comptes.list },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setComptes(response?.data?.list ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComptes();
  }, []);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WalletIcon className="w-6 h-6 text-green-700" />
          <h1 className="text-2xl font-bold tracking-tight">Comptes</h1>
        </div>
        <Button
          onClick={() => navigate(routeHelpers.dashboard.comptes.create)}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Ouvrir un compte
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liste des comptes ({comptes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : comptes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun compte trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Compte</th>
                    <th className="py-3 px-4">Membre</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Solde</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Date d'ouverture</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comptes.map((compte) => (
                    <tr key={compte.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{compte.numero_compte}</td>
                      <td className="py-3 px-4">
                        {compte.client?.last_name} {compte.client?.first_name}
                      </td>
                      <td className="py-3 px-4">{compte.type_compte}</td>
                      <td className="py-3 px-4 font-medium text-green-700">
                        {Number(compte.solde).toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          compte.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {compte.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="py-3 px-4">{compte.date_ouverture}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`${routeHelpers.dashboard.comptes.show}/${compte.id}`)}
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