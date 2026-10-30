import { genralConfig } from '../../../../config'
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeftIcon } from "lucide-react";

type Transaction = {
  id: string;
  numero_transaction: string;
  client_nom: string;
  client_prenom: string;
  numero_compte: string;
  type: string;
  montant: number;
  date: string;
  status: string;
  effectue_par: string;
};

export default function HistoriquePages() {
  const { user } = useAuth();
  console.log("USER COMPLET:", JSON.stringify(user));  // ← ajoute ici
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const userRoles: string[] = ((user as any)?.roles ?? []).map((r: any) => r?.slug ?? '');
  const isAdmin = userRoles.includes('admin') || userRoles.length === 0;
  const isCashier = userRoles.includes('cashier') && !userRoles.includes('savings_officer') && !isAdmin;

  useEffect(() => {
    const fetchTransactions = async () => {
  try {
    setLoading(true);
    const currentToken = (user as any)?.token;
    if (!currentToken) { setLoading(false); return; }

    const isCaissier = (user as any)?.roles?.some((r: any) => r?.slug === 'cashier');
    const username = (user as any)?.username;

    const url = isCaissier
      ? `${genralConfig.apiUrl}/admin/app/transactions?username=${username}`
      : `${genralConfig.apiUrl}/admin/app/transactions`;

   const authUserId = String((user as any)?.id ?? '');

const res = await axios.get(`${genralConfig.apiUrl}/admin/app/transactions`, {
  headers: {
    Authorization: `Bearer ${currentToken}`,
    auth_user: authUserId
  }
});

    setTransactions(res.data.data || res.data || []);
  } catch (error: any) {
    console.error("❌ Erreur API :", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

    fetchTransactions();
  }, [user]);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div className="flex items-center gap-2">
        <ArrowRightLeftIcon className="w-6 h-6 text-green-700" />
        <h1 className="text-2xl font-bold tracking-tight">Historique des transactions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Toutes les transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune transaction trouvée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Transaction</th>
                    <th className="py-3 px-4">Membre</th>
                    <th className="py-3 px-4">N° Compte</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Statut</th>
                    {!isCashier && (
                      <th className="py-3 px-4">Effectué par</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{t.numero_transaction}</td>
                      <td className="py-3 px-4">{t.client_nom} {t.client_prenom}</td>
                      <td className="py-3 px-4">{t.numero_compte}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          t.type === "depot" ? "bg-green-100 text-green-700" :
                          t.type === "retrait" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {t.type === "depot" ? "Dépôt" : t.type === "retrait" ? "Retrait" : "Transfert"}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-medium ${t.type === "retrait" ? "text-red-600" : "text-green-700"}`}>
                        {t.type === "retrait" ? "-" : "+"}{t.montant.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4">{t.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          t.status === "success" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {t.status === "success" ? "Validé" : "En attente"}
                        </span>
                      </td>
                      {!isCashier && (
                        <td className="py-3 px-4 text-muted-foreground">{t.effectue_par}</td>
                      )}
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