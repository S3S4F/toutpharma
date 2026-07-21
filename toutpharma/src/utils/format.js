// Formatage partagé (dates, catégories).

/** Options d'affichage de date pour Intl.DateTimeFormat('fr-FR'). */
export const DATE_LONG = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export const DATE_MED = {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

/** Formate une date en français ; renvoie "Date invalide" si vide/illisible. */
export const formatDate = (dateString, options = DATE_MED) => {
  if (!dateString) return "Date invalide";
  // Les timestamps SQLite (created_at) sont en UTC au format
  // "YYYY-MM-DD HH:MM:SS" : on les marque explicitement UTC pour que
  // l'affichage soit à l'heure locale.
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)
    ? dateString.replace(" ", "T") + "Z"
    : dateString;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "Date invalide";
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
};

/** Liste dédupliquée des catégories présentes dans une liste de produits. */
export const uniqueCategories = (products) => [
  ...new Set(products.map((p) => p.category).filter(Boolean)),
];
