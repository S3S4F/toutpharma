import React from 'react';
import { Truck, MapPin, Clock, ShieldCheck, Box } from 'lucide-react';

export default function Delivery() {
    return (
        <div className="pt-8 pb-20">
            <div className="bg-gradient-to-br from-giphar-green to-giphar-green-dark py-20 mb-16 text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                            <Truck size={48} className="text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Livraison Rapide au Sénégal</h1>
                        <p className="text-green-100 text-lg max-w-2xl">
                            Nous livrons vos équipements médicaux partout à Dakar et dans les régions, avec rapidité et sécurité.
                        </p>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-giphar-orange mb-6">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Dakar: 24h Chrono</h3>
                        <p className="text-slate-500">
                            Pour toute commande validée avant 12h, nous livrons dans la journée ou le lendemain matin sur Dakar et banlieue.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-giphar-green mb-6">
                            <MapPin size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Toutes Régions</h3>
                        <p className="text-slate-500">
                            Nous expédions vers Thiès, Saint-Louis, Touba, Ziguinchor et toutes les régions via nos partenaires logistiques fiables.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-giphar-green-light mb-6">
                            <Box size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Service Pro</h3>
                        <p className="text-slate-500">
                            Conditionnement spécial pour les équipements fragiles et le gros matériel. Respect de la chaîne de froid si nécessaire.
                        </p>
                    </div>
                </div>

                {/* Zone Details */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Zones de Livraison</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="font-bold text-slate-900 w-32 shrink-0">Zone 1</div>
                                <div>
                                    <p className="font-bold text-slate-900">Dakar - Plateau, Medina, Fann</p>
                                    <p className="text-sm text-slate-500">Livraison gratuite dès 100.000 FCFA</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="font-bold text-slate-900 w-32 shrink-0">Zone 2</div>
                                <div>
                                    <p className="font-bold text-slate-900">Banlieue (Pikine, Guediawaye, Rufisque)</p>
                                    <p className="text-sm text-slate-500">Frais fixes ou gratuit sur gros volume</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="font-bold text-slate-900 w-32 shrink-0">Régions</div>
                                <div>
                                    <p className="font-bold text-slate-900">Thiès, Mbour, St-Louis, etc.</p>
                                    <p className="text-sm text-slate-500">Expédition par GP ou transporteur - Frais à la charge du client</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-green-100">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Besoin d'une livraison urgente ?</h3>
                            <p className="text-slate-600 mb-8">
                                Pour les urgences officinales ou hospitalières, nous avons un service dédié pour vous livrer en priorité.
                            </p>
                            <a href="/contact" className="inline-block bg-giphar-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-giphar-orange-hover transition-colors shadow-lg shadow-orange-200">
                                Contacter le service client
                            </a>
                        </div>
                        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
