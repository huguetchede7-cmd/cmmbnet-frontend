import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCardIcon, PlusIcon } from "lucide-react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";

type Paiement = {
  id: string;
  numero_paiement: string;
  client_nom: string;
  client_prenom: string;
  montant: number;
  date_paiement: string;
  mode_paiement: string;
  status: string;
};

export default function PaiementsListesPages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="w-6 h-6 text-green-700" />
          <h1 className="text-2xl font-bold tracking-tight">Paiements membres</h1>
        </div>
        <Button
          onClick={() => navigate(routeHelpers.dashboard.paiements.create)}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Nouveau paiement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liste des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : paiements.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun paiement trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Paiement</th>
                    <th className="py-3 px-4">Membre</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {paiements.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{p.numero_paiement}</td>
                      <td className="py-3 px-4">{p.client_nom} {p.client_prenom}</td>
                      <td className="py-3 px-4 font-medium text-green-700">
                        {p.montant.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4">{p.mode_paiement}</td>
                      <td className="py-3 px-4">{p.date_paiement}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {p.status === "success" ? "Validé" : "En attente"}
                        </span>
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