import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileTextIcon, PlusIcon, EyeIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";

type Facture = {
  id: string;
  numero_facture: string;
  client_nom: string;
  client_prenom: string;
  montant: number;
  date_emission: string;
  date_echeance: string;
  status: string;
};

export default function FacturesListesPages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileTextIcon className="w-6 h-6 text-green-700" />
          <h1 className="text-2xl font-bold tracking-tight">Factures</h1>
        </div>
        <Button
          onClick={() => navigate(routeHelpers.dashboard.paiements.factures.create)}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liste des factures</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : factures.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune facture trouvée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Facture</th>
                    <th className="py-3 px-4">Membre</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Date émission</th>
                    <th className="py-3 px-4">Date échéance</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {factures.map((f) => (
                    <tr key={f.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{f.numero_facture}</td>
                      <td className="py-3 px-4">{f.client_nom} {f.client_prenom}</td>
                      <td className="py-3 px-4 font-medium text-green-700">
                        {f.montant.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4">{f.date_emission}</td>
                      <td className="py-3 px-4">{f.date_echeance}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          f.status === "payee"
                            ? "bg-green-100 text-green-700"
                            : f.status === "en_attente"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {f.status === "payee" ? "Payée" : f.status === "en_attente" ? "En attente" : "En retard"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
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