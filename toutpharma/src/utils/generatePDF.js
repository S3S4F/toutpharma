import jsPDF from 'jspdf';
import { calculateQuantity } from './cart';

const generateOrderNumber = () => {
    const now = new Date();
    const d = now.toISOString().slice(0, 10).replace(/-/g, '');
    const r = Math.floor(1000 + Math.random() * 9000);
    return `CMD-${d}-${r}`;
};

export const generateOrderPDF = (cart, client) => {
    const orderNumber = generateOrderNumber();
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const margin = 20;
    const pageW = 210;
    let y = 20;

    const line = () => {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageW - margin, y);
        y += 5;
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Titre
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 30);
    doc.text('BON DE COMMANDE', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`N° ${orderNumber}`, pageW - margin, y, { align: 'right' });

    y += 6;
    doc.setFontSize(9);
    doc.text(`Date : ${dateStr}`, pageW - margin, y, { align: 'right' });

    y += 8;
    line();

    // Infos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text('Client', margin, y);
    doc.text('Fournisseur', pageW / 2 + 5, y);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(client.name || 'Non renseigne', margin, y);
    doc.text('ToutPharma', pageW / 2 + 5, y);

    y += 5;
    doc.text(`Tel : ${client.phone || 'Non renseigne'}`, margin, y);
    doc.text('Tel : +221 77 288 35 00', pageW / 2 + 5, y);

    y += 5;
    doc.text('Dakar, Senegal', pageW / 2 + 5, y);

    y += 8;
    line();

    // En-tete tableau
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    doc.text('Designation', margin, y);
    doc.text('Categorie', margin + 85, y);
    doc.text('Qte', margin + 125, y);
    doc.text('Prix unit.', margin + 140, y);
    doc.text('Sous-total', margin + 162, y);

    y += 3;
    line();
    y -= 2;

    // Lignes produits
    let total = 0;
    let hasDevis = false;

    cart.forEach((item) => {
        if (y > 260) { doc.addPage(); y = 20; }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(40, 40, 40);

        const name = item.name.length > 42 ? item.name.slice(0, 40) + '..' : item.name;
        doc.text(name, margin, y);

        const cat = (item.category || '-').length > 18 ? item.category.slice(0, 16) + '..' : (item.category || '-');
        doc.text(cat, margin + 85, y);

        doc.text(String(item.quantity), margin + 128, y);

        const price = parseFloat(item.price) || 0;
        if (price) {
            const sub = price * item.quantity;
            total += sub;
            doc.text(`${price.toLocaleString('fr-FR')} F`, margin + 140, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`${sub.toLocaleString('fr-FR')} F`, margin + 162, y);
            doc.setFont('helvetica', 'normal');
        } else {
            hasDevis = true;
            doc.setTextColor(130, 130, 130);
            doc.text('Sur devis', margin + 140, y);
            doc.text('-', margin + 170, y);
            doc.setTextColor(40, 40, 40);
        }

        y += 7;
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, y - 2, pageW - margin, y - 2);
    });

    y += 4;

    // Total
    const totalQty = calculateQuantity(cart);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`References : ${cart.length}`, pageW - margin - 60, y);
    y += 5;
    doc.text(`Quantite totale : ${totalQty} unite${totalQty > 1 ? 's' : ''}`, pageW - margin - 60, y);
    y += 6;

    if (total > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        doc.text(`Total estime : ${total.toLocaleString('fr-FR')} FCFA`, pageW - margin - 60, y);
        if (hasDevis) {
            y += 5;
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(7);
            doc.setTextColor(130, 130, 130);
            doc.text('Certains articles sont sur devis et non inclus dans le total.', pageW - margin - 60, y);
        }
    } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Total : a confirmer (sur devis)', pageW - margin - 60, y);
    }

    y += 12;
    line();

    // Note
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Merci de confirmer la disponibilite et les delais de livraison.', margin, y);
    y += 5;
    doc.text('ToutPharma — Dakar, Senegal — +221 77 288 35 00', margin, y);

    doc.save(`BonCommande_${orderNumber}.pdf`);
    return orderNumber;
};
