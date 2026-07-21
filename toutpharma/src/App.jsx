import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import CategoryList from './components/home/CategoryList';
import PopularProducts from './components/home/PopularProducts';
import CartSidebar from './components/cart/CartSidebar';
import Footer from './components/layout/Footer';
import Equipment from './pages/Equipment';
import Delivery from './pages/Delivery';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Prescription from './pages/Prescription';
import { CartProvider } from './context/CartContext';

import Login from './pages/admin/Login';

import AdminLayout from './pages/admin/layout/AdminLayout';
import AdminHome from './pages/admin/pages/AdminHome';
import AdminProducts from './pages/admin/pages/AdminProducts';
import AdminOrders from './pages/admin/pages/AdminOrders';
import AdminAppointments from './pages/admin/pages/AdminAppointments';
import AdminPrescriptions from './pages/admin/pages/AdminPrescriptions';
import AdminSettings from './pages/admin/pages/AdminSettings';
import ProductForm from './pages/admin/ProductForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Loader } from 'lucide-react';
import { useProducts } from './hooks/useProducts';
import { uniqueCategories } from './utils/format';

// Home Component to keep App clean
const Home = () => {
  const { products, loading } = useProducts();

  // Derive categories from products, or use defaults if empty
  const derivedCategories = products.length > 0
    ? uniqueCategories(products).map((cat, index) => ({
      id: index,
      name: cat,
      icon: 'LayoutGrid' // Default icon, purely visual
    }))
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-giphar-green" size={48} />
      </div>
    );
  }

  return (
    <main>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length > 0 && <CategoryList categories={derivedCategories} />}
        <PopularProducts products={products.slice(0, 8)} />
      </div>
      <AppDownloadSection />
    </main>
  );
};

// App Download Section (extracted for reuse if needed, or just organization)
const AppDownloadSection = () => (
  <section className="bg-gradient-to-br from-green-50 to-orange-50 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Application Pro pour Pharmaciens</h2>
          <p className="text-slate-600 mb-8 max-w-md">
            Gérez vos approvisionnements en quelques clics. Notre application dédiée aux professionnels sera bientôt disponible pour faciliter vos commandes de stock.
          </p>
          <div className="flex gap-4">
            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors opacity-75 cursor-not-allowed">
              <span className="text-xs text-left">
                <div>Télécharger sur</div>
                <div className="text-lg font-bold">App Store</div>
              </span>
            </button>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors">
              <span className="text-xs text-left">
                <div>Disponible sur</div>
                <div className="text-lg font-bold">Google Play</div>
              </span>
            </button>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=600"
            alt="Mobile App"
            className="rounded-3xl shadow-2xl mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500"
          />
          <div className="absolute top-10 -right-4 w-24 h-24 bg-giphar-orange rounded-full blur-2xl opacity-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  </section>
);



function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
          <Navbar />
          <CartSidebar />

          <div className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/equipements" element={<Equipment />} />
              <Route path="/livraison" element={<Delivery />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ordonnance" element={<Prescription />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminHome />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="prescriptions" element={<AdminPrescriptions />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
