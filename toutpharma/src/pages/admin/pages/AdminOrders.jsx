import React, { useEffect, useMemo, useState } from 'react';
import { Search, Phone, FileDown, MessageCircle, ChevronDown, ChevronUp, Save, ShoppingCart } from 'lucide-react';
import { api } from '../../../lib/api';
import { formatDate } from '../../../utils/format';

// Cycle de vie d'une commande — libellés FR + couleur du badge.
const ORDER_STATUSES = [
    { value: 'received', label: 'Reçue', classes: 'bg-blue-100 text-blue-700' },
    { value: 'contacted', label: 'Client contacté', classes: 'bg-purple-100 text-purple-700' },
    { value: 'quoted', label: 'Devis envoyé', classes: 'bg-amber-100 text-amber-700' },
    { value: 'confirmed', label: 'Confirmée', classes: 'bg-teal-100 text-teal-700' },
    { value: 'delivered', label: 'Livrée', classes: 'bg-green-100 text-green-700' },
    { value: 'cancelled', label: 'Annulée', classes: 'bg-red-100 text-red-700' },
];

const statusOf = (value) => ORDER_STATUSES.find((s) => s.value === value) || ORDER_STATUSES[0];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [notesDraft, setNotesDraft] = useState('');
    const [savingNotes, setSavingNotes] = useState(false);

    const fetchOrders = async () => {
        try {
            setOrders(await api.getOrders());
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return orders.filter((o) => {
            if (statusFilter !== 'all' && o.status !== statusFilter) return false;
            if (!q) return true;
            return (
                (o.order_number || '').toLowerCase().includes(q) ||
                (o.client_name || '').toLowerCase().includes(q) ||
                (o.phone || '').toLowerCase().includes(q)
            );
        });
    }, [orders, searchTerm, statusFilter]);

    const handleStatusChange = async (order, status) => {
        // Mise à jour optimiste, rechargée depuis le serveur ensuite.
        setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
        try {
            await api.updateOrder(order.id, { status });
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            fetchOrders();
        }
    };

    const toggleExpand = (order) => {
        if (expandedId === order.id) {
            setExpandedId(null);
        } else {
            setExpandedId(order.id);
            setNotesDraft(order.admin_notes || '');
        }
    };

    const handleSaveNotes = async (order) => {
        setSavingNotes(true);
        try {
            await api.updateOrder(order.id, { admin_notes: notesDraft });
            await fetchOrders();
        } catch (error) {
            console.error('Error saving notes:', error);
        } finally {
            setSavingNotes(false);
        }
    };

    const pendingCount = orders.filter((o) => o.status === 'received').length;

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Commandes</h1>
                <p className="text-slate-500">
                    Suivi des bons de commande ({orders.length})
                    {pendingCount > 0 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                            {pendingCount} à traiter
                        </span>
                    )}
                </p>
            </div>

            {/* Filtres */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher (n°, nom, téléphone)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-giphar-green/50 text-slate-700"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-giphar-green/50 text-slate-700"
                >
                    <option value="all">Tous les statuts</option>
                    {ORDER_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            {/* Liste */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Chargement...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
                                    <th className="p-4 pl-6">N° / Date</th>
                                    <th className="p-4">Client</th>
                                    <th className="p-4">Articles</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Statut</th>
                                    <th className="p-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((order) => {
                                    const status = statusOf(order.status);
                                    const isExpanded = expandedId === order.id;
                                    return (
                                        <React.Fragment key={order.id}>
                                            <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggleExpand(order)}>
                                                <td className="p-4 pl-6">
                                                    <div className="font-semibold text-slate-900">{order.order_number}</div>
                                                    <div className="text-xs text-slate-400">{formatDate(order.created_at)}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-900">{order.client_name || 'Non renseigné'}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Phone size={12} className="text-slate-400" /> {order.phone}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-600">
                                                    {order.items.length} réf. / {order.items.reduce((s, i) => s + i.quantity, 0)} unités
                                                </td>
                                                <td className="p-4 font-medium text-slate-700">
                                                    {order.total > 0 ? `${order.total.toLocaleString('fr-FR')} FCFA` : 'Sur devis'}
                                                </td>
                                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order, e.target.value)}
                                                        className={`text-xs font-bold px-2.5 py-1.5 rounded-full border-0 cursor-pointer outline-none ${status.classes}`}
                                                    >
                                                        {ORDER_STATUSES.map((s) => (
                                                            <option key={s.value} value={s.value}>{s.label}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-1">
                                                        <a
                                                            href={`https://wa.me/${String(order.phone).replace(/[^0-9]/g, '')}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            title="Contacter sur WhatsApp"
                                                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                                        >
                                                            <MessageCircle size={18} />
                                                        </a>
                                                        {order.pdf_url && (
                                                            <a
                                                                href={order.pdf_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                title="Bon de commande PDF"
                                                                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                                            >
                                                                <FileDown size={18} />
                                                            </a>
                                                        )}
                                                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => toggleExpand(order)}>
                                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-slate-50/60">
                                                    <td colSpan="6" className="p-6 pl-8">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                            {/* Détail articles */}
                                                            <div>
                                                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Articles commandés</h3>
                                                                <div className="space-y-2">
                                                                    {order.items.map((item, i) => (
                                                                        <div key={i} className="flex justify-between items-center bg-white rounded-lg px-4 py-2.5 border border-slate-200 text-sm">
                                                                            <div>
                                                                                <span className="font-medium text-slate-800">{item.name}</span>
                                                                                {item.category && <span className="text-xs text-slate-400 ml-2">{item.category}</span>}
                                                                            </div>
                                                                            <div className="text-slate-600 whitespace-nowrap">
                                                                                × {item.quantity}
                                                                                {item.price ? (
                                                                                    <span className="font-semibold text-slate-800 ml-3">
                                                                                        {(item.price * item.quantity).toLocaleString('fr-FR')} F
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="text-xs text-slate-400 ml-3">Sur devis</span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            {/* Notes internes */}
                                                            <div>
                                                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Notes internes</h3>
                                                                <textarea
                                                                    rows="4"
                                                                    value={notesDraft}
                                                                    onChange={(e) => setNotesDraft(e.target.value)}
                                                                    placeholder="Ex : devis envoyé le 22/07, en attente de validation..."
                                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all resize-none text-sm"
                                                                />
                                                                <button
                                                                    onClick={() => handleSaveNotes(order)}
                                                                    disabled={savingNotes}
                                                                    className="mt-2 inline-flex items-center gap-2 bg-giphar-green hover:bg-giphar-green-dark disabled:opacity-60 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                                                                >
                                                                    <Save size={15} />
                                                                    {savingNotes ? 'Enregistrement...' : 'Enregistrer les notes'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center">
                                                <ShoppingCart size={48} className="mb-4 text-slate-200" />
                                                <p>Aucune commande {statusFilter !== 'all' || searchTerm ? 'ne correspond aux filtres' : 'reçue pour le moment'}.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
