const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');

let serverProcess;
let baseUrl;
let temporaryDirectory;
let token;
let serverOutput = '';

const getFreePort = () => new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
        const { port } = server.address();
        server.close(() => resolve(port));
    });
});

const requestJson = async (pathname, options = {}) => {
    const response = await fetch(`${baseUrl}${pathname}`, options);
    const data = await response.json().catch(() => ({}));
    return { response, data };
};

before(async () => {
    temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'toutpharma-test-'));
    const port = await getFreePort();
    baseUrl = `http://127.0.0.1:${port}`;
    serverProcess = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], {
        // Démarrer volontairement hors du backend reproduit l'ancien bug où
        // Multer écrivait les images dans le mauvais dossier.
        cwd: temporaryDirectory,
        env: {
            ...process.env,
            NODE_ENV: 'test',
            PORT: String(port),
            PUBLIC_URL: baseUrl,
            DB_PATH: path.join(temporaryDirectory, 'database.sqlite'),
            UPLOAD_DIR: path.join(temporaryDirectory, 'uploads'),
            ADMIN_PASSWORD: 'correct-horse-battery-staple',
            ADMIN_TOKEN_SECRET: 'test-secret-with-at-least-thirty-two-characters',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    serverProcess.stdout.on('data', (chunk) => { serverOutput += chunk; });
    serverProcess.stderr.on('data', (chunk) => { serverOutput += chunk; });

    for (let attempt = 0; attempt < 50; attempt += 1) {
        try {
            const response = await fetch(`${baseUrl}/api/products`);
            if (response.ok) break;
        } catch { /* attendre le démarrage */ }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const login = await requestJson('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'correct-horse-battery-staple' }),
    });
    assert.equal(login.response.status, 200, serverOutput);
    token = login.data.token;
});

after(() => {
    if (serverProcess) serverProcess.kill('SIGTERM');
    if (temporaryDirectory) fs.rmSync(temporaryDirectory, { recursive: true, force: true });
});

test('rejette un rendez-vous invalide', async () => {
    const { response } = await requestJson('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_name: '', phone: '', service_type: '', date_time: 'incorrect' }),
    });
    assert.equal(response.status, 400);
});

test('upload produit : le fichier est réellement affichable', async () => {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
    const form = new FormData();
    form.append('image', new Blob([png], { type: 'image/png' }), 'produit.png');
    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });
    assert.equal(uploadResponse.status, 200);
    const { imageUrl } = await uploadResponse.json();
    assert.match(imageUrl, /\/uploads\/products\//);
    const imageResponse = await fetch(imageUrl);
    assert.equal(imageResponse.status, 200);
    assert.equal(imageResponse.headers.get('content-type'), 'image/png');
});

test('rejette un faux fichier image', async () => {
    const form = new FormData();
    form.append('image', new Blob(['pas une image'], { type: 'image/png' }), 'faux.png');
    const response = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });
    assert.equal(response.status, 400);
});

test('une ordonnance est privée et reste lisible par un administrateur', async () => {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
    const form = new FormData();
    form.append('image', new Blob([png], { type: 'image/png' }), 'ordonnance.png');
    form.append('phone', '771234567');
    const uploadResponse = await fetch(`${baseUrl}/api/prescriptions`, { method: 'POST', body: form });
    assert.equal(uploadResponse.status, 200);
    const { id } = await uploadResponse.json();

    const anonymousResponse = await fetch(`${baseUrl}/api/prescriptions/${id}/image`);
    assert.equal(anonymousResponse.status, 401);
    const adminResponse = await fetch(`${baseUrl}/api/prescriptions/${id}/image`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(adminResponse.status, 200);

    const [filename] = fs.readdirSync(path.join(temporaryDirectory, 'uploads', 'prescriptions'));
    const publicResponse = await fetch(`${baseUrl}/uploads/prescriptions/${filename}`);
    assert.equal(publicResponse.status, 404);
});

test('les prix envoyés par le navigateur sont ignorés', async () => {
    const { response, data } = await requestJson('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phone: '771234567',
            items: [{ name: 'Produit', category: 'Test', quantity: 2, price: 999999 }],
        }),
    });
    assert.equal(response.status, 200);
    assert.equal(data.total, 0);
});

test('des commandes simultanées reçoivent des numéros uniques', async () => {
    const body = JSON.stringify({ phone: '771234567', items: [{ name: 'Produit', quantity: 1 }] });
    const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body };
    const responses = await Promise.all([
        requestJson('/api/orders', options),
        requestJson('/api/orders', options),
    ]);
    assert.equal(responses[0].response.status, 200);
    assert.equal(responses[1].response.status, 200);
    assert.notEqual(responses[0].data.orderNumber, responses[1].data.orderNumber);
});

test('bloque les tentatives répétées de connexion', async () => {
    let status;
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const result = await requestJson('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'incorrect' }),
        });
        status = result.response.status;
    }
    assert.equal(status, 429);
});
