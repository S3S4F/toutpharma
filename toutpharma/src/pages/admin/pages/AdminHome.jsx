import React, { useEffect, useState } from 'react';
import { Package, Calendar, FileText, TrendingUp, Plus, ChevronRight, ShoppingCart, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { api } from '../../../lib/api';

export default function AdminHome() {
    const [stats, setStats] = useState({
        products: 0,
        appointments: 0,
        prescriptions: 0,
        orders: 0,
        orders_pending: 0
    });

    useEffect(() => {
        // Comptage délégué à un endpoint dédié (COUNT côté SQL) plutôt que de
        // rapatrier toutes les lignes juste pour les compter.
        api.getStats()
            .then((data) => data && setStats(data))
            .catch((error) => console.error("Error fetching stats:", error));
    }, []);

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Tableau de Bord</h1>
                <p className="text-slate-500">Bienvenue sur votre espace d'administration.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Commandes à traiter"
                    value={stats.orders_pending}
                    icon={Bell}
                    colorClass="text-red-500 bg-red-500"
                    link="/admin/orders"
                    description="En attente de contact"
                />
                <StatCard
                    title="Total Commandes"
                    value={stats.orders}
                    icon={ShoppingCart}
                    colorClass="text-green-500 bg-green-500"
                    link="/admin/orders"
                    description="Bons de commande reçus"
                />
                <StatCard
                    title="Total Produits"
                    value={stats.products}
                    icon={Package}
                    colorClass="text-blue-500 bg-blue-500" // Component handles bg-opacity
                    link="/admin/products"
                    description="Produits référencés"
                />
                <StatCard
                    title="Rendez-vous (Auj.)"
                    value={stats.appointments}
                    icon={Calendar}
                    colorClass="text-purple-500 bg-purple-500"
                    link="/admin/appointments"
                    description="Prévus aujourd'hui"
                />
                <StatCard
                    title="Ordonnances"
                    value={stats.prescriptions}
                    icon={FileText}
                    colorClass="text-orange-500 bg-orange-500"
                    link="/admin/prescriptions"
                    description="Reçues au total"
                />
            </div>

            {/* Quick Actions & Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Placeholder for Activity Graph or List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-slate-800">Actions Rapides</h2>
                    </div>
                    <div className="space-y-4">
                        <Link
                            to="/admin/products/new"
                            className="flex items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group border border-slate-100"
                        >
                            <div className="bg-white p-3 rounded-lg shadow-sm text-giphar-green mr-4 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Ajouter un produit</h3>
                                <p className="text-sm text-slate-500">Créer une nouvelle fiche produit</p>
                            </div>
                            <ChevronRight className="ml-auto text-slate-400" size={20} />
                        </Link>
                        <Link
                            to="/admin/appointments"
                            className="flex items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group border border-slate-100"
                        >
                            <div className="bg-white p-3 rounded-lg shadow-sm text-purple-500 mr-4 group-hover:scale-110 transition-transform">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Gérer les RDV</h3>
                                <p className="text-sm text-slate-500">Voir le planning de la semaine</p>
                            </div>
                            <ChevronRight className="ml-auto text-slate-400" size={20} />
                        </Link>
                    </div>
                </div>

                <div className="bg-giphar-green bg-opacity-5 p-6 rounded-2xl border border-giphar-green/10 flex flex-col justify-center items-center text-center">
                    <div className="mb-4 bg-white p-4 rounded-full shadow-sm text-giphar-green">
                        <TrendingUp size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Performances</h3>
                    <p className="text-slate-600 max-w-xs">
                        Consultez vos statistiques détaillées pour optimiser votre gestion.
                    </p>
                </div>
            </div>
        </div>
    );
}
