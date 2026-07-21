import React from 'react';
import { Baby, Sparkles, User, Pill, Stethoscope } from 'lucide-react';

const icons = {
    Baby: Baby,
    Sparkles: Sparkles,
    User: User,
    Pill: Pill,
    Stethoscope: Stethoscope
};

export default function CategoryList({ categories }) {
    return (
        <div className="py-10">
            <div className="flex justify-between items-center mb-8 px-4">
                <h2 className="text-2xl font-bold text-slate-900">Parcourir les catégories</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
                {categories.map((cat) => {
                    const Icon = icons[cat.icon] || Pill;
                    return (
                        <button
                            key={cat.id}
                            className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-blue-50 transition-all min-w-[max-content] group"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Icon size={20} />
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-blue-700">{cat.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
