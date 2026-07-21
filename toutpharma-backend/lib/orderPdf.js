// Génération du bon de commande PDF côté serveur (pdfkit).
// Le PDF est écrit dans uploads/orders/ et servi statiquement : le lien peut
// donc être partagé dans le message WhatsApp et retéléchargé depuis l'admin.
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// toLocaleString('fr-FR') insère une espace fine insécable (U+202F) que les
// polices standard de pdfkit ne savent pas encoder — on la remplace par une
// espace classique.
const FCFA = (n) =>
    `${Number(n).toLocaleString('fr-FR').replace(/[\u202F\u00A0]/g, ' ')} FCFA`;

/**
 * Génère le PDF du bon de commande.
 * @returns {Promise<string>} le nom de fichier généré (relatif à uploads/orders/)
 */
const generateOrderPdf = ({ orderNumber, clientName, phone, items, total, pharmacyPhone, outputDir }) => {
    return new Promise((resolve, reject) => {
        const fileName = `BonCommande_${orderNumber}.pdf`;
        const filePath = path.join(outputDir, fileName);
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        const pageW = doc.page.width;
        const margin = 50;
        const contentW = pageW - margin * 2;
        const dateStr = new Date().toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });

        const hr = () => {
            doc.moveTo(margin, doc.y).lineTo(pageW - margin, doc.y)
                .strokeColor('#c8c8c8').lineWidth(0.7).stroke();
            doc.moveDown(0.5);
        };

        // En-tête
        doc.font('Helvetica-Bold').fontSize(18).fillColor('#1e1e1e')
            .text('BON DE COMMANDE', margin, 50);
        doc.font('Helvetica').fontSize(9).fillColor('#646464')
            .text(`N° ${orderNumber}`, margin, 54, { width: contentW, align: 'right' })
            .text(`Date : ${dateStr}`, margin, 66, { width: contentW, align: 'right' });
        doc.moveDown(1.5);
        hr();

        // Blocs client / fournisseur
        const blockTop = doc.y;
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#1e1e1e')
            .text('Client', margin, blockTop)
            .text('Fournisseur', pageW / 2, blockTop);
        doc.font('Helvetica').fillColor('#3c3c3c')
            .text(clientName || 'Non renseigné', margin, blockTop + 14)
            .text(`Tél : ${phone}`, margin, blockTop + 27)
            .text('ToutPharma', pageW / 2, blockTop + 14)
            .text(`Tél : ${pharmacyPhone}`, pageW / 2, blockTop + 27)
            .text('Dakar, Sénégal', pageW / 2, blockTop + 40);
        doc.y = blockTop + 58;
        hr();

        // Tableau des produits
        const cols = { name: margin, cat: margin + 220, qty: margin + 330, unit: margin + 370, sub: margin + 435 };
        const headerY = doc.y;
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#1e1e1e')
            .text('Désignation', cols.name, headerY, { width: 210 })
            .text('Catégorie', cols.cat, headerY, { width: 100 })
            .text('Qté', cols.qty, headerY)
            .text('Prix unit.', cols.unit, headerY)
            .text('Sous-total', cols.sub, headerY);
        doc.y = headerY + 12;
        hr();

        let total_ = 0;
        let hasDevis = false;

        items.forEach((item) => {
            if (doc.y > doc.page.height - 120) doc.addPage();
            const rowY = doc.y;
            const price = parseFloat(item.price) || 0;

            doc.font('Helvetica').fontSize(8).fillColor('#282828')
                .text(String(item.name).slice(0, 70), cols.name, rowY, { width: 210 })
                .text(String(item.category || '-').slice(0, 24), cols.cat, rowY, { width: 100 })
                .text(String(item.quantity), cols.qty, rowY);

            if (price) {
                const sub = price * item.quantity;
                total_ += sub;
                doc.text(FCFA(price).replace(' FCFA', ' F'), cols.unit, rowY);
                doc.font('Helvetica-Bold').text(FCFA(sub).replace(' FCFA', ' F'), cols.sub, rowY);
            } else {
                hasDevis = true;
                doc.fillColor('#828282').text('Sur devis', cols.unit, rowY).text('-', cols.sub, rowY);
            }

            doc.y = rowY + Math.max(doc.heightOfString(String(item.name).slice(0, 70), { width: 210 }), 10) + 6;
            doc.moveTo(margin, doc.y - 3).lineTo(pageW - margin, doc.y - 3)
                .strokeColor('#e6e6e6').lineWidth(0.5).stroke();
        });

        // Totaux
        doc.moveDown(0.8);
        const totalQty = items.reduce((s, i) => s + (i.quantity || 0), 0);
        doc.font('Helvetica').fontSize(9).fillColor('#505050')
            .text(`Références : ${items.length}`, cols.unit - 30, doc.y)
            .text(`Quantité totale : ${totalQty} unité${totalQty > 1 ? 's' : ''}`, cols.unit - 30, doc.y + 2);

        doc.moveDown(0.5);
        if (total > 0 || total_ > 0) {
            doc.font('Helvetica-Bold').fontSize(11).fillColor('#1e1e1e')
                .text(`Total estimé : ${FCFA(total || total_)}`, cols.unit - 30, doc.y);
            if (hasDevis) {
                doc.font('Helvetica-Oblique').fontSize(7).fillColor('#828282')
                    .text('Certains articles sont sur devis et non inclus dans le total.', cols.unit - 30, doc.y + 3);
            }
        } else {
            doc.font('Helvetica-Oblique').fontSize(9).fillColor('#646464')
                .text('Total : à confirmer (sur devis)', cols.unit - 30, doc.y);
        }

        // Pied de page
        doc.moveDown(1.5);
        doc.x = margin;
        hr();
        doc.font('Helvetica-Oblique').fontSize(8).fillColor('#787878')
            .text('Merci de confirmer la disponibilité et les délais de livraison.', margin)
            .text(`ToutPharma — Dakar, Sénégal — ${pharmacyPhone}`, margin);

        doc.end();
        stream.on('finish', () => resolve(fileName));
        stream.on('error', reject);
    });
};

module.exports = { generateOrderPdf };
