import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchIcon, UserIcon, PhoneIcon, MapPinIcon, CreditCardIcon } from "lucide-react";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";

type Client = {
  id: string;
  last_name: string;
  first_name: string;
  primary_phone: string;
  city: string;
  account_type: string;
  status: string;
  join_date: string;
  member_number: string;
  gender: string;
  address: string;
  neighborhood: string;
  district: string;
  birth_date: string;
  profession: string;
  id_document_type: string;
  id_document_number: string;
  photo: string;
};

export default function RechercheClientPages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.clients.list}?search=${search}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setClients(response?.data?.list ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rechercher un client</h1>
        <p className="text-sm text-muted-foreground pt-1">
          Tapez le nom, prénom ou téléphone du client.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-3">
        <Input
          placeholder="Nom, prénom ou numéro de téléphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-lg"
        />
        <Button
          onClick={handleSearch}
          className="bg-green-700 hover:bg-green-800 text-white"
          disabled={loading}
        >
          <SearchIcon className="w-4 h-4 mr-2" />
          {loading ? "Recherche..." : "Rechercher"}
        </Button>
      </div>

      {/* Résultats */}
      {searched && clients.length === 0 && !loading && (
        <p className="text-sm text-muted-foreground">Aucun client trouvé.</p>
      )}

      {clients.map((client) => (
        <Card key={client.id} className="border border-gray-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-green-700" />
              {client.last_name} {client.first_name}
              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                client.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {client.status === "active" ? "Actif" : "Inactif"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <UserIcon className="w-4 h-4" />
                  <span className="font-medium">N° membre :</span> {client.member_number}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <PhoneIcon className="w-4 h-4" />
                  <span className="font-medium">Téléphone :</span> {client.primary_phone}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="font-medium">Adresse :</span> {client.neighborhood}, {client.city}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <CreditCardIcon className="w-4 h-4" />
                  <span className="font-medium">Type de compte :</span> {client.account_type}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium">Date de naissance :</span> {client.birth_date}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Sexe :</span> {client.gender === "M" ? "Masculin" : "Féminin"}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Profession :</span> {client.profession || "Non renseigné"}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Date d'adhésion :</span> {client.join_date}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Pièce d'identité :</span> {client.id_document_type} - {client.id_document_number}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}