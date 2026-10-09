// TOTP (RFC 6238) sans dépendance externe — 2FA admin compatible
// Google Authenticator / Authy / FreeOTP. Codes à 6 chiffres, pas de 30 s,
// tolérance ±1 pas (dérive d'horloge du téléphone).
const crypto = require('crypto');

const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const base32Decode = (str) => {
    const clean = String(str || '').toUpperCase().replace(/[^A-Z2-7]/g, '');
    let bits = 0;
    let value = 0;
    const out = [];
    for (const c of clean) {
        value = (value << 5) | B32_ALPHABET.indexOf(c);
        bits += 5;
        if (bits >= 8) {
            out.push((value >>> (bits - 8)) & 0xff);
            bits -= 8;
        }
    }
    return Buffer.from(out);
};

const hotp = (key, counter) => {
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64BE(BigInt(counter));
    const digest = crypto.createHmac('sha1', key).update(buf).digest();
    const offset = digest[digest.length - 1] & 0x0f;
    const code = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
    return String(code).padStart(6, '0');
};

/** Code TOTP courant pour un secret base32 (utilisé par le setup et les tests). */
const currentCode = (secretB32, stepOffset = 0) => {
    const key = base32Decode(secretB32);
    const counter = Math.floor(Date.now() / 30_000) + stepOffset;
    return hotp(key, counter);
};

/** Vérifie un code à 6 chiffres contre le secret (fenêtre ±1 pas de 30 s). */
const verifyTotp = (secretB32, code, window = 1) => {
    const given = String(code || '').trim();
    if (!/^\d{6}$/.test(given)) return false;
    const key = base32Decode(secretB32);
    if (key.length < 10) return false;
    const counter = Math.floor(Date.now() / 30_000);
    for (let i = -window; i <= window; i += 1) {
        const expected = hotp(key, counter + i);
        if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(given))) return true;
    }
    return false;
};

/** Génère un secret base32 de 160 bits (recommandation RFC). */
const generateSecret = () => {
    const bytes = crypto.randomBytes(20);
    let bits = 0;
    let value = 0;
    let out = '';
    for (const b of bytes) {
        value = (value << 8) | b;
        bits += 8;
        while (bits >= 5) {
            out += B32_ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) out += B32_ALPHABET[(value << (5 - bits)) & 31];
    return out;
};

module.exports = { verifyTotp, currentCode, generateSecret };
