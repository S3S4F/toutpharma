// Taxonomie de l'équipement de pharmacie — source unique pour les icônes,
// descriptions et suggestions de catégories.
//
// Les catégories réelles viennent de la base (saisies libres dans l'admin) :
// `categoryMeta(name)` associe à chaque nom une icône et une couleur par
// correspondance de mots-clés, pour rester robuste quelle que soit la saisie
// (« Diagnostic », « Matériel de diagnostic », « diagnostics »…).
import {
    Stethoscope,
    Syringe,
    BedDouble,
    Accessibility,
    Scissors,
    Droplets,
    HeartPulse,
    FlaskConical,
    Store,
    Baby,
    LayoutGrid,
} from 'lucide-react';

// Catégories canoniques proposées dans l'admin (datalist du formulaire
// produit) — l'ordre reflète le parcours type d'un acheteur.
export const CANONICAL_CATEGORIES = [
    { name: 'Diagnostic & mesure', icon: Stethoscope, blurb: 'Tensiomètres, thermomètres, ECG…', keywords: ['diagnost', 'mesure', 'tensio', 'ecg', 'appareil', 'oxymetre', 'thermometre'] },
    { name: 'Consommables médicaux', icon: Syringe, blurb: 'Gants, seringues, compresses, pansements…', keywords: ['consommable', 'gant', 'seringue', 'compresse', 'pansement', 'masque'] },
    { name: 'Instrumentation', icon: Scissors, blurb: 'Pinces, ciseaux, trousses de soins…', keywords: ['instrument', 'pince', 'ciseau'] },
    { name: 'Hygiène & stérilisation', icon: Droplets, blurb: 'Désinfection, stérilisateurs, protection…', keywords: ['hygien', 'sterilis', 'desinfect'] },
    { name: 'Mobilité & orthopédie', icon: Accessibility, blurb: 'Fauteuils roulants, béquilles, attelles…', keywords: ['mobilit', 'orthop', 'fauteuil', 'bequille', 'attelle'] },
    { name: 'Mobilier médical', icon: BedDouble, blurb: 'Divans d’examen, lits, tabourets…', keywords: ['mobilier', 'lit', 'divan', 'tabouret', 'examen'] },
    { name: 'Urgence & premiers secours', icon: HeartPulse, blurb: 'Trousses d’urgence, oxygénothérapie…', keywords: ['urgence', 'secour', 'oxygen', 'reanimation'] },
    { name: 'Laboratoire & tests', icon: FlaskConical, blurb: 'Tests rapides, matériel d’analyse…', keywords: ['laborato', 'test', 'analyse'] },
    { name: 'Agencement d’officine', icon: Store, blurb: 'Rayonnages, comptoirs, présentoirs…', keywords: ['agencement', 'rayonnage', 'comptoir', 'officine', 'presentoir'] },
    { name: 'Maternité & puériculture', icon: Baby, blurb: 'Pèse-bébés, biberons, soins maman…', keywords: ['matern', 'puericul', 'bebe', 'pediatr'] },
];

const DEFAULT_META = { icon: LayoutGrid, blurb: '' };

const normalize = (s) =>
    String(s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');

/** Icône + description pour un nom de catégorie quelconque (saisie libre). */
export const categoryMeta = (name) => {
    const n = normalize(name);
    if (!n) return DEFAULT_META;
    for (const cat of CANONICAL_CATEGORIES) {
        if (normalize(cat.name) === n) return cat;
    }
    for (const cat of CANONICAL_CATEGORIES) {
        if (cat.keywords.some((k) => n.includes(normalize(k)))) return cat;
    }
    return DEFAULT_META;
};
