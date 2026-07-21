import React, { useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { SlidersHorizontal, Loader } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { uniqueCategories } from '../utils/format';

export default function Equipment() {
    const { products, loading } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState('Tous');

    // Extract unique categories
    const categories = ['Tous', ...uniqueCategories(products)];

    // Filter products
    const filteredProducts = selectedCategory === 'Tous'
        ? products
        : products.filter(p => p.category === selectedCategory);

    // Grouping logic (used when "Tous" is selected)
    const groupedProducts = filteredProducts.reduce((acc, product) => {
        const cat = product.category || 'Autres';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});

    return (
        <div className="pt-8 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-giphar-green to-giphar-green-dark py-16 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Équipements Médicaux</h1>
                    <p className="text-green-100 max-w-2xl text-lg">
                        Découvrez notre gamme complète d'équipements médicaux et consommables pour l'approvisionnement de votre pharmacie.
                    </p>
                </div>
            </div>

            {/* Category Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex items-center gap-2 text-slate-500 mr-4">
                        <SlidersHorizontal size={20} />
                        <span className="font-medium">Filtrer :</span>
                    </div>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                                    ? 'bg-giphar-green text-white shadow-lg shadow-green-200 scale-105'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-giphar-green hover:text-giphar-green'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader className="animate-spin text-giphar-green" size={48} />
                    </div>
                ) : selectedCategory === 'Tous' ? (
                    // Show grouped by category
                    <div className="space-y-16">
                        {Object.entries(groupedProducts).map(([category, items]) => (
                            <div key={category}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-1 w-12 bg-giphar-orange rounded-full"></div>
                                    <h2 className="text-2xl font-bold text-slate-900">{category}</h2>
                                    <div className="h-px flex-1 bg-slate-200"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {items.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Show filtered products
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {selectedCategory} <span className="text-slate-400 text-lg font-normal">({filteredProducts.length})</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-lg">Aucun produit disponible pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
