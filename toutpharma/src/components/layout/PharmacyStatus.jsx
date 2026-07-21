import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function PharmacyStatus() {
    const [status, setStatus] = useState({ isOpen: false, label: "Chargement..." });

    useEffect(() => {
        const checkStatus = () => {
            api.getStatus()
                .then(data => {
                    setStatus({
                        isOpen: data.isOpen,
                        label: data.status || (data.isOpen ? "Ouvert" : "Fermé")
                    });
                })
                .catch(() => setStatus({ isOpen: false, label: "Indisponible" }));
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${status.isOpen
                ? 'bg-green-100 text-green-700 border-green-200'
                : 'bg-red-100 text-red-700 border-red-200'
            }`}>
            <div className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span>{status.label}</span>
        </div>
    );
}
