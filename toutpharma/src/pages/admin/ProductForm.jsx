import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Loader } from 'lucide-react';
import { api } from '../../lib/api';

// Formulaire produit : création (/admin/products/new) et édition
// (/admin/products/:id/edit) partagent le même composant.
export default function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        image: null,
        image_url: ''
    });
    const [preview, setPreview] = useState(null);

    // En édition : pré-remplir depuis le produit existant.
    useEffect(() => {
        if (!isEdit) return;
        api.getProducts().then((products) => {
            const product = products.find((p) => String(p.id) === String(id));
            if (product) {
                setFormData({
                    name: product.name || '',
                    category: product.category || '',
                    description: product.description || '',
                    price: product.price ?? '',
                    image: null,
                    image_url: product.image_url || ''
                });
                setPreview(product.image_url || null);
            }
        }).catch((e) => console.error('Error loading product:', e));
    }, [id, isEdit]);

    const categories = [
        "Matériel Médical",
        "Consommables",
        "Diagnostic",
        "Mobilier",
        "Orthopédie",
        "Autre"
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Image (en édition, l'image existante est conservée si
            // aucune nouvelle n'est choisie)
            let imageUrl = formData.image_url;
            if (formData.image) {
                const imageFormData = new FormData();
                imageFormData.append('image', formData.image);
                const uploadData = await api.uploadImage(imageFormData);
                imageUrl = uploadData.imageUrl;
            }

            // 2. Create or Update Product
            const body = {
                name: formData.name,
                category: formData.category,
                description: formData.description,
                price: formData.price === '' ? null : parseFloat(formData.price),
                image_url: imageUrl
            };
            const res = isEdit
                ? await api.updateProduct(id, body)
                : await api.createProduct(body);

            if (res.ok) {
                navigate('/admin/products');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erreur lors de l\'enregistrement du produit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="max-w-2xl mx-auto px-4">
                <Link to="/admin/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors">
                    <ArrowLeft size={20} /> Retour
                </Link>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h1 className="text-2xl font-bold text-slate-900 mb-8">
                        {isEdit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Image du produit</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-giphar-green hover:bg-green-50/50 transition-all cursor-pointer relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required={!isEdit}
                                />

                                {preview ? (
                                    <div className="relative w-32 h-32 mx-auto">
                                        <img src={preview} alt="Aperçu" className="w-full h-full object-cover rounded-xl shadow-md" />
                                        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs font-bold">Changer</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-giphar-green transition-colors">
                                        <Upload size={32} className="mb-2" />
                                        <span className="text-sm font-medium">Cliquez pour ajouter une image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nom du produit</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all"
                                placeholder="Ex: Tensiomètre Électronique"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                            <div className="relative">
                                <input
                                    list="categories"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all"
                                    placeholder="Sélectionnez ou écrivez une catégorie"
                                    required
                                />
                                <datalist id="categories">
                                    {categories.map(cat => <option key={cat} value={cat} />)}
                                </datalist>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Prix (FCFA) — laisser vide pour « Sur devis »
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all"
                                placeholder="Ex: 45000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                                rows="4"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all resize-none"
                                placeholder="Description détaillée du produit..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-giphar-green hover:bg-giphar-green-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin" /> Enregistrement...
                                </>
                            ) : (
                                "Enregistrer le produit"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
