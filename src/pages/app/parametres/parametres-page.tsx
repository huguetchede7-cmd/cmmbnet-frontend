import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  SettingsIcon, PlusIcon, Trash2Icon, ShieldIcon,
  UserIcon, EyeIcon, EyeOffIcon, BuildingIcon, KeyIcon,
} from "lucide-react";
import apiService from "@/api/apiService.ts";
import apiRoutes from "@/api/apiRoutes.ts";

type Utilisateur = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  ban_statut: boolean;
  created_at: string;
};

type Role = {
  id: number;
  title: string;
  slug: string;
};

export default function ParametresPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"utilisateurs" | "institution" | "securite">("utilisateurs");

  // ===== UTILISATEURS =====
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editUser, setEditUser] = useState<Utilisateur | null>(null);
  const [formData, setFormData] = useState({
    firstname: "", lastname: "", email: "", password: "", role_ids: [] as number[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Utilisateur | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ===== MOT DE PASSE =====
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const fetchUtilisateurs = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
        { url: apiRoutes.admin.app.administrator.list },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setUtilisateurs(response?.data?.list ?? []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const fetchRoles = async () => {
    try {
      const response = await apiService.get(
        { url: apiRoutes.admin.app.roles.list },
        { userToken: user?.token ?? "", hasNoSuccessModal: true }
      );
      setRoles(response?.data ?? []);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchUtilisateurs();
    fetchRoles();
  }, []);

  const openCreateModal = () => {
    setEditUser(null);
    setFormData({ firstname: "", lastname: "", email: "", password: "", role_ids: [] });
    setShowFormModal(true);
  };

  const openEditModal = (u: Utilisateur) => {
    setEditUser(u);
    setFormData({ firstname: u.firstname, lastname: u.lastname, email: u.email, password: "", role_ids: [] });
    setShowFormModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editUser) {
        await apiService.put(
          { url: `${apiRoutes.admin.app.administrator.update}/${editUser.id}`, body: formData },
          { userToken: user?.token ?? "" }
        );
      } else {
        await apiService.post(
          { url: apiRoutes.admin.app.administrator.create, body: formData },
          { userToken: user?.token ?? "" }
        );
      }
      setShowFormModal(false);
      fetchUtilisateurs();
    } catch (error) {
      apiService.handleError(error as string);
    } finally { setSaving(false); }
  };

  const handleToggleBlock = async (u: Utilisateur) => {
    try {
      const url = u.ban_statut
        ? `${apiRoutes.admin.app.administrator.unblock}/${u.id}`
        : `${apiRoutes.admin.app.administrator.block}/${u.id}`;
      await apiService.put({ url }, { userToken: user?.token ?? "" });
      fetchUtilisateurs();
    } catch (error) { console.error(error); }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await apiService.delete(
        { url: `${apiRoutes.admin.app.administrator.delete}/${userToDelete.id}` },
        { userToken: user?.token ?? "" }
      );
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUtilisateurs();
    } catch (error) { console.error(error); }
    finally { setDeleting(false); }
  };

  const toggleRole = (roleId: number) => {
    setFormData((prev) => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter((id) => id !== roleId)
        : [...prev.role_ids, roleId],
    }));
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setSavingPassword(true);
    try {
      await apiService.put(
        {
          url: `${apiRoutes.admin.app.administrator.update}/${(user as any)?.id}`,
          body: { password: newPassword },
        },
        { userToken: user?.token ?? "" }
      );
      setPasswordSuccess("Mot de passe modifié avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError("Erreur lors de la modification du mot de passe.");
    } finally { setSavingPassword(false); }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-green-700" />
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {[
          { key: "utilisateurs", label: "Gestion des utilisateurs", icon: <ShieldIcon className="w-4 h-4" /> },
          { key: "institution", label: "Informations de l'institution", icon: <BuildingIcon className="w-4 h-4" /> },
          { key: "securite", label: "Sécurité", icon: <KeyIcon className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== ONGLET UTILISATEURS ===== */}
      {activeTab === "utilisateurs" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldIcon className="w-4 h-4 text-green-700" />
              Collaborateurs ({utilisateurs.length})
            </CardTitle>
            <Button onClick={openCreateModal} className="bg-green-700 hover:bg-green-800 text-white">
              <PlusIcon className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Chargement...</p>
            ) : utilisateurs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun utilisateur trouvé.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-3 px-4">Nom</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4">Date création</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utilisateurs.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            {u.lastname} {u.firstname}
                          </div>
                        </td>
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.ban_statut ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}>
                            {u.ban_statut ? "Bloqué" : "Actif"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditModal(u)}>
                              Modifier
                            </Button>
                            <Button
                              variant="outline" size="sm"
                              className={u.ban_statut ? "text-green-600 border-green-200" : "text-orange-600 border-orange-200"}
                              onClick={() => handleToggleBlock(u)}
                            >
                              {u.ban_statut ? "Débloquer" : "Bloquer"}
                            </Button>
                            <Button
                              variant="outline" size="sm"
                              className="text-red-600 hover:bg-red-50 border-red-200"
                              onClick={() => { setUserToDelete(u); setShowDeleteModal(true); }}
                            >
                              <Trash2Icon className="w-4 h-4" />
                            </Button>
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
      )}

      {/* ===== ONGLET INSTITUTION ===== */}
      {activeTab === "institution" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BuildingIcon className="w-4 h-4 text-green-700" />
              Informations de l'institution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Nom de l'institution</p>
                <p className="font-semibold">Caisse du Mouvement Mutualiste Béninois</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Sigle</p>
                <p className="font-semibold">CMMB</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Adresse</p>
                <p className="font-semibold">Gbégamey, Rue 11.036, Cotonou, Bénin</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                <p className="font-semibold">+229 XX XX XX XX</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="font-semibold">contact@cmmb.bj</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Plateforme</p>
                <p className="font-semibold">Cmmbnet v1.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== ONGLET SÉCURITÉ ===== */}
      {activeTab === "securite" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <KeyIcon className="w-4 h-4 text-green-700" />
              Changer mon mot de passe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-medium">Mot de passe actuel</label>
              <Input
                type="password"
                className="mt-1"
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nouveau mot de passe</label>
              <Input
                type="password"
                className="mt-1"
                placeholder="Nouveau mot de passe (min. 8 caractères)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Confirmer le nouveau mot de passe</label>
              <Input
                type="password"
                className="mt-1"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}
            <Button
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={handleChangePassword}
              disabled={savingPassword}
            >
              {savingPassword ? "Enregistrement..." : "Modifier le mot de passe"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal Créer / Modifier */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Prénom</label>
                <Input placeholder="Prénom" value={formData.firstname}
                  onChange={(e) => setFormData((p) => ({ ...p, firstname: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nom</label>
                <Input placeholder="Nom" value={formData.lastname}
                  onChange={(e) => setFormData((p) => ({ ...p, lastname: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input placeholder="Email" type="email" value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mot de passe {editUser && "(laisser vide pour ne pas changer)"}
                </label>
                <div className="relative mt-1">
                  <Input placeholder="Mot de passe" type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {roles.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Rôle(s)</label>
                  <div className="mt-2 space-y-2">
                    {roles.map((role) => (
                      <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.role_ids.includes(role.id)}
                          onChange={() => toggleRole(role.id)} className="w-4 h-4 accent-green-600" />
                        <span className="text-sm text-gray-700">{role.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowFormModal(false)} disabled={saving}>Annuler</Button>
              <Button className="bg-green-700 hover:bg-green-800 text-white" onClick={handleSave} disabled={saving}>
                {saving ? "Enregistrement..." : editUser ? "Modifier" : "Créer"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-bold mb-2">Confirmer la suppression</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Vous êtes sur le point de supprimer{" "}
              <span className="font-semibold text-black">{userToDelete.lastname} {userToDelete.firstname}</span>.
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }} disabled={deleting}>
                Annuler
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}