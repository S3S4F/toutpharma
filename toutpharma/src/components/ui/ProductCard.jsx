import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
            <div className="relative mb-4 overflow-hidden rounded-2xl bg-gray-50 h-48 flex items-center justify-center">
                <img
                    src={product.image_url || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-3 right-3 bg-white p-2 rounded-xl text-blue-600 shadow-md hover:bg-blue-600 hover:text-white transition-colors transform translate-y-12 group-hover:translate-y-0"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div>
                <h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{product.category}</p>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Sur devis</span>
                </div>
            </div>
        </div>
    );

}
