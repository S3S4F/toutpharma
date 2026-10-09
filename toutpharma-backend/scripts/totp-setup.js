// Génère le secret 2FA de l'admin : npm run totp-setup
// 1. Copier ADMIN_TOTP_SECRET dans le .env (ou le secret GitHub du déploiement)
// 2. Dans Google Authenticator : « Ajouter » → « Saisir une clé », ou scanner
//    le QR code de l'URL affichée.
const { generateSecret, currentCode } = require('../lib/totp');

const secret = generateSecret();
const label = encodeURIComponent('ToutPharma Admin');
const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=ToutPharma&digits=6&period=30`;

console.log('=== Configuration 2FA (TOTP) ToutPharma ===\n');
console.log(`ADMIN_TOTP_SECRET=${secret}\n`);
console.log('URL à scanner (générateur de QR : coller dans une app QR ou');
console.log(`https://quickchart.io/qr?text=${encodeURIComponent(otpauth)} ) :\n`);
console.log(otpauth);
console.log(`\nCode actuel attendu (contrôle) : ${currentCode(secret)}`);
