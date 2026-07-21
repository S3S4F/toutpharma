import React, { useEffect, useState } from 'react';
import { Phone, Eye, X, Download } from 'lucide-react';
import { api } from '../../../lib/api';
import { formatDate } from '../../../utils/format';

export default function AdminPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchPrescriptions = async () => {
        try {
            setPrescriptions(await api.getPrescriptions());
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        }
    };

    useEffect(() => { fetchPrescriptions(); }, []);

    const handleStatusChange = async (pres, status) => {
        setPrescriptions((prev) => prev.map((p) => (p.id === pres.id ? { ...p, status } : p)));
        try {
            await api.updatePrescription(pres.id, { status });
        } catch (error) {
            console.error('Error updating prescription:', error);
        } finally {
            fetchPrescriptions();
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Ordonnances</h1>
                <p className="text-slate-500">Réception et traitement des ordonnances ({prescriptions.length})</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4 pl-6">Client</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Reçu le</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4 text-right pr-6">Aperçu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {prescriptions.map(pres => (
                                <tr key={pres.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                                                {pres.client_name ? pres.client_name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <span className="font-medium text-slate-900">
                                                {pres.client_name || 'Anonyme'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-slate-400" />
                                            {pres.phone}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600 text-sm">
                                        {formatDate(pres.created_at)}
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={pres.status || 'pending'}
                                            onChange={(e) => handleStatusChange(pres, e.target.value)}
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer outline-none
                                            ${pres.status === 'ready' ? 'bg-green-100 text-green-800' :
                                                    pres.status === 'picked_up' ? 'bg-slate-100 text-slate-600' :
                                                        'bg-yellow-100 text-yellow-800'}`}
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="ready">Prête</option>
                                            <option value="picked_up">Récupérée</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <button
                                            onClick={() => setSelectedImage(pres.image_url)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-giphar-green hover:bg-green-50 transition-colors"
                                        >
                                            <Eye size={16} />
                                            Voir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {prescriptions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-400">
                                        Aucune ordonnance reçue pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <a
                                href={selectedImage}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-white/90 rounded-full text-slate-700 hover:text-slate-900 hover:bg-white shadow-sm transition-all"
                            >
                                <Download size={20} />
                            </a>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-2 bg-white/90 rounded-full text-slate-700 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <img
                                src={selectedImage}
                                alt="Ordonnance"
                                className="max-w-full max-h-[85vh] object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
