import { calculateTotal, calculateQuantity } from './cart';

// Ré-exporté pour compatibilité avec les imports existants.
export { calculateTotal };

export const formatWhatsAppMessage = (cart, client = {}, orderNumber = '') => {
    const phoneNumber = "221781669777";
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const total = calculateTotal(cart);
    const totalQty = calculateQuantity(cart);

    let msg = `BON DE COMMANDE - ToutPharma\n`;
    if (orderNumber) msg += `N° : ${orderNumber}\n`;
    msg += `Date : ${date}\n\n`;

    msg += `CLIENT\n`;
    msg += `Nom : ${client.name || 'Non renseigne'}\n`;
    msg += `Tel : ${client.phone || 'Non renseigne'}\n\n`;

    msg += `PRODUITS (${totalQty} article${totalQty > 1 ? 's' : ''})\n`;
    msg += `${'─'.repeat(30)}\n`;

    cart.forEach((item, i) => {
        const price = parseFloat(item.price) || 0;
        msg += `${i + 1}. ${item.name}\n`;
        msg += `   Qte : ${item.quantity}`;
        if (price) {
            msg += ` | ${(price * item.quantity).toLocaleString('fr-FR')} FCFA`;
        } else {
            msg += ` | Sur devis`;
        }
        msg += '\n';
    });

    msg += `${'─'.repeat(30)}\n`;

    if (total > 0) {
        msg += `Total estime : ${total.toLocaleString('fr-FR')} FCFA\n`;
    } else {
        msg += `Total : a confirmer\n`;
    }

    msg += `\nMerci de confirmer la disponibilite et les delais.\nToutPharma`;

    return {
        url: `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`,
    };
};
