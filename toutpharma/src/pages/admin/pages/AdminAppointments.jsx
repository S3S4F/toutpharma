import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Phone } from 'lucide-react';
import { api } from '../../../lib/api';
import { formatDate, DATE_LONG } from '../../../utils/format';

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setAppointments(await api.getAppointments());
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (apt, status) => {
        setAppointments((prev) => prev.map((a) => (a.id === apt.id ? { ...a, status } : a)));
        try {
            await api.updateAppointment(apt.id, { status });
        } catch (error) {
            console.error('Error updating appointment:', error);
        } finally {
            fetchAppointments();
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Rendez-vous</h1>
                <p className="text-slate-500">Suivi des demandes de rendez-vous ({appointments.length})</p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-purple-50 text-purple-600 p-2.5 rounded-xl">
                                    <Calendar size={24} />
                                </div>
                                <select
                                    value={apt.status || 'pending'}
                                    onChange={(e) => handleStatusChange(apt, e.target.value)}
                                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border-0 cursor-pointer outline-none
                                    ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-slate-100 text-slate-600'}
                                `}>
                                    <option value="pending">En attente</option>
                                    <option value="confirmed">Confirmé</option>
                                    <option value="cancelled">Annulé</option>
                                </select>
                            </div>

                            <div className="space-y-3 flex-1">
                                <div className="flex items-start gap-3">
                                    <Clock className="text-slate-400 shrink-0 mt-0.5" size={18} />
                                    <span className="text-slate-900 font-medium capitalize">
                                        {formatDate(apt.date_time, DATE_LONG)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <User className="text-slate-400 shrink-0" size={18} />
                                    <span className="text-slate-600">{apt.client_name}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="text-slate-400 shrink-0" size={18} />
                                    <a href={`tel:${apt.phone}`} className="text-slate-600 hover:text-giphar-green transition-colors">
                                        {apt.phone}
                                    </a>
                                </div>

                                <div className="pt-3 border-t border-slate-100 mt-2">
                                    <p className="text-sm font-semibold text-slate-900">Service demandé :</p>
                                    <p className="text-slate-500 text-sm">{apt.service_type}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {appointments.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                            <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="text-slate-500">Aucun rendez-vous planifié pour le moment.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
