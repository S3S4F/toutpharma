require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createToken, requireAuth } = require('./lib/auth');
const { generateOrderPdf } = require('./lib/orderPdf');

const app = express();
const PORT = process.env.PORT || 3001;
// URL publique utilisée pour construire les liens vers les images uploadées.
// En prod, définir PUBLIC_URL sur le domaine réel de l'API.
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
// Mot de passe admin : à définir en prod via ADMIN_PASSWORD.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
if (!process.env.ADMIN_PASSWORD) {
    console.warn('⚠️  ADMIN_PASSWORD non défini — mot de passe de développement utilisé.');
}
// Numéro WhatsApp par défaut (modifiable dans l'admin, table pharmacy_info).
const DEFAULT_WHATSAPP = '221781669777';

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directories exist
const uploadDir = path.join(__dirname, 'uploads');
const ordersDir = path.join(uploadDir, 'orders');
[uploadDir, ordersDir].forEach((d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// Database Setup — DB_PATH permet de placer la base sur un volume Docker.
const DB_PATH = process.env.DB_PATH || './database.sqlite';
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database.');
        createTables();
    }
});

function createTables() {
    // Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        image_url TEXT,
        price REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Appointments Table
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service_type TEXT NOT NULL,
        date_time DATETIME NOT NULL,
        status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Prescriptions Table
    db.run(`CREATE TABLE IF NOT EXISTS prescriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name TEXT, -- Can be null if anonymous upload
        phone TEXT NOT NULL,
        image_url TEXT NOT NULL,
        status TEXT DEFAULT 'pending', -- pending, ready, picked_up
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Orders Table — chaque commande est persistée AVANT l'envoi WhatsApp :
    // aucune commande n'est perdue même si le client n'envoie pas le message.
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        client_name TEXT,
        phone TEXT NOT NULL,
        items_json TEXT NOT NULL,
        total REAL DEFAULT 0,
        status TEXT DEFAULT 'received', -- received, contacted, quoted, confirmed, delivered, cancelled
        admin_notes TEXT,
        pdf_file TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Pharmacy Info Table (Single Row)
    db.run(`CREATE TABLE IF NOT EXISTS pharmacy_info (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        hours_json TEXT, -- JSON string of opening hours
        is_open_override BOOLEAN DEFAULT NULL -- NULL = Auto, 0 = Force Close, 1 = Force Open
    )`, (err) => {
        if (!err) {
            // Insert default hours if not exists
            const defaultHours = JSON.stringify({
                monday: { open: "08:00", close: "20:00" },
                tuesday: { open: "08:00", close: "20:00" },
                wednesday: { open: "08:00", close: "20:00" },
                thursday: { open: "08:00", close: "20:00" },
                friday: { open: "08:00", close: "20:00" },
                saturday: { open: "09:00", close: "18:00" },
                sunday: { open: null, close: null } // Closed
            });
            db.run(`INSERT OR IGNORE INTO pharmacy_info (id, hours_json) VALUES (1, ?)`, [defaultHours]);
            // Migration légère : colonne du numéro WhatsApp (ignore si déjà présente).
            db.run(`ALTER TABLE pharmacy_info ADD COLUMN whatsapp_number TEXT`, () => { });
        }
    });
}

// Multer Config for Image Uploads — types d'images uniquement, 5 Mo max.
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (IMAGE_MIMES.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Type de fichier non autorisé (images uniquement).'));
    }
});

// Rate limiting minimal en mémoire sur la création de commande (anti-spam).
const orderHits = new Map();
const orderRateLimit = (req, res, next) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const hits = (orderHits.get(ip) || []).filter((t) => now - t < 60_000);
    if (hits.length >= 10) return res.status(429).json({ error: 'Trop de demandes, réessayez dans une minute.' });
    hits.push(now);
    orderHits.set(ip, hits);
    next();
};

// Helper : numéro WhatsApp courant (paramétrable dans l'admin).
const getWhatsappNumber = (cb) => {
    db.get("SELECT whatsapp_number FROM pharmacy_info WHERE id = 1", [], (err, row) => {
        cb((row && row.whatsapp_number) || DEFAULT_WHATSAPP);
    });
};

// Affichage lisible d'un numéro international ("221781669777" → "+221 78 166 97 77").
const formatIntlPhone = (num) => {
    if (/^221\d{9}$/.test(num)) {
        const p = num.slice(3);
        return `+221 ${p.slice(0, 2)} ${p.slice(2, 5)} ${p.slice(5, 7)} ${p.slice(7, 9)}`;
    }
    return `+${num}`;
};

// Routes

// --- PRODUCTS ---
// GET all products (public — catalogue du site)
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products ORDER BY created_at DESC", [], (err, rows) => {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success", "data": rows });
    });
});

// POST new product (admin)
app.post('/api/products', requireAuth, (req, res) => {
    const { name, description, category, image_url, price } = req.body;
    const sql = 'INSERT INTO products (name, description, category, image_url, price) VALUES (?,?,?,?,?)';
    const params = [name, description, category, image_url, price];

    db.run(sql, params, function (err) {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success", "data": { id: this.lastID, ...req.body } });
    });
});

// PUT update product (admin)
app.put('/api/products/:id', requireAuth, (req, res) => {
    const { name, description, category, image_url, price } = req.body;
    const sql = `UPDATE products SET name = ?, description = ?, category = ?, image_url = ?, price = ? WHERE id = ?`;
    db.run(sql, [name, description, category, image_url, price, req.params.id], function (err) {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success", changes: this.changes });
    });
});

// DELETE product (admin)
app.delete('/api/products/:id', requireAuth, (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', req.params.id, function (err) {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "deleted", changes: this.changes });
    });
});

// --- LISTS (Dynamic Categories) ---
app.get('/api/categories', (req, res) => {
    db.all("SELECT DISTINCT category FROM products", [], (err, rows) => {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success", "data": rows.map(r => r.category) });
    });
});

// --- ORDERS (Commandes) ---
// POST new order (public) : valide, persiste, génère le PDF serveur, renvoie
// le lien WhatsApp pré-rempli (récap + lien du PDF).
app.post('/api/orders', orderRateLimit, async (req, res) => {
    const { client_name, phone, items } = req.body || {};

    // Validation
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
        return res.status(400).json({ error: 'Téléphone requis.' });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 200) {
        return res.status(400).json({ error: 'Panier vide ou invalide.' });
    }
    const cleanItems = [];
    for (const it of items) {
        const quantity = parseInt(it.quantity, 10);
        if (!it.name || typeof it.name !== 'string' || !Number.isFinite(quantity) || quantity < 1 || quantity > 9999) {
            return res.status(400).json({ error: 'Article invalide dans le panier.' });
        }
        cleanItems.push({
            name: String(it.name).slice(0, 200),
            category: it.category ? String(it.category).slice(0, 100) : '',
            quantity,
            price: parseFloat(it.price) || 0,
        });
    }
    const cleanName = client_name ? String(client_name).slice(0, 120) : '';
    const cleanPhone = String(phone).slice(0, 30);
    const total = cleanItems.reduce((s, i) => s + i.price * i.quantity, 0);

    // Numéro séquentiel par année : CMD-2026-0042. On repart du plus grand
    // numéro existant (et non du COUNT) pour éviter tout doublon si des
    // lignes ont été supprimées manuellement.
    const year = new Date().getFullYear();
    db.get(
        `SELECT order_number FROM orders WHERE order_number LIKE ? ORDER BY order_number DESC LIMIT 1`,
        [`CMD-${year}-%`],
        (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        const lastSeq = row ? parseInt(row.order_number.split('-')[2], 10) : 0;
        const orderNumber = `CMD-${year}-${String((lastSeq || 0) + 1).padStart(4, '0')}`;

        // Le numéro configuré dans l'admin sert à la fois au lien wa.me
        // et au téléphone « Fournisseur » affiché dans le PDF.
        getWhatsappNumber(async (waNumber) => {
            let pdfFile = null;
            try {
                pdfFile = await generateOrderPdf({
                    orderNumber,
                    clientName: cleanName,
                    phone: cleanPhone,
                    items: cleanItems,
                    total,
                    pharmacyPhone: formatIntlPhone(waNumber),
                    outputDir: ordersDir,
                });
            } catch (e) {
                console.error('PDF generation failed:', e);
                // La commande est enregistrée même si le PDF échoue.
            }

            const sql = `INSERT INTO orders (order_number, client_name, phone, items_json, total, pdf_file)
                         VALUES (?,?,?,?,?,?)`;
            db.run(sql, [orderNumber, cleanName, cleanPhone, JSON.stringify(cleanItems), total, pdfFile], function (insertErr) {
                if (insertErr) return res.status(500).json({ error: insertErr.message });

                const pdfUrl = pdfFile ? `${PUBLIC_URL}/uploads/orders/${pdfFile}` : null;
                // Message WhatsApp : récap + lien du bon de commande PDF.
                const totalQty = cleanItems.reduce((s, i) => s + i.quantity, 0);
                let msg = `BON DE COMMANDE - ToutPharma\n`;
                msg += `N° : ${orderNumber}\n`;
                msg += `Date : ${new Date().toLocaleDateString('fr-FR')}\n\n`;
                msg += `CLIENT\nNom : ${cleanName || 'Non renseigné'}\nTél : ${cleanPhone}\n\n`;
                msg += `PRODUITS (${totalQty} article${totalQty > 1 ? 's' : ''})\n`;
                cleanItems.forEach((it, i) => {
                    msg += `${i + 1}. ${it.name} — Qté : ${it.quantity}`;
                    msg += it.price ? ` | ${(it.price * it.quantity).toLocaleString('fr-FR')} FCFA\n` : ` | Sur devis\n`;
                });
                msg += total > 0
                    ? `\nTotal estimé : ${total.toLocaleString('fr-FR')} FCFA\n`
                    : `\nTotal : à confirmer\n`;
                if (pdfUrl) msg += `\nBon de commande PDF :\n${pdfUrl}\n`;
                msg += `\nMerci de confirmer la disponibilité et les délais.`;

                res.json({
                    message: 'success',
                    orderNumber,
                    pdfUrl,
                    total,
                    whatsappUrl: `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`,
                });
            });
        });
    });
});

// GET all orders (admin)
app.get('/api/orders', requireAuth, (req, res) => {
    db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(400).json({ "error": err.message });
        const data = rows.map((r) => ({
            ...r,
            items: JSON.parse(r.items_json || '[]'),
            pdf_url: r.pdf_file ? `${PUBLIC_URL}/uploads/orders/${r.pdf_file}` : null,
        }));
        res.json({ "message": "success", "data": data });
    });
});

// PATCH order status / notes (admin)
const ORDER_STATUSES = ['received', 'contacted', 'quoted', 'confirmed', 'delivered', 'cancelled'];
app.patch('/api/orders/:id', requireAuth, (req, res) => {
    const { status, admin_notes } = req.body || {};
    if (status !== undefined && !ORDER_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Statut invalide.' });
    }
    const sets = [];
    const params = [];
    if (status !== undefined) { sets.push('status = ?'); params.push(status); }
    if (admin_notes !== undefined) { sets.push('admin_notes = ?'); params.push(String(admin_notes).slice(0, 2000)); }
    if (sets.length === 0) return res.status(400).json({ error: 'Rien à mettre à jour.' });
    sets.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(req.params.id);

    db.run(`UPDATE orders SET ${sets.join(', ')} WHERE id = ?`, params, function (err) {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success", changes: this.changes });
    });
});

// --- APPOINTMENTS ---
// GET all appointments (Admin)
app.get('/api/appointments', requireAuth, (req, res) => {
    db.all("SELECT * FROM appointments ORDER BY date_time DESC", [], (err, rows) => {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success", "data": rows });
    });
});

// POST new appointment (public)
app.post('/api/appointments', (req, res) => {
    const { client_name, phone, service_type, date_time } = req.body;
    const sql = 'INSERT INTO appointments (client_name, phone, service_type, date_time) VALUES (?,?,?,?)';
    const params = [client_name, phone, service_type, date_time];

    db.run(sql, params, function (err) {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success", "id": this.lastID });
    });
});

// PATCH appointment status (admin)
app.patch('/api/appointments/:id', requireAuth, (req, res) => {
    const { status } = req.body || {};
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Statut invalide.' });
    }
    db.run('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id], function (err) {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success", changes: this.changes });
    });
});

// --- PRESCRIPTIONS ---
// POST upload prescription (public)
app.post('/api/prescriptions', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const imageUrl = `${PUBLIC_URL}/uploads/${req.file.filename}`;
    const { phone, client_name } = req.body;

    const sql = 'INSERT INTO prescriptions (client_name, phone, image_url) VALUES (?,?,?)';
    db.run(sql, [client_name || 'Anonyme', phone, imageUrl], function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "success", "imageUrl": imageUrl, "id": this.lastID });
    });
});

// GET all prescriptions (Admin — données de santé, jamais publiques)
app.get('/api/prescriptions', requireAuth, (req, res) => {
    db.all("SELECT * FROM prescriptions ORDER BY created_at DESC", [], (err, rows) => {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success", "data": rows });
    });
});

// PATCH prescription status / notes (admin)
app.patch('/api/prescriptions/:id', requireAuth, (req, res) => {
    const { status, notes } = req.body || {};
    if (status !== undefined && !['pending', 'ready', 'picked_up'].includes(status)) {
        return res.status(400).json({ error: 'Statut invalide.' });
    }
    const sets = [];
    const params = [];
    if (status !== undefined) { sets.push('status = ?'); params.push(status); }
    if (notes !== undefined) { sets.push('notes = ?'); params.push(String(notes).slice(0, 2000)); }
    if (sets.length === 0) return res.status(400).json({ error: 'Rien à mettre à jour.' });
    params.push(req.params.id);

    db.run(`UPDATE prescriptions SET ${sets.join(', ')} WHERE id = ?`, params, function (err) {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success", changes: this.changes });
    });
});

// --- SETTINGS (Paramètres admin) ---
// GET settings — public limité : le front a besoin du numéro WhatsApp.
app.get('/api/settings', (req, res) => {
    db.get("SELECT whatsapp_number, is_open_override, hours_json FROM pharmacy_info WHERE id = 1", [], (err, row) => {
        if (err || !row) return res.json({ whatsapp_number: DEFAULT_WHATSAPP });
        res.json({
            whatsapp_number: row.whatsapp_number || DEFAULT_WHATSAPP,
            is_open_override: row.is_open_override,
            hours: row.hours_json ? JSON.parse(row.hours_json) : null,
        });
    });
});

// PUT settings (admin) : numéro WhatsApp + ouverture forcée.
app.put('/api/settings', requireAuth, (req, res) => {
    const { whatsapp_number, is_open_override } = req.body || {};
    const sets = [];
    const params = [];
    if (whatsapp_number !== undefined) {
        const cleaned = String(whatsapp_number).replace(/[^0-9]/g, '');
        if (cleaned.length < 9 || cleaned.length > 15) {
            return res.status(400).json({ error: 'Numéro WhatsApp invalide (format international sans +, ex. 221781669777).' });
        }
        sets.push('whatsapp_number = ?');
        params.push(cleaned);
    }
    if (is_open_override !== undefined) {
        if (![null, 0, 1].includes(is_open_override)) return res.status(400).json({ error: 'Valeur override invalide.' });
        sets.push('is_open_override = ?');
        params.push(is_open_override);
    }
    if (sets.length === 0) return res.status(400).json({ error: 'Rien à mettre à jour.' });

    db.run(`UPDATE pharmacy_info SET ${sets.join(', ')} WHERE id = 1`, params, function (err) {
        if (err) res.status(400).json({ "error": err.message });
        else res.json({ "message": "success" });
    });
});

// --- PHARMACY STATUS ---
// GET Current Status (Open/Closed)
app.get('/api/status', (req, res) => {
    db.get("SELECT * FROM pharmacy_info WHERE id = 1", [], (err, row) => {
        if (err || !row) return res.json({ isOpen: false, reason: "No Data" });

        // Override check
        if (row.is_open_override === 1) return res.json({ isOpen: true, status: "Ouvert (Force)" });
        if (row.is_open_override === 0) return res.json({ isOpen: false, status: "Fermé (Force)" });

        // Time logic
        const now = new Date();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[now.getDay()];
        const hours = JSON.parse(row.hours_json);
        const todayHours = hours[dayName];

        if (!todayHours || !todayHours.open || !todayHours.close) {
            return res.json({ isOpen: false, status: "Fermé (Jour de repos)" });
        }

        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [openH, openM] = todayHours.open.split(':').map(Number);
        const [closeH, closeM] = todayHours.close.split(':').map(Number);
        const openTime = openH * 60 + openM;
        const closeTime = closeH * 60 + closeM;

        const isOpen = currentTime >= openTime && currentTime < closeTime;
        res.json({ isOpen, status: isOpen ? "Ouvert" : "Fermé" });
    });
});

// Upload Image Utility (admin — utilisé par le formulaire produit)
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Return the URL to access the file
    const imageUrl = `${PUBLIC_URL}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// --- STATS (Dashboard, admin) ---
// Comptage via COUNT(*) plutôt que de renvoyer toutes les lignes au client.
app.get('/api/stats', requireAuth, (req, res) => {
    db.get("SELECT COUNT(*) AS c FROM products", (e1, products) => {
        db.get("SELECT COUNT(*) AS c FROM prescriptions", (e2, prescriptions) => {
            // Rendez-vous du jour (date UTC, comme l'ancien calcul côté client).
            db.get(
                "SELECT COUNT(*) AS c FROM appointments WHERE date(date_time) = date('now')",
                (e3, appointments) => {
                    db.get("SELECT COUNT(*) AS c FROM orders", (e4, orders) => {
                        db.get("SELECT COUNT(*) AS c FROM orders WHERE status = 'received'", (e5, pending) => {
                            const err = e1 || e2 || e3 || e4 || e5;
                            if (err) return res.status(400).json({ "error": err.message });
                            res.json({
                                "message": "success",
                                "data": {
                                    products: products.c,
                                    appointments: appointments.c,
                                    prescriptions: prescriptions.c,
                                    orders: orders.c,
                                    orders_pending: pending.c
                                }
                            });
                        });
                    });
                }
            );
        });
    });
});

// Admin Login — mot de passe via ADMIN_PASSWORD, token signé vérifié partout.
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: createToken() });
    } else {
        res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }
});

// Gestion d'erreur (multer : taille / type de fichier)
app.use((err, req, res, next) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
