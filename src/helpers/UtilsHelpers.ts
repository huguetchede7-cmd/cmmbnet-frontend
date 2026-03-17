import { format } from "date-fns";
import { fr } from 'date-fns/locale/fr'

export class UtilsHelpers {
  static formatDateToSQL = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  static  formatDateToSQL_2(dateString: string): string {
    const cleanDateString = dateString.replace(/\[.*\]/, "");
    const date = new Date(cleanDateString);
    return date.getFullYear() +
      "-" + String(date.getMonth() + 1).padStart(2, "0") +
      "-" + String(date.getDate()).padStart(2, "0") +
      " " + String(date.getHours()).padStart(2, "0") +
      ":" + String(date.getMinutes()).padStart(2, "0") +
      ":" + String(date.getSeconds()).padStart(2, "0");
  }

  static formatDate (dateString: string|Date, newFormat: string = "dd MMM yyyy ")  {
    const date = new Date(dateString);
    return format(date, newFormat,{ locale: fr });
  }

  static formatPhoneNumber(phoneNum: string): string | null {
    // Vérifier le format d'origine
    if (!/^\d{3}_\d+$/.test(phoneNum)) {
      return null; // Format incorrect
    }

    // Séparer le pays et le numéro
    const [countryCode, localNumber] = phoneNum.split('_');

    // Retourner le format souhaité
    return `+${countryCode} ${localNumber}`;
  }
 }