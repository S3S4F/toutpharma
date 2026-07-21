import React from 'react';
import { ShoppingCart, Search, Menu, MapPin, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PharmacyStatus from './PharmacyStatus';

export default function Navbar() {
    const { totalItems, setIsOpen } = useCart();

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            {/* Top Bar - Contact & Hours */}
            <div className="bg-giphar-green text-white text-xs py-2 hidden sm:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4 opacity-90">
                        <span>📍 Dakar, Sénégal</span>
                        <span>📞 +221 33 123 45 67</span>
                    </div>
                    <div className="flex items-center gap-4 font-medium">
                        <span className="hover:underline cursor-pointer">Mon Compte</span>
                        <span className="hover:underline cursor-pointer">Contact</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
                        <div className="w-10 h-10 bg-giphar-green-light rounded-tl-xl rounded-br-xl flex items-center justify-center text-white font-bold text-2xl group-hover:bg-giphar-green transition-colors">
                            +
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-giphar-green leading-none tracking-tight">
                                ToutPharma
                            </span>
                            <span className="text-[10px] text-giphar-green font-medium tracking-widest uppercase opacity-70">
                                Grossiste Médical
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar - Central */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-auto">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Rechercher un produit, un médicament..."
                                className="w-full pl-5 pr-12 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-giphar-green/20 focus:border-giphar-green outline-none transition-all placeholder:text-gray-400"
                            />
                            <button className="absolute right-2 top-1.5 p-1.5 bg-giphar-green text-white rounded-full hover:bg-giphar-green-dark transition-colors">
                                <Search size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        {/* Status Badge */}
                        <div className="hidden xl:block">
                            <PharmacyStatus />
                        </div>

                        {/* Account */}
                        <a href="/admin/login" className="hidden lg:flex flex-col items-center text-gray-500 hover:text-giphar-green transition-colors group">
                            <User size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-medium mt-1">PRO</span>
                        </a>

                        {/* Cart */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="relative flex flex-col items-center text-gray-500 hover:text-giphar-green transition-colors group"
                        >
                            <div className="relative">
                                <ShoppingCart size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-giphar-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium mt-1">Panier</span>
                        </button>

                        <button className="md:hidden p-2 text-gray-600">
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Secondary Navigation */}
            <div className="border-t border-gray-50 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8 text-sm font-medium h-12 text-gray-600">
                        <Link to="/equipements" className="hover:text-giphar-green transition-colors flex items-center gap-1">
                            Matériel Médical <ChevronDown size={14} />
                        </Link>
                        <Link to="/services" className="hover:text-giphar-green transition-colors">
                            Services & Rendez-vous
                        </Link>
                        <Link to="/livraison" className="hover:text-giphar-green transition-colors">
                            Livraison 24h
                        </Link>
                        <Link to="/ordonnance" className="text-giphar-orange font-bold hover:text-giphar-orange-hover transition-colors">
                            Envoyer Ordonnance
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
