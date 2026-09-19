import React from 'react';
import { Link } from 'react-router-dom';
import { categoryMeta } from '../../lib/categories';
import Reveal from '../ui/Reveal';

// Rayons de la boutique : chaque carte ouvre le catalogue déjà filtré
// sur la catégorie (deep-link ?categorie=…).
export default function CategoryList({ categories }) {
    return (
        <div className="py-10">
            <Reveal className="flex justify-between items-center mb-8 px-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Parcourir par catégorie
                        <span className="block w-12 h-1 bg-giphar-orange rounded-full mt-2" aria-hidden="true"></span>
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm">Trouvez rapidement l'équipement qu'il faut à votre officine.</p>
                </div>
            </Reveal>

            <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
                {categories.map((cat, index) => {
                    const meta = categoryMeta(cat.name);
                    const Icon = meta.icon;
                    return (
                        <Reveal key={cat.id} delay={index * 60}>
                            <Link
                                to={`/equipements?categorie=${encodeURIComponent(cat.name)}`}
                                className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-soft hover:shadow-lift hover:border-giphar-green-light/40 hover:-translate-y-0.5 transition-all duration-300 min-w-[max-content] group"
                            >
                                <div className="p-2.5 bg-green-50 rounded-xl text-giphar-green group-hover:bg-giphar-green group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <span className="block font-semibold text-slate-700 group-hover:text-giphar-green transition-colors">{cat.name}</span>
                                    {meta.blurb && (
                                        <span className="block text-xs text-slate-400 max-w-[180px] truncate">{meta.blurb}</span>
                                    )}
                                </div>
                            </Link>
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}
