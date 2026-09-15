import React from 'react';
import { Camera, Calendar, ShoppingBag, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

export default function ActionBar() {
    const actions = [
        {
            icon: <ShoppingBag size={24} />,
            label: "Catalogue matériel",
            sub: "Ajoutez au devis",
            link: "/equipements",
            color: "text-giphar-green bg-green-50"
        },
        {
            icon: <MessageCircle size={24} />,
            label: "Commande WhatsApp",
            sub: "Bon de commande PDF",
            link: "/equipements",
            color: "text-emerald-600 bg-emerald-50"
        },
        {
            icon: <Camera size={24} />,
            label: "Envoyer Ordonnance",
            sub: "Photo rapide",
            link: "/ordonnance",
            color: "text-blue-600 bg-blue-50"
        },
        {
            icon: <Calendar size={24} />,
            label: "Prendre RDV",
            sub: "Vaccin, Test...",
            link: "/services",
            color: "text-giphar-orange bg-orange-50"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lift border border-slate-100 p-4 sm:p-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {actions.map((action, index) => (
                        <Reveal key={action.label} delay={index * 80}>
                            <Link
                                to={action.link}
                                className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/80 hover:shadow-soft transition-all duration-300 group h-full"
                            >
                                <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                                    {action.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 leading-tight">{action.label}</h3>
                                    <p className="text-xs text-slate-500">{action.sub}</p>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </div>
    );
}
