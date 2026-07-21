import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Search, Pencil } from 'lucide-react';
import { api } from '../../../lib/api';
import { useProducts } from '../../../hooks/useProducts';

export default function AdminProducts() {
    const { products, refetch } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerSearch) ||
            p.category.toLowerCase().includes(lowerSearch)
        );
    }, [searchTerm, products]);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await api.deleteProduct(id);
                refetch();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Produits</h1>
                    <p className="text-slate-500">Gérez votre catalogue produit ({products.length})</p>
                </div>
                <Link
                    to="/admin/products/new"
                    className="bg-giphar-green hover:bg-giphar-green-dark text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-colors"
                >
                    <Plus size={20} /> Nouveau
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-giphar-green/50 text-slate-700"
                    />
                </div>
                {/* Future Filter Logic can be added here */}
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4 pl-6">Produit</th>
                                <th className="p-4">Catégorie</th>
                                <th className="p-4">Prix</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-semibold text-slate-900 line-clamp-2">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600 font-medium">
                                        {product.price ? `${Number(product.price).toLocaleString('fr-FR')} FCFA` : 'Sur devis'}
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <Link
                                            to={`/admin/products/${product.id}/edit`}
                                            className="inline-flex p-2 text-slate-400 hover:text-giphar-green hover:bg-green-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Modifier"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center">
                                            <Search size={48} className="mb-4 text-slate-200" />
                                            <p>Aucun produit ne correspond à votre recherche.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
