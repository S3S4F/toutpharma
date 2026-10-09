// Notification WhatsApp « nouvelle commande » — deux fournisseurs possibles,
// entièrement OPTIONNELLE : sans configuration, rien ne change (le client
// envoie lui-même le message wa.me pré-rempli, la commande est de toute façon
// déjà persistée en base).
//
// 1) Passerelle OpenWA auto-hébergée (github.com/rmyndharis/OpenWA) — SANS
//    passer par Meta. ⚠️ Clients rétro-conçus : risque non nul de bannissement
//    du numéro ÉMETTEUR → utiliser un numéro secondaire dédié, jamais le
//    numéro principal de la pharmacie.
//      WHATSAPP_GATEWAY_URL      ex. http://openwa:2785
//      WHATSAPP_GATEWAY_KEY      clé API (rôle operator, scopée à la session)
//      WHATSAPP_GATEWAY_SESSION  id de la session OpenWA connectée
//
// 2) API OFFICIELLE Meta Cloud (zéro risque de ban, nécessite un compte Meta) :
//      WHATSAPP_CLOUD_TOKEN      token d'accès (app WhatsApp Business)
//      WHATSAPP_PHONE_NUMBER_ID  id du numéro expéditeur (console Meta)
//      WHATSAPP_TEMPLATE_NAME    optionnel : template approuvé à 3 variables
//                                ({{1}} n° commande, {{2}} client, {{3}} PDF)
//
// Commun :
//      WHATSAPP_NOTIFY_TO        numéro destinataire (international sans +)
const GATEWAY_URL = (process.env.WHATSAPP_GATEWAY_URL || '').replace(/\/+$/, '');
const GATEWAY_KEY = process.env.WHATSAPP_GATEWAY_KEY;
const GATEWAY_SESSION = process.env.WHATSAPP_GATEWAY_SESSION;
const CLOUD_TOKEN = process.env.WHATSAPP_CLOUD_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME;
const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0';
const NOTIFY_TO = (process.env.WHATSAPP_NOTIFY_TO || '').replace(/[^0-9]/g, '');

const gatewayConfigured = () => Boolean(GATEWAY_URL && GATEWAY_KEY && GATEWAY_SESSION && NOTIFY_TO);
const cloudConfigured = () => Boolean(CLOUD_TOKEN && PHONE_NUMBER_ID && NOTIFY_TO);
const isConfigured = () => gatewayConfigured() || cloudConfigured();

const postJson = async (url, headers, body) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error?.message || data.message || `HTTP ${res.status}`);
    return data;
};

const orderText = ({ orderNumber, clientName, phone, totalQty, pdfUrl }) => {
    const lines = [
        `🟢 Nouvelle commande ${orderNumber}`,
        `Client : ${clientName || 'Non renseigné'} — ${phone}`,
        `Articles : ${totalQty}`,
    ];
    if (pdfUrl) lines.push(`Bon de commande : ${pdfUrl}`);
    return lines.join('\n');
};

const sendViaGateway = (order) =>
    postJson(
        `${GATEWAY_URL}/api/sessions/${encodeURIComponent(GATEWAY_SESSION)}/messages/send-text`,
        { 'X-API-Key': GATEWAY_KEY },
        { chatId: `${NOTIFY_TO}@c.us`, text: orderText(order) }
    );

const sendViaCloud = (order) => {
    const base = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;
    const headers = { Authorization: `Bearer ${CLOUD_TOKEN}` };
    if (TEMPLATE_NAME) {
        return postJson(base, headers, {
            messaging_product: 'whatsapp',
            to: NOTIFY_TO,
            type: 'template',
            template: {
                name: TEMPLATE_NAME,
                language: { code: 'fr' },
                components: [{
                    type: 'body',
                    parameters: [
                        { type: 'text', text: order.orderNumber },
                        { type: 'text', text: order.clientName ? `${order.clientName} (${order.phone})` : order.phone },
                        { type: 'text', text: order.pdfUrl || 'PDF indisponible' },
                    ],
                }],
            },
        });
    }
    // Hors template : fonctionne dans une session ouverte < 24 h (sinon
    // erreur Meta 131047 → configurer WHATSAPP_TEMPLATE_NAME).
    return postJson(base, headers, {
        messaging_product: 'whatsapp',
        to: NOTIFY_TO,
        type: 'text',
        text: { body: orderText(order), preview_url: false },
    });
};

/**
 * Notifie la pharmacie d'une nouvelle commande.
 * Ne lève JAMAIS (fire-and-forget) : un échec est logué, la commande n'est
 * jamais bloquée par la notification.
 */
const notifyNewOrder = async (order) => {
    if (!isConfigured()) return false;
    const provider = gatewayConfigured() ? 'OpenWA' : 'Meta Cloud';
    try {
        if (gatewayConfigured()) await sendViaGateway(order);
        else await sendViaCloud(order);
        console.log(`Notification WhatsApp (${provider}) envoyée pour ${order.orderNumber}`);
        return true;
    } catch (e) {
        console.error(`Notification WhatsApp (${provider}) ${order.orderNumber} impossible :`, e.message);
        return false;
    }
};

module.exports = { notifyNewOrder, isConfigured };
