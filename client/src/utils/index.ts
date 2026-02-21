import { format } from "date-fns";
import { th } from "date-fns/locale";

export const formatDateToThai = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      // ปีพ.ศ. คือ ค.ศ. + 543
      const year = date.getFullYear() + 543;
      const formattedDate = format(date, "d MMM", { locale: th });
      return `${formattedDate} ${year}`;
    } catch {
      return dateString;
    }
  };