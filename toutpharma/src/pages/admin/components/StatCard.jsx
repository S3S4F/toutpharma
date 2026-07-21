import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StatCard({ title, value, icon, colorClass, link, description }) {
    const Icon = icon;
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-hover hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                    <Icon className={colorClass.replace('bg-', 'text-')} size={24} />
                </div>
                {link && (
                    <Link to={link} className="text-slate-400 hover:text-giphar-green transition-colors">
                        <ChevronRight size={20} />
                    </Link>
                )}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
                {description && <p className="text-xs text-slate-400 mt-2">{description}</p>}
            </div>
        </div>
    );
}
