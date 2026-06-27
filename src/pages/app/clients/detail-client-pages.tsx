import { useAuth } from "@/lib/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon, PhoneIcon, MapPinIcon, CreditCardIcon, FileTextIcon, ArrowLeftIcon, WalletIcon, Trash2Icon } from "lucide-react";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";
import { routeHelpers } from "@/helpers/routeHelpers.ts";

type Client = {
  id: string;
  last_name: string;
  first_name: string;
  primary_phone: string;
  secondary_phone: string;
  city: string;
  address: string;
  neighborhood: string;
  district: string;
  account_type: string;
  status: string;
  join_date: string;
  member_number: string;
  gender: string;
  birth_date: string;
  profession: string;
  id_document_type: string;
  id_document_number: string;
  photo: string;
};

type Compte = {
  id: string;
  numero_compte: string;
  type_compte: string;
  solde: number;
  status: string;
  date_ouverture: string;
};

const isActive = (status: string) => status === "active" || status === "Active";

export default function DetailClientPages() {
  const { user } = useAuth();
  const isAdmin = ((user as any)?.roles ?? []).some((r: any) => r?.slug === 'admin');
  const isSavingsOfficer = ((user as any)?.roles ?? []).some((r: any) => r?.slug === 'savings_officer');
  const canEdit = isAdmin || isSavingsOfficer;
  const canDelete = isAdmin;
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [comptes, setComptes] = useState<Compte[]>([]);

  // États pour le modal de suppression de compte
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [compteToDelete, setCompteToDelete] = useState<Compte | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClient = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.clients.show}/${id}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setClient(response?.data ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComptes = async () => {
    try {
      const response = await apiService.get(
        { url: `${apiRoutes.admin.app.comptes.byClient}/${id}` },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setComptes(response?.data ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClient();
    fetchComptes();
  }, [id]);

  // Ouvrir le modal
  const openDeleteModal = (e: React.MouseEvent, compte: Compte) => {
    e.stopPropagation();
    setCompteToDelete(compte);
    setShowDeleteModal(true);
  };

  // Confirmer la suppression du compte
  const handleDeleteConfirm = async () => {
    if (!compteToDelete) return;
    setDeleting(true);
    try {
      await apiService.delete(
        { url: `${apiRoutes.admin.app.comptes.list}/${compteToDelete.id}` },
        { userToken: user?.token ?? "" }
      );
      setShowDeleteModal(false);
      setCompteToDelete(null);
      fetchComptes(); // Recharger la liste des comptes
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="p-6 text-sm text-muted-foreground">Chargement...</p>;
  if (!client) return <p className="p-6 text-sm text-muted-foreground">Membre introuvable.</p>;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
  <Button variant="outline" size="sm" onClick={() => navigate(routeHelpers.dashboard.clients.index)}>
    <ArrowLeftIcon className="w-4 h-4 mr-2" />
    Retour
  </Button>
  {canEdit && (
    <Button
      variant="outline"
      size="sm"
      className="text-green-700 border-green-300 hover:bg-green-50"
      onClick={() => navigate(`/dashboard/clients/edit/${client.id}`)}
    >
      Modifier
    </Button>
  )}
  <h1 className="text-2xl font-bold tracking-tight">
    {client.last_name} {client.first_name}
  </h1>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive(client.status)
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {isActive(client.status) ? "Actif" : "Inactif"}
          </span>
        </div>
      </div>

      <Button
        className="bg-green-700 hover:bg-green-800 text-white"
        onClick={() => navigate(`${routeHelpers.dashboard.comptes.create}?client_id=${client.id}`)}
      >
        <WalletIcon className="w-4 h-4 mr-2" />
        Ouvrir un compte
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Informations personnelles */}
        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-green-700" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {client.photo && (
              <div className="mb-4">
                <img
                  src={`${genralConfig.apiUrl}/${client.photo}`}
                  alt="Photo client"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              </div>
            )}
            <p><span className="font-medium text-gray-700">N° membre :</span> {client.member_number}</p>
            <p><span className="font-medium text-gray-700">Nom :</span> {client.last_name}</p>
            <p><span className="font-medium text-gray-700">Prénom :</span> {client.first_name}</p>
            <p><span className="font-medium text-gray-700">Date de naissance :</span> {client.birth_date}</p>
            <p><span className="font-medium text-gray-700">Sexe :</span> {client.gender === "M" ? "Masculin" : "Féminin"}</p>
            <p><span className="font-medium text-gray-700">Profession :</span> {client.profession || "Non renseigné"}</p>
          </CardContent>
        </Card>

        {/* Coordonnées */}
        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-green-700" />
              Coordonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="font-medium text-gray-700">Adresse :</span> {client.address}</p>
            <p><span className="font-medium text-gray-700">Quartier :</span> {client.neighborhood}</p>
            <p><span className="font-medium text-gray-700">Arrondissement :</span> {client.district}</p>
            <p><span className="font-medium text-gray-700">Ville :</span> {client.city}</p>
            <p className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-green-700" />
              <span className="font-medium text-gray-700">Tél. principal :</span> {client.primary_phone}
            </p>
            {client.secondary_phone && (
              <p className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-700">Tél. secondaire :</span> {client.secondary_phone}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Informations d'adhésion */}
        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CreditCardIcon className="w-4 h-4 text-green-700" />
              Informations d'adhésion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="font-medium text-gray-700">Date d'adhésion :</span> {client.join_date}</p>
            <p><span className="font-medium text-gray-700">Statut :</span> {isActive(client.status) ? "Actif" : "Inactif"}</p>
          </CardContent>
        </Card>

        {/* Pièce d'identité */}
        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileTextIcon className="w-4 h-4 text-green-700" />
              Pièce d'identité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="font-medium text-gray-700">Type de pièce :</span> {client.id_document_type}</p>
            <p><span className="font-medium text-gray-700">Numéro :</span> {client.id_document_number}</p>
          </CardContent>
        </Card>

        {/* Comptes du membre */}
        <Card className="border border-gray-200 shadow-none md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <WalletIcon className="w-4 h-4 text-green-700" />
              Comptes ({comptes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {comptes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun compte ouvert.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-3 px-4">N° Compte</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Solde</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4">Date d'ouverture</th>
                      {canDelete && (
                        <th className="py-3 px-4">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {comptes.map((compte) => (
                      <tr
                        key={compte.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/dashboard/comptes/detail/${compte.id}`)}
                      >
                        <td className="py-3 px-4 font-medium">{compte.numero_compte}</td>
                        <td className="py-3 px-4">{compte.type_compte}</td>
                        <td className="py-3 px-4 font-medium text-green-700">
                          {Number(compte.solde).toLocaleString()} FCFA
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isActive(compte.status)
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {isActive(compte.status) ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td className="py-3 px-4">{compte.date_ouverture}</td>
                        {canDelete && (
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={(e) => openDeleteModal(e, compte)}
                            >
                              <Trash2Icon className="w-4 h-4" />
                            </Button>
                          </td>
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

      {/* Modal de confirmation suppression compte */}
      {showDeleteModal && compteToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-bold mb-2">Confirmer la suppression</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Vous êtes sur le point de supprimer le compte{" "}
              <span className="font-semibold text-black">
                {compteToDelete.numero_compte}
              </span>{" "}
              ({compteToDelete.type_compte}). Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCompteToDelete(null);
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