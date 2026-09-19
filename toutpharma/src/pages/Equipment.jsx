import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import Reveal from '../components/ui/Reveal';
import { SlidersHorizontal, Loader, PackageSearch } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { uniqueCategories } from '../utils/format';
import { categoryMeta } from '../lib/categories';

export default function Equipment() {
    const { products, loading } = useProducts();
    // Le filtre vit dans l'URL (?categorie=…) : les cartes de l'accueil,
    // le partage de lien et le bouton retour fonctionnent naturellement.
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get('categorie') || 'Tous';

    const selectCategory = (cat) => {
        setSearchParams(cat === 'Tous' ? {} : { categorie: cat }, { preventScrollReset: true });
    };

    // Extract unique categories
    const categories = ['Tous', ...uniqueCategories(products)];

    // Nombre de produits par catégorie (affiché dans les pastilles)
    const countFor = (cat) =>
        cat === 'Tous' ? products.length : products.filter((p) => p.category === cat).length;

    // Filter products (une catégorie inconnue dans l'URL = aucun résultat,
    // l'état vide propose de revenir à « Tous »)
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
            <div className="relative bg-gradient-to-br from-giphar-green to-giphar-green-dark py-16 mb-12 overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <h1 className="text-4xl font-extrabold text-white mb-4 animate-fade-up">Catalogue équipements</h1>
                    <p className="text-green-100 max-w-2xl text-lg animate-fade-up" style={{ animationDelay: '100ms' }}>
                        Diagnostic, consommables, mobilier, agencement d'officine… Ajoutez vos
                        références au panier, recevez votre devis sous 24h.
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
                    {categories.map(cat => {
                        const isActive = selectedCategory === cat;
                        const Icon = cat === 'Tous' ? null : categoryMeta(cat).icon;
                        return (
                            <button
                                key={cat}
                                onClick={() => selectCategory(cat)}
                                aria-pressed={isActive}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap cursor-pointer active:scale-95 ${isActive
                                        ? 'bg-giphar-green text-white shadow-lg shadow-green-200 scale-105'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-giphar-green hover:text-giphar-green'
                                    }`}
                            >
                                {Icon && <Icon size={16} className={isActive ? 'text-giphar-green-light' : 'text-slate-400'} />}
                                {cat}
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {countFor(cat)}
                                </span>
                            </button>
                        );
                    })}
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
                        {Object.entries(groupedProducts).map(([category, items]) => {
                            const meta = categoryMeta(category);
                            const Icon = meta.icon;
                            return (
                                <div key={category}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-green-50 rounded-lg text-giphar-green">
                                            <Icon size={20} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">{category}</h2>
                                        <span className="text-sm text-slate-400 font-medium">({items.length})</span>
                                        <div className="h-px flex-1 bg-slate-200"></div>
                                        <button
                                            onClick={() => selectCategory(category)}
                                            className="text-sm font-semibold text-giphar-green hover:text-giphar-green-dark whitespace-nowrap cursor-pointer"
                                        >
                                            Voir la catégorie →
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {items.map((product, index) => (
                                            <Reveal key={product.id} delay={(index % 4) * 90}>
                                                <ProductCard product={product} />
                                            </Reveal>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Show filtered products
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {selectedCategory} <span className="text-slate-400 text-lg font-normal">({filteredProducts.length})</span>
                            </h2>
                        </div>
                        <div key={selectedCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product, index) => (
                                <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${(index % 8) * 50}ms` }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                <PackageSearch size={40} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-500 mb-4">Aucun produit dans « {selectedCategory} » pour le moment.</p>
                                <button
                                    onClick={() => selectCategory('Tous')}
                                    className="text-giphar-green font-semibold hover:text-giphar-green-dark cursor-pointer"
                                >
                                    ← Voir tout le catalogue
                                </button>
                            </div>
                        )}
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
