
import { useRef } from "react";
import { PrinterIcon, DownloadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCMMB from "@/assets/logo-cmmb.png.jpeg";

type ReceiptType = "depot" | "retrait" | "compte";

type ReceiptData = {
  type: ReceiptType;
  nom: string;
  prenom: string;
  numero_compte: string;
  date: string;
  numero_transaction?: string;
  montant?: number;
  mode_paiement?: string;
  solde_apres?: number;
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getReceiptHTML = (logoBase64: string) => {
    const dateFormatee = new Date(data.date).toLocaleDateString("fr-FR");
    const dateOuverture = data.date_ouverture
      ? new Date(data.date_ouverture).toLocaleDateString("fr-FR")
      : "";

    const detailsHTML =
      data.type === "depot" || data.type === "retrait"
        ? `
          <div class="section-title">Détails de l'opération</div>
          <table>
            <tr>
              <td class="label">N° Transaction</td>
              <td class="value">${data.numero_transaction ?? "-"}</td>
              <td class="label">Mode de paiement</td>
              <td class="value">${modePaiementLabel[data.mode_paiement ?? ""] ?? data.mode_paiement ?? "-"}</td>
            </tr>
            <tr>
              <td class="label">Montant</td>
              <td class="value ${data.type === "depot" ? "green" : "red"}">
                ${data.type === "depot" ? "+" : "-"}${Number(data.montant).toLocaleString()} FCFA
              </td>
              <td class="label">Solde après opération</td>
              <td class="value blue">${Number(data.solde_apres).toLocaleString()} FCFA</td>
            </tr>
          </table>
        `
        : `
          <div class="section-title">Détails du compte</div>
          <table>
            <tr>
              <td class="label">Type de compte</td>
              <td class="value">${data.type_compte === "epargne_ordinaire" ? "Épargne ordinaire" : "Épargne à terme"}</td>
              <td class="label">Date d'ouverture</td>
              <td class="value">${dateOuverture}</td>
            </tr>
            <tr>
              <td class="label">Solde initial</td>
              <td class="value green">${Number(data.solde_initial).toLocaleString()} FCFA</td>
              <td></td><td></td>
            </tr>
          </table>
        `;

    const exemplaire = (mention: string) => `
      <div class="copie">
        <div class="badge">${mention}</div>
        <div class="header">
          ${logoBase64 ? `<img src="${logoBase64}" alt="CMMB" />` : ""}
          <p class="sub">Caisse du Mouvement Mutualiste Béninois (CMMB)</p>
          <p class="inst">Institution mutualiste d'épargne et de crédit</p>
          <p class="coord">C/718 Gbégamey, 02 BP 948 Cotonou, Bénin<br/>Tél : +229 01 56 35 19 95 — contact@cmmb.bj</p>
          <h1>${typeLabel(data.type)}</h1>
          <p class="date">Date : ${dateFormatee}</p>
        </div>
        <div class="section-title">Membre</div>
        <table>
          <tr>
            <td class="label">Nom & Prénom</td>
            <td class="value">${data.nom} ${data.prenom}</td>
            <td class="label">N° Compte</td>
            <td class="value">${data.numero_compte}</td>
          </tr>
        </table>
        <div class="divider"></div>
        ${detailsHTML}
        <div class="signatures">
          <div>Signature du client</div>
          <div>Signature de l'agent</div>
        </div>
        <div class="footer">
          <p>Institution agréée sous le n° L.02.0011.A du 04/01/2002 — Conservez ce reçu</p>
        </div>
      </div>
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; color: #111; font-size: 12px; }
            .copie { height: 141mm; padding: 6mm 12mm; overflow: hidden; position: relative; }
            .badge { position: absolute; top: 6mm; right: 12mm; border: 1px solid #333; padding: 2px 8px; font-size: 10px; font-weight: bold; }
            .header { text-align: center; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 10px; }
            .header img { height: 45px; display: block; margin: 0 auto 6px; }
            .header p.sub { font-size: 11px; color: #888; margin-bottom: 4px; }
            .header h1 { font-size: 15px; font-weight: bold; text-transform: uppercase; }
            .header p.inst { font-size: 10px; color: #555; margin-bottom: 2px; }
            .header p.coord { font-size: 10px; color: #777; margin-bottom: 6px; }
            .header p.date { font-size: 11px; color: #aaa; margin-top: 4px; }
            .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #888; margin: 10px 0 4px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 4px; vertical-align: top; }
            td.label { color: #666; font-size: 12px; width: 25%; }
            td.value { font-weight: 600; font-size: 13px; width: 25%; }
            .green { color: #15803d; }
            .red { color: #dc2626; }
            .blue { color: #1d4ed8; }
            .divider { border-top: 1px solid #ddd; margin: 10px 0; }
            .signatures { display: flex; justify-content: space-between; margin-top: 18px; font-size: 11px; color: #555; }
            .signatures div { width: 45%; border-top: 1px solid #999; padding-top: 4px; text-align: center; }
            .footer { text-align: center; font-size: 10px; color: #aaa; margin-top: 10px; }
            .cut { border-top: 2px dashed #999; text-align: center; font-size: 10px; color: #999; }
            @page { size: A4; margin: 0; }
          </style>
        </head>
        <body>
          ${exemplaire("COPIE CLIENT")}
          <div class="cut">✂ découper ici</div>
          ${exemplaire("COPIE AGENCE (ARCHIVE)")}
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const imgElement = document.querySelector("#receipt-preview-img") as HTMLImageElement;

    const convertToBase64 = (img: HTMLImageElement): string => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 200;
      canvas.height = img.naturalHeight || 80;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      return canvas.toDataURL("image/jpeg");
    };

    const logoBase64 = imgElement ? convertToBase64(imgElement) : "";

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(getReceiptHTML(logoBase64));
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <iframe ref={iframeRef} style={{ display: "none" }} title="print-frame" />

      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-700">Aperçu du reçu</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-2">
              <PrinterIcon className="w-4 h-4" />
              Imprimer
            </Button>
            <Button size="sm" onClick={handlePrint} className="bg-green-700 hover:bg-green-800 text-white flex items-center gap-2">
              <DownloadIcon className="w-4 h-4" />
              PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center space-y-2 border-b pb-4">
            <img
              id="receipt-preview-img"
              src={logoCMMB}
              alt="CMMB"
              className="h-14 mx-auto object-contain"
            />
            <p className="text-xs text-gray-500">Caisse du Mouvement Mutualiste Béninois</p>
            <h1 className="text-lg font-bold tracking-wide text-gray-800 uppercase">
              {typeLabel(data.type)}
            </h1>
            <p className="text-xs text-gray-400">Date : {new Date(data.date).toLocaleDateString("fr-FR")}</p>
          </div>

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
                  <div>
                    <p className="text-gray-500">Solde après opération</p>
                    <p className="font-bold text-base text-blue-700">
                      {Number(data.solde_apres).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </>
            )}

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

          <div className="border-t pt-3 text-center text-xs text-gray-400 space-y-1">
            <p>Ce reçu est généré automatiquement par le système Cmmbnet</p>
            <p>CMMB — Caisse du Mouvement Mutualiste Béninois</p>
            <p>L'impression produit deux exemplaires : copie client et copie agence.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
