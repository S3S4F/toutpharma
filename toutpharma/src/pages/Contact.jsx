import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    return (
        <div className="py-12 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-6">Contactez-nous</h1>
                        <p className="text-slate-600 text-lg mb-12">
                            Une question sur un produit ou une commande ? Notre équipe est là pour vous aider du lundi au samedi.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
                                <div className="p-3 bg-green-100 text-giphar-green rounded-xl">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">Téléphone</h3>
                                    <p className="text-slate-500 mb-2">Du Lundi au Samedi, 9h - 19h</p>
                                    <p className="font-semibold text-giphar-green text-lg">+221 33 123 45 67</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
                                <div className="p-3 bg-green-100 text-giphar-green rounded-xl">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                                    <p className="text-slate-500 mb-2">Nous répondons sous 24h</p>
                                    <p className="font-semibold text-giphar-green text-lg">contact@toutpharma.sn</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
                                <div className="p-3 bg-green-100 text-giphar-green rounded-xl">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">Adresse</h3>
                                    <p className="text-slate-500">
                                        Avenue Léopold Sédar Senghor<br />
                                        Dakar, Sénégal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Envoyez-nous un message</h2>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all"
                                        placeholder="Mamadou"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all"
                                        placeholder="Diallo"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all"
                                    placeholder="mamadou.diallo@exemple.sn"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all resize-none"
                                    placeholder="Comment pouvons-nous vous aider ?"
                                ></textarea>
                            </div>

                            <button className="w-full bg-giphar-orange hover:bg-giphar-orange-hover text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]">
                                Envoyer le message <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
