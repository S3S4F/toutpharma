import React from 'react';
import ProductCard from '../ui/ProductCard';

export default function PopularProducts({ products }) {
    return (
        <div className="py-16">
            <div className="flex justify-between items-end mb-10 px-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Produits Populaires</h2>
                    <p className="text-slate-500">Nos meilleures ventes de la semaine</p>
                </div>
                <button className="text-blue-600 font-medium hover:text-blue-700">Voir tout</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
