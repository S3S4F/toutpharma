import React, { useRef, useState } from 'react';
import { Plus, Check, ImageOff } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { assetUrl } from '../../lib/api';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    // Micro-feedback : le bouton confirme visuellement l'ajout pendant ~1 s.
    const [added, setAdded] = useState(false);
    const timerRef = useRef(null);

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setAdded(false), 1100);
    };

    return (
        <div className="h-full bg-white p-4 rounded-3xl shadow-soft border border-slate-100 hover:shadow-lift hover:border-giphar-green-light/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="relative mb-4 overflow-hidden rounded-2xl bg-slate-50 h-48 flex items-center justify-center">
                {(product.image_url || product.image) ? (
                    <img
                        src={assetUrl(product.image_url || product.image)}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <span className="flex flex-col items-center gap-2 text-slate-300">
                        <ImageOff size={28} />
                        <span className="text-xs font-medium">Image à venir</span>
                    </span>
                )}
                {/* Bouton d'ajout : toujours visible au tactile, révélé au survol
                    sur desktop — zone de touche ≥ 44px. */}
                <button
                    onClick={handleAdd}
                    aria-label={`Ajouter ${product.name} à la demande de devis`}
                    className={`absolute bottom-3 right-3 p-2.5 rounded-xl shadow-md transition-all duration-300 cursor-pointer active:scale-90
                        ${added
                            ? 'bg-giphar-green text-white animate-pop'
                            : 'bg-white text-giphar-green hover:bg-giphar-green hover:text-white sm:translate-y-14 sm:group-hover:translate-y-0'}`}
                >
                    {added ? <Check size={20} /> : <Plus size={20} />}
                </button>
            </div>

            <div className="flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 mb-1 leading-snug">{product.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{product.category}</p>

                {/* Modèle B2B : les prix ne sont jamais affichés au client,
                    tout passe par une demande de devis. */}
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-semibold text-giphar-green bg-green-50 px-2.5 py-1 rounded-md">Sur devis</span>
                    <button
                        onClick={handleAdd}
                        className="text-xs font-bold text-slate-400 hover:text-giphar-green transition-colors cursor-pointer"
                    >
                        {added ? 'Ajouté ✓' : '+ Ajouter'}
                    </button>
                </div>
            </div>
        </div>
    );
}
