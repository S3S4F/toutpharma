import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Heart, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-giphar-green text-slate-300 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-giphar-green-light rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                +
                            </div>
                            <span className="text-2xl font-bold text-white">ToutPharma</span>
                        </div>
                        <p className="text-green-200 text-sm leading-relaxed">
                            Votre partenaire de confiance pour tous vos besoins médicaux. Nous assurons une livraison sûre, rapide et fiable de matériel médical.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-giphar-orange transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-giphar-orange transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-giphar-orange transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-giphar-orange transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Entreprise</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-giphar-orange transition-colors">À Propos</a></li>
                            <li><a href="#" className="hover:text-giphar-orange transition-colors">Notre Boutique</a></li>
                            <li><a href="#" className="hover:text-giphar-orange transition-colors">Livraison</a></li>
                            <li><a href="#" className="hover:text-giphar-orange transition-colors">Politique de Confidentialité</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-giphar-orange transition-colors">Centre d'Aide</a></li>
                            <li><a href="#" className="hover:text-giphar-orange transition-colors">Conditions Générales</a></li>
                            <li><a href="#" className="hover:text-giphar-orange transition-colors">Légal</a></li>
                            <li><a href="#" className="hover:text-giphar-orange transition-colors">Statut</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Restez informé</h4>
                        <div className="space-y-4">
                            <p className="text-xs text-green-200">Abonnez-vous à notre newsletter pour les dernières mises à jour.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="bg-giphar-green-dark border-none rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-giphar-orange outline-none text-white placeholder:text-green-300"
                                />
                                <button className="bg-giphar-orange hover:bg-giphar-orange-hover text-white p-2.5 rounded-lg transition-colors">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-green-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-green-200">
                    <p>© 2024 ToutPharma. Tous droits réservés.</p>
                    <p className="flex items-center gap-1">Fait avec <Heart size={14} className="text-giphar-orange fill-giphar-orange" /> au Sénégal</p>
                </div>
            </div>
        </footer>
    );
}
