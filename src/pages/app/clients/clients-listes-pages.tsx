import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UsersIcon, PlusIcon, EyeIcon, SearchIcon, Trash2Icon } from "lucide-react";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";

type Client = {
  id: string;
  last_name: string;
  first_name: string;
  primary_phone: string;
  city: string;
  nombre_comptes: number;
  status: string;
  join_date: string;
  member_number: string;
};

export default function ClientsListesPages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // États pour le modal de confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = async (searchTerm = "") => {
    setLoading(true);
    try {
      const url = searchTerm
        ? `${apiRoutes.admin.app.clients.list}?search=${searchTerm}`
        : apiRoutes.admin.app.clients.list;
      const response = await apiService.get(
        { url },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setClients(response?.data?.list ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = () => {
    fetchClients(search);
  };

  // Ouvrir le modal avec le client sélectionné
  const openDeleteModal = (e: React.MouseEvent, client: Client) => {
    e.stopPropagation(); // Empêche la navigation vers le détail
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  // Confirmer la suppression
  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    setDeleting(true);
    try {
      await apiService.delete(
        { url: `${apiRoutes.admin.app.clients.delete}/${clientToDelete.id}` },
        { userToken: user?.token ?? "" }
      );
      setShowDeleteModal(false);
      setClientToDelete(null);
      fetchClients(search); // Recharger la liste
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-6 h-6 text-green-700" />
          <h1 className="text-2xl font-bold tracking-tight">Membres</h1>
        </div>
        <Button
          onClick={() => navigate(routeHelpers.dashboard.clients.create)}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Ajouter un membre
        </Button>
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
        <Button onClick={handleSearch} variant="outline" disabled={loading}>
          <SearchIcon className="w-4 h-4 mr-2" />
          Rechercher
        </Button>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liste des membres ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun membre trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-4">N° Membre</th>
                    <th className="py-3 px-4">Nom</th>
                    <th className="py-3 px-4">Téléphone</th>
                    <th className="py-3 px-4">Ville</th>
                    <th className="py-3 px-4">Comptes</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/dashboard/clients/detail/${client.id}`)}
                    >
                      <td className="py-3 px-4 font-medium">{client.member_number}</td>
                      <td className="py-3 px-4">{client.last_name} {client.first_name}</td>
                      <td className="py-3 px-4">{client.primary_phone}</td>
                      <td className="py-3 px-4">{client.city}</td>
                      <td className="py-3 px-4">{client.nombre_comptes}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          client.status === "Active" || client.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {client.status === "Active" || client.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/clients/detail/${client.id}`);
                            }}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                         {((user as any)?.roles ?? []).some((r: any) => r?.slug === 'admin') && (
  <Button
    variant="outline"
    size="sm"
    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
    onClick={(e) => openDeleteModal(e, client)}
  >
    <Trash2Icon className="w-4 h-4" />
  </Button>
)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && clientToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-bold mb-2">Confirmer la suppression</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Vous êtes sur le point de supprimer le membre{" "}
              <span className="font-semibold text-black">
                {clientToDelete.last_name} {clientToDelete.first_name}
              </span>{" "}
              (N° {clientToDelete.member_number}). Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setClientToDelete(null);
                }}
                disabled={deleting}
              >
                Annuler
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}