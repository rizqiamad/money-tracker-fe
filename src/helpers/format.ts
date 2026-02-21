export const formatIDR = (val: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(val);

export const formatAngka = (value: string) => {
  if (!value) return "";
  const numberString = value.replace(/[^,\d]/g, "");
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// yyyy-mm-dd
export const formatDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
