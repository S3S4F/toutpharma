import React from 'react';
import { Baby, Sparkles, User, Pill, Stethoscope, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

const icons = {
    Baby: Baby,
    Sparkles: Sparkles,
    User: User,
    Pill: Pill,
    Stethoscope: Stethoscope,
    LayoutGrid: LayoutGrid
};

export default function CategoryList({ categories }) {
    return (
        <div className="py-10">
            <Reveal className="flex justify-between items-center mb-8 px-4">
                <h2 className="text-2xl font-bold text-slate-900">
                    Parcourir les catégories
                    <span className="block w-12 h-1 bg-giphar-orange rounded-full mt-2" aria-hidden="true"></span>
                </h2>
            </Reveal>

            <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
                {categories.map((cat, index) => {
                    const Icon = icons[cat.icon] || Pill;
                    return (
                        <Reveal key={cat.id} delay={index * 60}>
                            <Link
                                to="/equipements"
                                className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-soft hover:shadow-lift hover:border-giphar-green-light/40 hover:-translate-y-0.5 transition-all duration-300 min-w-[max-content] group"
                            >
                                <div className="p-2 bg-green-50 rounded-lg text-giphar-green group-hover:bg-giphar-green group-hover:text-white transition-colors duration-300">
                                    <Icon size={20} />
                                </div>
                                <span className="font-semibold text-slate-700 group-hover:text-giphar-green transition-colors">{cat.name}</span>
                            </Link>
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}
