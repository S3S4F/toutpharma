import React from 'react';
import { Camera, Calendar, ShoppingBag, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActionBar() {
    const actions = [
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
        },
        {
            icon: <ShoppingBag size={24} />,
            label: "Retrait Express",
            sub: "Disponible en 2h",
            link: "/equipements",
            color: "text-giphar-green DEFAULT bg-green-50"
        },
        {
            icon: <Percent size={24} />,
            label: "Nos Offres",
            sub: "Promotions",
            link: "/equipements",
            color: "text-red-500 bg-red-50"
        }
    ];

    return (
        <div className="bg-white py-8 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {actions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.link}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
                        >
                            <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                                {action.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 leading-tight">{action.label}</h3>
                                <p className="text-xs text-slate-500">{action.sub}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
