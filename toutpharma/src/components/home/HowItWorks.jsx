import React from 'react';
import { Search, Send, FileCheck2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

// Parcours B2B en 3 étapes : c'est l'argument de conversion principal
// (« comment je commande ? ») présenté avant le pied de page.
const steps = [
    {
        icon: Search,
        title: '1. Parcourez le catalogue',
        text: 'Matériel médical, consommables, équipements — ajoutez les références et quantités dont votre structure a besoin.',
    },
    {
        icon: Send,
        title: '2. Envoyez votre demande',
        text: 'Votre bon de commande est enregistré et généré en PDF, puis transmis directement sur WhatsApp. Aucun compte requis.',
    },
    {
        icon: FileCheck2,
        title: '3. Recevez votre devis sous 24h',
        text: 'Notre équipe confirme disponibilité, prix et délais de livraison, partout au Sénégal.',
    },
];

export default function HowItWorks() {
    return (
        <section className="bg-white py-20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#004b38 1px, transparent 1px)', backgroundSize: '20px 20px' }} aria-hidden="true"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <Reveal className="text-center max-w-2xl mx-auto mb-14">
                    <span className="inline-block px-4 py-1.5 bg-green-50 text-giphar-green rounded-full font-bold text-sm mb-4 tracking-wide uppercase">
                        Simple et rapide
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
                        Commandez en 3 étapes
                    </h2>
                    <p className="text-slate-500 text-lg">
                        Pas de compte, pas de paperasse : du catalogue au devis en quelques minutes.
                    </p>
                </Reveal>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
                    {steps.map(({ icon: Icon, title, text }, index) => (
                        <Reveal key={title} delay={index * 130}>
                            <div className="relative h-full bg-slate-50/70 border border-slate-100 rounded-3xl p-8 hover:shadow-lift hover:-translate-y-1 hover:bg-white transition-all duration-300 group">
                                <div className="w-14 h-14 rounded-2xl bg-giphar-green text-white flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 group-hover:bg-giphar-green-dark transition-all duration-300">
                                    <Icon size={26} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                                <p className="text-slate-500 leading-relaxed">{text}</p>
                                {index < steps.length - 1 && (
                                    <ArrowRight
                                        size={22}
                                        aria-hidden="true"
                                        className="hidden md:block absolute top-1/2 -right-4 lg:-right-6 -translate-y-1/2 text-giphar-green-light"
                                    />
                                )}
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={200} className="text-center mt-12">
                    <Link
                        to="/equipements"
                        className="group inline-flex items-center gap-2 bg-giphar-green hover:bg-giphar-green-dark text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-lift transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Commencer ma demande de devis
                        <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
