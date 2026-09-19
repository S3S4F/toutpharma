import React from 'react';
import { ShieldCheck, Truck, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import livreurImage from '../../assets/images/imagelivreur.png';
import ActionBar from '../layout/ActionBar';

const stats = [
    { icon: Building2, value: '500+', label: 'Pharmacies équipées' },
    { icon: Truck, value: '24h', label: 'Livraison à Dakar' },
    { icon: ShieldCheck, value: '100%', label: 'Produits certifiés' },
];

export default function Hero() {
    return (
        <div>
            {/* Main Hero Area */}
            <div className="relative bg-gradient-to-br from-giphar-green-dark via-giphar-green to-[#00614a] pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-giphar-green-light opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Text Content */}
                        <div className="space-y-8 text-white">
                            <div>
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-giphar-green-light/15 border border-giphar-green-light/30 rounded-full text-giphar-green-light font-bold text-sm mb-6 tracking-wide uppercase animate-fade-up">
                                    <span className="w-2 h-2 rounded-full bg-giphar-green-light animate-pulse"></span>
                                    Grossiste Pharmaceutique N°1
                                </span>
                                <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-up" style={{ animationDelay: '90ms' }}>
                                    Votre partenaire santé <br />
                                    <span className="text-giphar-green-light relative inline-block">
                                        proche de vous
                                        <svg className="absolute w-full h-3 -bottom-2 left-0 text-giphar-green-light opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    </span>
                                </h1>
                                <p className="text-lg text-green-50/90 max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: '180ms' }}>
                                    ToutPharma équipe pharmacies, hôpitaux et cliniques au Sénégal :
                                    matériel médical, consommables et équipements — devis personnalisé sous 24h.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '270ms' }}>
                                <Link
                                    to="/equipements"
                                    className="group bg-giphar-orange hover:bg-giphar-orange-hover text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-lift transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-center inline-flex items-center justify-center gap-2"
                                >
                                    Demander un devis
                                    <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    to="/services"
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg backdrop-blur-sm transition-all duration-300 active:scale-95 text-center"
                                >
                                    Nos services
                                </Link>
                            </div>

                            {/* Trust stats */}
                            <div className="grid grid-cols-3 gap-4 pt-6 max-w-lg animate-fade-up" style={{ animationDelay: '360ms' }}>
                                {stats.map(({ icon: Icon, value, label }) => (
                                    <div key={label} className="flex flex-col gap-1 border-l-2 border-giphar-green-light/40 pl-3">
                                        <div className="flex items-center gap-2">
                                            <Icon size={16} className="text-giphar-green-light" />
                                            <span className="text-2xl font-extrabold leading-none">{value}</span>
                                        </div>
                                        <span className="text-xs text-green-100/80 leading-snug">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative hidden lg:block animate-scale-in" style={{ animationDelay: '200ms' }}>
                            <div className="relative z-10 p-4 bg-white/10 backdrop-blur-sm rounded-[2.5rem] border border-white/20">
                                <img
                                    src={livreurImage}
                                    alt="Livreur ToutPharma remettant une commande de matériel médical"
                                    className="w-full h-auto rounded-[2rem] shadow-2xl brightness-110"
                                />

                                {/* Floating Badge */}
                                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-lift animate-float">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-giphar-green p-3 rounded-full text-white">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Confiance</p>
                                            <p className="font-bold text-slate-900 text-lg">Produits certifiés</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Vague de transition vers le contenu */}
                <svg className="absolute bottom-0 left-0 w-full text-slate-50" viewBox="0 0 1440 64" fill="currentColor" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 64h1440V32c-211 24-421 32-720 32S211 8 0 32v32z" />
                </svg>
            </div>

            {/* Action Bar (Overlapping) */}
            <div className="relative -mt-12 z-20">
                <ActionBar />
            </div>
        </div>
    );
}
