import React, { useState } from 'react';
import { Video, Baby, Activity, Stethoscope, Syringe, Heart, ArrowRight } from 'lucide-react';
import ServiceBookingModal from '../components/services/ServiceBookingModal';

export default function Services() {
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        {
            id: 'telemed',
            icon: <Video size={32} />,
            title: "Télé-consultation",
            description: "Parlez à un pharmacien ou un médecin en vidéo depuis chez vous.",
            color: "text-blue-600 bg-blue-50 hover:bg-blue-100"
        },
        {
            id: 'maternity',
            icon: <Baby size={32} />,
            title: "Maternité & Bébé",
            description: "Accompagnement grossesse, pesée bébé et conseils lactation.",
            color: "text-pink-500 bg-pink-50 hover:bg-pink-100"
        },
        {
            id: 'chronic',
            icon: <Activity size={32} />,
            title: "Maladies Chroniques",
            description: "Suivi personnalisé pour Diabète, Hypertension et Asthme.",
            color: "text-purple-600 bg-purple-50 hover:bg-purple-100"
        },
        {
            id: 'ortho',
            icon: <Stethoscope size={32} />,
            title: "Orthopédie",
            description: "Attelles, bas de contention et matériel de maintien à domicile.",
            color: "text-giphar-orange bg-orange-50 hover:bg-orange-100"
        },
        {
            id: 'vaccin',
            icon: <Syringe size={32} />,
            title: "Vaccination & Dépistage",
            description: "Vaccin Grippe, Covid-19, et tests TROD angine sans RDV.",
            color: "text-teal-600 bg-teal-50 hover:bg-teal-100"
        },
        {
            id: 'wellness',
            icon: <Heart size={32} />,
            title: "Bien-être & Nutrition",
            description: "Bilans micronutrition, phytothérapie et coaching santé.",
            color: "text-giphar-green bg-green-50 hover:bg-green-100"
        }
    ];

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header */}
            <div className="bg-giphar-green py-16 px-4">
                <div className="max-w-7xl mx-auto text-center text-white space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">Nos Services de Santé</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Bien plus qu'une pharmacie. Découvrez nos services d'accompagnement pour toute la famille.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => setSelectedService(service)}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-left hover:shadow-xl transition-all group flex flex-col items-start gap-4"
                        >
                            <div className={`p-4 rounded-2xl ${service.color} transition-colors`}>
                                {service.icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-giphar-green transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                            <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:gap-4 transition-all">
                                Prendre Rendez-vous <ArrowRight size={16} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Banner */}
            <div className="max-w-7xl mx-auto px-4 mt-20">
                <div className="bg-gradient-to-r from-giphar-green to-giphar-green-dark rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-bold">Besoin d'un conseil rapide ?</h2>
                        <p className="text-lg text-blue-100 max-w-xl mx-auto">
                            Nos pharmaciens sont disponibles par téléphone ou WhatsApp pour répondre à vos questions urgentes.
                        </p>
                        <a
                            href="https://wa.me/22100000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-giphar-orange hover:bg-giphar-orange-hover text-white px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105"
                        >
                            Discuter sur WhatsApp
                        </a>
                    </div>
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>
            </div>

            {/* Booking Modal */}
            {selectedService && (
                <ServiceBookingModal
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                />
            )}
        </div>
    );
}
