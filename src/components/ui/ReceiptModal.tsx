import { PrinterIcon, DownloadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCMMB from "@/assets/logo-cmmb.png.jpeg";

type ReceiptType = "depot" | "retrait" | "compte";

type ReceiptData = {
  type: ReceiptType;
  // Commun
  nom: string;
  prenom: string;
  numero_compte: string;
  date: string;
  // Dépôt / Retrait
  numero_transaction?: string;
  montant?: number;
  mode_paiement?: string;
  solde_apres?: number;
  // Compte
  type_compte?: string;
  date_ouverture?: string;
  solde_initial?: number;
};

type Props = {
  data: ReceiptData;
  onClose: () => void;
};

const typeLabel = (type: ReceiptType) => {
  if (type === "depot") return "REÇU DE DÉPÔT";
  if (type === "retrait") return "REÇU DE RETRAIT";
  return "REÇU D'OUVERTURE DE COMPTE";
};

const modePaiementLabel: Record<string, string> = {
  especes: "Espèces",
  mobile_money: "Mobile Money",
  virement: "Virement bancaire",
  cheque: "Chèque",
};

export default function ReceiptModal({ data, onClose }: Props) {
  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    window.print(); // Le navigateur propose PDF comme option d'impression
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl">

        {/* Boutons d'action */}
        <div className="flex justify-between items-center px-6 py-4 border-b print:hidden">
          <h2 className="font-semibold text-gray-700">Aperçu du reçu</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <PrinterIcon className="w-4 h-4" />
              Imprimer
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              className="bg-green-700 hover:bg-green-800 text-white flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
            <XIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Contenu du reçu */}
        <div id="receipt-content" className="p-6 space-y-4">

          {/* En-tête */}
          <div className="text-center space-y-2 border-b pb-4">
            <img src={logoCMMB} alt="CMMB" className="h-14 mx-auto object-contain" />
            <p className="text-xs text-gray-500">Caisse du Mouvement Mutualiste Béninois</p>
            <h1 className="text-lg font-bold tracking-wide text-gray-800 uppercase">
              {typeLabel(data.type)}
            </h1>
            <p className="text-xs text-gray-400">Date : {new Date(data.date).toLocaleDateString("fr-FR")}</p>
          </div>

          {/* Informations membre */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase">Membre</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Nom & Prénom</p>
                <p className="font-medium">{data.nom} {data.prenom}</p>
              </div>
              <div>
                <p className="text-gray-500">N° Compte</p>
                <p className="font-medium">{data.numero_compte}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-3 space-y-2">
            {/* Reçu dépôt / retrait */}
            {(data.type === "depot" || data.type === "retrait") && (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase">Détails de l'opération</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">N° Transaction</p>
                    <p className="font-medium">{data.numero_transaction}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Mode de paiement</p>
                    <p className="font-medium">{modePaiementLabel[data.mode_paiement ?? ""] ?? data.mode_paiement}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Montant</p>
                    <p className={`font-bold text-base ${data.type === "depot" ? "text-green-700" : "text-red-600"}`}>
                      {data.type === "depot" ? "+" : "-"}{Number(data.montant).toLocaleString()} FCFA
                    </p>
                  </div>
                  
                </div>
              </>
            )}

            {/* Reçu ouverture de compte */}
            {data.type === "compte" && (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase">Détails du compte</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Type de compte</p>
                    <p className="font-medium">
                      {data.type_compte === "epargne_ordinaire" ? "Épargne ordinaire" : "Épargne à terme"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date d'ouverture</p>
                    <p className="font-medium">{new Date(data.date_ouverture!).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Solde initial</p>
                    <p className="font-bold text-green-700">{Number(data.solde_initial).toLocaleString()} FCFA</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Pied de page */}
          <div className="border-t pt-3 text-center text-xs text-gray-400 space-y-1">
            <p>Ce reçu est généré automatiquement par le système Cmmbnet</p>
            <p>CMMB — Caisse du Mouvement Mutualiste Béninois</p>
          </div>
        </div>

      </div>
    </div>
  );
}