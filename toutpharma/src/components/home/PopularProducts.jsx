import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';
import Reveal from '../ui/Reveal';

export default function PopularProducts({ products }) {
    return (
        <div className="py-16">
            <Reveal className="flex justify-between items-end mb-10 px-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Produits populaires
                        <span className="block w-12 h-1 bg-giphar-orange rounded-full mt-2" aria-hidden="true"></span>
                    </h2>
                    <p className="text-slate-500">Les équipements les plus demandés par les pharmacies et cliniques</p>
                </div>
                <Link
                    to="/equipements"
                    className="hidden sm:inline-flex items-center gap-1.5 text-giphar-green font-semibold hover:text-giphar-green-dark group whitespace-nowrap"
                >
                    Voir tout
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                {products.map((product, index) => (
                    <Reveal key={product.id} delay={(index % 4) * 90}>
                        <ProductCard product={product} />
                    </Reveal>
                ))}
            </div>

            <div className="sm:hidden px-4 mt-8">
                <Link
                    to="/equipements"
                    className="flex items-center justify-center gap-2 w-full bg-giphar-green text-white py-3.5 rounded-xl font-bold"
                >
                    Voir tout le catalogue
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}
