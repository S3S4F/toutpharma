// Authentification admin par token signé (HMAC), sans dépendance externe.
// Le token émis au login est `<expiration>.<signature>` ; toute route admin
// passe par requireAuth qui vérifie signature + expiration.
const crypto = require('crypto');

const SECRET = process.env.ADMIN_TOKEN_SECRET || 'dev-secret-change-me';
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

const sign = (payload) =>
    crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

const createToken = () => {
    const expiry = String(Date.now() + TOKEN_TTL_MS);
    return `${expiry}.${sign(expiry)}`;
};

const verifyToken = (token) => {
    if (!token || typeof token !== 'string') return false;
    const [expiry, signature] = token.split('.');
    if (!expiry || !signature) return false;
    const expected = sign(expiry);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    return Date.now() < Number(expiry);
};

// Middleware Express : exige `Authorization: Bearer <token>` valide.
const requireAuth = (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!verifyToken(token)) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    next();
};

module.exports = { createToken, verifyToken, requireAuth };
