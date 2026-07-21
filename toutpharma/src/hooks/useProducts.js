import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

// Récupération des produits — factorise le pattern fetch/loading/erreur qui
// était copié dans Home (App.jsx), Equipment et AdminProducts.
export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const refetch = useCallback(async () => {
        try {
            setProducts(await api.getProducts());
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { products, loading, refetch };
}
