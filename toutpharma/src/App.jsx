import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import CategoryList from './components/home/CategoryList';
import PopularProducts from './components/home/PopularProducts';
import HowItWorks from './components/home/HowItWorks';
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
      <HowItWorks />
    </main>
  );
};



// Fondu léger à chaque changement de page publique. Les pages admin gardent
// une clé stable pour ne pas remonter la sidebar à chaque navigation interne.
const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <div key={isAdmin ? 'admin' : location.pathname} className={isAdmin ? undefined : 'animate-fade-in'}>
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
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
          <Navbar />
          <CartSidebar />

          <div className="flex-grow">
            <AnimatedRoutes />
          </div>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
