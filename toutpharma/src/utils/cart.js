// Calculs de panier — source unique de vérité.
// Ces deux réductions étaient dupliquées dans CartContext, whatsapp.js,
// generatePDF.js et CartSidebar.jsx.

/** Montant total estimé (les prix nuls / "sur devis" comptent pour 0). */
export const calculateTotal = (cart) =>
  cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 0), 0);

/** Nombre total d'articles (somme des quantités). */
export const calculateQuantity = (cart) =>
  cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
