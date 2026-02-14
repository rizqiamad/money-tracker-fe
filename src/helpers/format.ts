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
