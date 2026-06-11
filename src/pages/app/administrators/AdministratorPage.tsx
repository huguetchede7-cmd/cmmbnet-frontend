import { useState, useEffect } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Calendar, Search, Trash2 } from "lucide-react";
import apiService from "@/api/apiService";
import apiRoutes from "@/api/apiRoutes";
import { useAuth } from "@/lib/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TinyAvatar } from '@/components/useful/AdvancedAvatar'
import { UtilsHelpers } from "@/helpers/UtilsHelpers";
import { routeHelpers } from "@/helpers/routeHelpers.ts";
import { useNavigate } from "react-router-dom";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { genralConfig } from '../../../../config.ts'
import { AutoShowDialog } from "@/components/ui/my-alert-dialog.tsx";

export type UserProfile = {
  id: number;
  avatar: string;
  created_at: string;
  firstname: string;
  lastname: string | null;
  email: string;
  phone: string | null;
  ban_statut: boolean;
  client_ref: string;
  email_verified_at: string | null;
};

type PaginationState = {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
};

export default function AdministratorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const itemsPerPageOptions = [4, 10, 20, 50];

  const [usersListe, setUserList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
        {
          url: apiRoutes.admin.app.administrator.list,
          params: {
            limit: pagination.itemsPerPage,
            page: pagination.currentPage,
            search: searchTerm,
          }
        },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setUserList(response.data.list || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination?.lastPage ?? 1,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    } finally {
      setLoading(false);
    }
  };

   const handleDelete = async () => {
   if (!userToDelete) return;
   try {
    await apiService.delete(
      { url: `${apiRoutes.admin.app.administrator.delete}/${userToDelete.id}` },
      { userToken: user?.token ?? "" }
    );
    setUserToDelete(null);
    fetchUsers();
   } catch (error) {
    console.error("Erreur lors de la suppression", error);
    setUserToDelete(null);
   }
   };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm]);

  const getPaginationPages = () => {
    const { currentPage, totalPages } = pagination;
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">

      {/* Modal confirmation suppression */}
      {userToDelete && (
        <AutoShowDialog
          title="Supprimer l'utilisateur"
          titleClass="text-red-500"
          message={`Voulez-vous vraiment supprimer ${userToDelete.firstname} ${userToDelete.lastname} ?`}
          onSuccess={handleDelete}
          successBtnClass="bg-red-500 hover:bg-red-600 text-white"
          onCancel={() => setUserToDelete(null)}
          onDismiss={() => setUserToDelete(null)}
          cancelBtnText="Annuler"
          successBtnText="Supprimer"
        />
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des administrateurs</h1>
          <p className="text-muted-foreground">Gérez et consultez les administrateurs</p>
        </div>
        <Button onClick={() => navigate(routeHelpers.dashboard.administrator.create)}>
          Ajouter un admin
        </Button>
      </div>

      {/* Tableau */}
      <Card className="rounded">
        <CardHeader>
          <CardTitle>Liste des colaborateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded border">
            <Table>
              <TableHeader>
                <TableRow className="bg-black text-white hover:bg-black">
                  <TableHead className="text-white">Utilisateur</TableHead>
                  <TableHead className="text-white text-nowrap">Status</TableHead>
                  <TableHead className="text-white">Contact</TableHead>
                  <TableHead className="text-white text-center text-nowrap">Date d'inscription</TableHead>
                  <TableHead className="text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersListe.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-12 w-12 opacity-50 mb-3" />
                        <p>Aucun utilisateur trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  usersListe.filter(item => item.id != 1).map(u => (
                    <TableRow
                      key={u.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell
                        className="cursor-pointer"
                        onClick={() => navigate(`${routeHelpers.dashboard.administrator.show}/${u.id}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <TinyAvatar
                            image={
                              u?.avatar &&
                              !u.avatar.includes("default_profil.jpg") &&
                              u.avatar !== genralConfig.imageStoragePrefix
                                ? u.avatar
                                : null
                            }
                            name={`${u.lastname || ''} ${u.firstname}`}
                            size="md"
                          />
                          <div className="flex flex-col max-w-[250px]">
                            <span className="font-medium truncate">{u.firstname} {u.lastname}</span>
                            <span className="text-xs text-muted-foreground truncate">@client</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        {u.email_verified_at && u.ban_statut ? (
                          <span className="px-1 py-0.5 text-xs text-red-600 bg-red-100 rounded">Banni</span>
                        ) : u.email_verified_at && !u.ban_statut ? (
                          <span className="px-1 py-0.5 text-xs text-green-600 bg-green-100 rounded">Actif</span>
                        ) : (
                          <span className="px-1 py-0.5 text-xs text-yellow-600 bg-yellow-100 rounded">Non vérifiés</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p>{u.email}</p>
                          {u.phone && <p className="text-xs text-muted-foreground">{UtilsHelpers.formatPhoneNumber(u.phone)}</p>}
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-sm text-muted-foreground text-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {UtilsHelpers.formatDate(u.created_at, 'dd/MM/yyyy à HH:mm')}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1 rounded hover:bg-red-100 text-red-500"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 gap-2 py-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Page {pagination.currentPage} sur {pagination.totalPages}</span>
              <Select
                value={pagination.itemsPerPage.toString()}
                onValueChange={(value) =>
                  setPagination(prev => ({ ...prev, itemsPerPage: Number(value), currentPage: 1 }))
                }
              >
                <SelectTrigger className="w-24 text-xs p-1 h-7 rounded">
                  <SelectValue placeholder="Éléments par page" />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  {itemsPerPageOptions.map(opt => (
                    <SelectItem key={opt} value={opt.toString()}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-end mt-4 gap-2 flex-wrap">
                <Button
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                >
                  Précédent
                </Button>
                {getPaginationPages().map((page, idx) =>
                  page === "..." ? (
                    <span key={idx} className="px-2">...</span>
                  ) : (
                    <button
                      key={idx}
                      style={{
                        backgroundColor: page === pagination.currentPage ? "#000000" : "#ffffff",
                        color: page === pagination.currentPage ? "#ffffff" : "#000000"
                      }}
                      className="px-2 py-1 rounded-md border border-gray-300 border-2"
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: Number(page) }))}
                    >
                      {page}
                    </button>
                  )
                )}
                <Button
                  size="sm"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}