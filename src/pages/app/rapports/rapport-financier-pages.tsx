import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon, TrendingUpIcon, TrendingDownIcon, WalletIcon } from "lucide-react";
import apiService from "@/api/apiService.ts";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";

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
};

type PeriodeOption = "mois_actuel" | "mois_passe" | "3_mois";

export default function RapportFinancierPages() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState<PeriodeOption>("mois_actuel");
  const [totaux, setTotaux] = useState({ depots: 0, retraits: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  const getDateRange = (option: PeriodeOption) => {
    const now = new Date();
    let debut: Date;
    let fin: Date = new Date();

    if (option === "mois_actuel") {
      debut = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (option === "mois_passe") {
      debut = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      fin = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
      debut = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    }

    return { debut, fin };
  };

  const filtrerTransactions = (data: Transaction[], option: PeriodeOption) => {
    const { debut, fin } = getDateRange(option);
    return data.filter((t) => {
      const date = new Date(t.date);
      return date >= debut && date <= fin;
    });
  };

  const buildChartData = (data: Transaction[], option: PeriodeOption) => {
    const map: Record<string, { mois: string; depots: number; retraits: number }> = {};

    data.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

      if (!map[key]) map[key] = { mois: label, depots: 0, retraits: 0 };
      if (t.type === "depot") map[key].depots += Number(t.montant);
      if (t.type === "retrait") map[key].retraits += Number(t.montant);
    });

    return Object.values(map).sort((a, b) => a.mois.localeCompare(b.mois));
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(
          { url: "http://localhost:3001/admin/transactions" },
          { userToken: (user as any)?.token ?? "", hasNoSuccessModal: true }
        );
        const data = response?.data ?? [];
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = filtrerTransactions(transactions, periode);
    let depots = 0;
    let retraits = 0;
    filtered.forEach((t) => {
      if (t.type === "depot") depots += Number(t.montant);
      if (t.type === "retrait") retraits += Number(t.montant);
    });
    setTotaux({ depots, retraits });
    setChartData(buildChartData(transactions, periode));
  }, [transactions, periode]);

  const solde = totaux.depots - totaux.retraits;

  const stats = [
    {
      title: "Total dépôts",
      value: `${totaux.depots.toLocaleString()} FCFA`,
      icon: <TrendingUpIcon className="w-5 h-5 text-green-700" />,
      color: "bg-green-50",
    },
    {
      title: "Total retraits",
      value: `${totaux.retraits.toLocaleString()} FCFA`,
      icon: <TrendingDownIcon className="w-5 h-5 text-red-600" />,
      color: "bg-red-50",
    },
    {
      title: "Solde net",
      value: `${solde.toLocaleString()} FCFA`,
      icon: <BarChart3Icon className="w-5 h-5 text-purple-600" />,
      color: solde >= 0 ? "bg-purple-50" : "bg-orange-50",
    },
    {
      title: "Total transactions",
      value: `${filtrerTransactions(transactions, periode).length}`,
      icon: <WalletIcon className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3Icon className="w-6 h-6 text-green-700" />
          <h1 className="text-2xl font-bold tracking-tight">Rapport financier</h1>
        </div>

        {/* Filtre période */}
        <div className="flex gap-2">
          {[
            { value: "mois_actuel", label: "Ce mois" },
            { value: "mois_passe", label: "Mois passé" },
            { value: "3_mois", label: "3 derniers mois" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriode(opt.value as PeriodeOption)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                periode === opt.value
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-none border border-gray-200">
            <CardContent className="pt-6">
              <div className={`flex items-center gap-4 p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Équilibre budgétaire */}
      <Card className="shadow-none border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base">Équilibre budgétaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-600 h-4 rounded-full transition-all"
                style={{
                  width: totaux.depots + totaux.retraits > 0
                    ? `${(totaux.depots / (totaux.depots + totaux.retraits)) * 100}%`
                    : "50%"
                }}
              />
            </div>
            <span className="text-sm text-green-700 font-medium">
              Entrées {totaux.depots + totaux.retraits > 0
                ? Math.round((totaux.depots / (totaux.depots + totaux.retraits)) * 100)
                : 0}%
            </span>
            <span className="text-sm text-red-600 font-medium">
              Sorties {totaux.depots + totaux.retraits > 0
                ? Math.round((totaux.retraits / (totaux.depots + totaux.retraits)) * 100)
                : 0}%
            </span>
          </div>
          <p className={`mt-3 text-sm font-medium ${solde >= 0 ? "text-green-700" : "text-red-600"}`}>
            {solde >= 0
              ? `✅ Excédent de ${solde.toLocaleString()} FCFA — L'entreprise est en bonne santé financière`
              : `⚠️ Déficit de ${Math.abs(solde).toLocaleString()} FCFA — Les sorties dépassent les entrées`}
          </p>
        </CardContent>
      </Card>

      {/* Graphique courbe */}
      <Card className="shadow-none border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base">Évolution dépôts vs retraits</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune donnée disponible.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => `${Number(value).toLocaleString()} FCFA`} />
                <Legend />
                <Line type="monotone" dataKey="depots" stroke="#15803d" strokeWidth={2} name="Dépôts" dot={{ r: 5 }} />
                <Line type="monotone" dataKey="retraits" stroke="#dc2626" strokeWidth={2} name="Retraits" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Graphique barres */}
      <Card className="shadow-none border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base">Comparaison mensuelle</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune donnée disponible.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => `${Number(value).toLocaleString()} FCFA`} />
                <Legend />
                <Bar dataKey="depots" fill="#15803d" name="Dépôts" radius={[4, 4, 0, 0]} />
                <Bar dataKey="retraits" fill="#dc2626" name="Retraits" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Tableau récapitulatif */}
      <Card className="shadow-none border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base">Récapitulatif des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : filtrerTransactions(transactions, periode).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune transaction pour cette période.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Transaction</th>
                    <th className="py-3 px-4">Membre</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrerTransactions(transactions, periode).map((t) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{t.numero_transaction}</td>
                      <td className="py-3 px-4">{t.client_nom} {t.client_prenom}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          t.type === "depot" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {t.type === "depot" ? "Dépôt" : "Retrait"}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-medium ${t.type === "retrait" ? "text-red-600" : "text-green-700"}`}>
                        {t.type === "retrait" ? "-" : "+"}{Number(t.montant).toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4">{t.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          t.status === "success" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {t.status === "success" ? "Validé" : "En attente"}
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