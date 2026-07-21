import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Calendar,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
        { path: '/admin/products', icon: Package, label: 'Produits' },
        { path: '/admin/appointments', icon: Calendar, label: 'Rendez-vous' },
        { path: '/admin/prescriptions', icon: FileText, label: 'Ordonnances' },
        { path: '/admin/settings', icon: Settings, label: 'Paramètres' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
            >
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
                        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-slate-800 tracking-tight">
                            <span className="w-10 h-10 bg-giphar-green rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-green-200">
                                P
                            </span>
                            PharMed
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        <div className="px-2 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Menu Principal
                        </div>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin/dashboard'}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? 'bg-giphar-green text-white shadow-lg shadow-green-200 font-medium'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-giphar-green'
                                    }
                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-giphar-green transition-colors'} />
                                        <span className="flex-1">{item.label}</span>
                                        {isActive && <ChevronRight size={16} className="text-white/80" />}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="p-4 border-t border-slate-100">
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                A
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">Administrateur</p>
                                <p className="text-xs text-slate-500 truncate">admin@pharmed.com</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
                        >
                            <LogOut size={18} />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 flex items-center px-4 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-3 font-semibold text-slate-900">Administration</span>
                </header>

                {/* Page Content */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
