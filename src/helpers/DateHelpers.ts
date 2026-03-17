import { format } from "date-fns";
import { fr } from 'date-fns/locale/fr'

export class DateHelpers {
  static formatDate (dateString: string, newFormat: string = "dd MMM. yyyy HH:mm")  {
    const date = new Date(dateString);
    return format(date, newFormat);
  }
  static formatDateFr =(dateString: string|Date, newFormat: string = "dd MMM yyyy "):string=>  {
    const date = new Date(dateString);
    return format(date, newFormat,{ locale: fr });
  }

    static formatFullDate(date: string | Date, newFormat: string = "dd MMM. yyyy HH:mm"): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, newFormat);
  }


}