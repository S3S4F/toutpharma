import React, { useEffect, useState } from 'react';
import { MessageCircle, Clock, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../../lib/api';

// Paramètres modifiables sans toucher au code : numéro WhatsApp de réception
// des commandes et ouverture/fermeture forcée de la pharmacie.
export default function AdminSettings() {
    const [whatsapp, setWhatsapp] = useState('');
    const [override, setOverride] = useState('auto');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.getSettings()
            .then((s) => {
                setWhatsapp(s.whatsapp_number || '');
                setOverride(s.is_open_override === 1 ? 'open' : s.is_open_override === 0 ? 'closed' : 'auto');
            })
            .catch((e) => console.error('Error fetching settings:', e))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSaved(false);
        try {
            const res = await api.updateSettings({
                whatsapp_number: whatsapp,
                is_open_override: override === 'open' ? 1 : override === 'closed' ? 0 : null,
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Erreur lors de l\'enregistrement.');
            } else {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch {
            setError('Erreur de connexion au serveur.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-slate-400">Chargement...</div>;
    }

    return (
        <div className="p-6 lg:p-10 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
                <p className="text-slate-500">Configuration générale de la boutique.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* WhatsApp */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-50 text-green-600 p-2.5 rounded-xl">
                            <MessageCircle size={22} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">Réception des commandes WhatsApp</h2>
                            <p className="text-sm text-slate-500">Numéro qui reçoit les bons de commande.</p>
                        </div>
                    </div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Numéro WhatsApp (format international sans « + »)
                    </label>
                    <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="221781669777"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all"
                        required
                    />
                    <p className="text-xs text-slate-400 mt-2">
                        Exemple pour le Sénégal : 221 suivi du numéro (221781669777).
                    </p>
                </div>

                {/* Ouverture */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-purple-50 text-purple-600 p-2.5 rounded-xl">
                            <Clock size={22} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">Statut d'ouverture</h2>
                            <p className="text-sm text-slate-500">Affiché sur le site (bandeau Ouvert/Fermé).</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: 'auto', label: 'Automatique', hint: 'Selon les horaires' },
                            { value: 'open', label: 'Forcer ouvert', hint: 'Toujours « Ouvert »' },
                            { value: 'closed', label: 'Forcer fermé', hint: 'Toujours « Fermé »' },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setOverride(opt.value)}
                                className={`p-4 rounded-xl border text-left transition-all ${override === opt.value
                                    ? 'border-giphar-green bg-green-50 ring-1 ring-giphar-green'
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
                            >
                                <div className="font-semibold text-sm text-slate-900">{opt.label}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{opt.hint}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-giphar-green hover:bg-giphar-green-dark disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-colors"
                >
                    {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                    {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer'}
                </button>
            </form>
        </div>
    );
}
