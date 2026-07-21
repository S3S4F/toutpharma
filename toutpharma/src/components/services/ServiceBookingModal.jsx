import React, { useState } from 'react';
import { X, Calendar, Clock, Phone, User, CheckCircle } from 'lucide-react';
import { api } from '../../lib/api';

export default function ServiceBookingModal({ service, onClose }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        name: '',
        phone: '',
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simulating API call
        try {
            const res = await api.createAppointment({
                client_name: formData.name,
                phone: formData.phone,
                service_type: service.title,
                date_time: `${formData.date} ${formData.time}`
            });
            if (res.ok) setStep(3);
        } catch (err) {
            console.error(err);
        }
    };

    if (!service) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">

                {/* Header */}
                <div className="bg-giphar-green p-6 flex justify-between items-start text-white">
                    <div>
                        <h2 className="text-xl font-bold">{service.title}</h2>
                        <p className="text-giphar-green-light text-sm mt-1">{service.description}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 1 && (
                        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Choisissez une date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="date"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-giphar-green outline-none"
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Choisissez un horaire</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, time })}
                                            className={`py-2 rounded-lg border text-sm font-medium transition-colors ${formData.time === time
                                                    ? 'bg-giphar-green text-white border-giphar-green'
                                                    : 'border-gray-200 hover:border-giphar-green text-gray-600'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!formData.date || !formData.time}
                                className="w-full bg-giphar-orange hover:bg-giphar-orange-hover text-white py-3 rounded-xl font-bold mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continuer
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Vos coordonnées</label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Nom complet"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-giphar-green outline-none"
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <input
                                            type="tel"
                                            placeholder="Numéro de téléphone"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-giphar-green outline-none"
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 flex gap-3">
                                <Clock size={20} className="text-giphar-green" />
                                <div>
                                    <p className="font-bold text-gray-900">Réservation pour le {formData.date}</p>
                                    <p>à {formData.time} - {service.title}</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-giphar-green hover:bg-giphar-green-dark text-white py-3 rounded-xl font-bold mt-4"
                            >
                                Confirmer le Rendez-vous
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-500 py-2 font-medium hover:text-gray-700"
                            >
                                Retour
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce-slow">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Rendez-vous Confirmé !</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">
                                Merci {formData.name}, nous vous attendons le {formData.date} à {formData.time}.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
