import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, PlusIcon, EyeIcon } from "lucide-react";

type Groupe = {
  id: string;
  nom: string;
  responsable: string;
  nombre_membres: number;
  date_creation: string;
  status: string;
};

export default function GroupesPages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-6 h-6 text-green-700" />
          <h1 className="text-2xl font-bold tracking-tight">Groupes</h1>
        </div>
        <Button
          onClick={() => navigate(routeHelpers.dashboard.groupes.create)}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Créer un groupe
        </Button>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liste des groupes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : groupes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun groupe trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">Nom du groupe</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4">Membres</th>
                    <th className="py-3 px-4">Date de création</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupes.map((groupe) => (
                    <tr key={groupe.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{groupe.nom}</td>
                      <td className="py-3 px-4">{groupe.responsable}</td>
                      <td className="py-3 px-4">{groupe.nombre_membres} membres</td>
                      <td className="py-3 px-4">{groupe.date_creation}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          groupe.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {groupe.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`${routeHelpers.dashboard.groupes.show}/${groupe.id}`)}
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