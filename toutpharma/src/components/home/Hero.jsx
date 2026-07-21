import React from 'react';
import { Search, ShieldCheck, Clock } from 'lucide-react';
import livreurImage from '../../assets/images/imagelivreur.png';
import ActionBar from '../layout/ActionBar';

export default function Hero() {
    return (
        <div>
            {/* Main Hero Area */}
            <div className="relative bg-giphar-green pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Text Content */}
                        <div className="space-y-8 text-white">
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-giphar-green-light/20 border border-giphar-green-light/30 rounded-full text-giphar-green-light font-bold text-sm mb-6 tracking-wide uppercase">
                                    Grossiste Pharmaceutique N°1
                                </span>
                                <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                                    Votre partenaire santé <br />
                                    <span className="text-giphar-green-light relative">
                                        proche de vous
                                        <svg className="absolute w-full h-3 -bottom-2 left-0 text-white opacity-20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    </span>
                                </h1>
                                <p className="text-lg text-blue-100 max-w-xl leading-relaxed">
                                    ToutPharma équipe plus de 500 pharmacies au Sénégal. Matériel médical, consommables et services de vaccination.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="/services"
                                    className="bg-giphar-orange hover:bg-giphar-orange-hover text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center"
                                >
                                    Prendre Rendez-vous
                                </a>
                                <a
                                    href="/equipements"
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg backdrop-blur-sm transition-all text-center"
                                >
                                    Voir le catalogue
                                </a>
                            </div>

                            <div className="flex items-center gap-6 pt-4 opacity-80 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    <span>Stock en temps réel</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    <span>Livraison 24h</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative hidden lg:block">
                            <div className="relative z-10 p-4 bg-white/10 backdrop-blur-sm rounded-[2.5rem] border border-white/20">
                                <img
                                    src={livreurImage}

                                    alt="Expert Santé"
                                    className="w-full h-auto rounded-[2rem] shadow-2xl brightness-110"
                                />

                                {/* Floating Badge */}
                                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl animate-bounce-slow">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-giphar-green p-3 rounded-full text-white">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Confiance</p>
                                            <p className="font-bold text-slate-900 text-lg">Certifié ISO</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Action Bar (Overlapping) */}
            <div className="relative -mt-12 z-20">
                <ActionBar />
            </div>
        </div>
    );
}
