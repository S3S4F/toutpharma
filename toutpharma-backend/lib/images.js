// Traitement des images uploadées (sharp).
// Toute image entrante est normalisée : rotation EXIF corrigée (photos de
// téléphone), redimensionnée à 1600 px max et convertie en WebP — fichiers
// légers, orientation correcte, format affichable par tous les navigateurs.
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const ACCEPTED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const FORMATS_LABEL = 'JPG, PNG ou WebP';
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // avant compression
const MAX_UPLOAD_LABEL = `${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} Mo`;

/**
 * Normalise une image (fichier temporaire multer) et l'écrit dans outputDir.
 * Le fichier temporaire est supprimé dans tous les cas.
 * @returns {Promise<string>} l'URL relative du fichier écrit (ex. "/uploads/<uuid>.webp")
 */
const saveUploadedImage = async (file, outputDir) => {
    const fileName = `${crypto.randomUUID()}.webp`;
    try {
        await sharp(file.path, { limitInputPixels: 40_000_000 })
            .rotate() // applique l'orientation EXIF
            .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(path.join(outputDir, fileName));
    } finally {
        fs.unlink(file.path, () => { });
    }
    return `/uploads/${fileName}`;
};

module.exports = { saveUploadedImage, ACCEPTED_MIMES, FORMATS_LABEL, MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL };
