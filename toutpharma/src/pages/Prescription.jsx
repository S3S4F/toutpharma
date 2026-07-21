import React, { useState } from 'react';
import { Upload, Camera, FileText, CheckCircle, Loader } from 'lucide-react';
import { api } from '../lib/api';

export default function Prescription() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({ phone: '', name: '' });
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !formData.phone) return;

        setStatus('uploading');
        const data = new FormData();
        data.append('image', file);
        data.append('phone', formData.phone);
        data.append('client_name', formData.name);

        try {
            const res = await api.uploadPrescription(data);
            if (res.ok) {
                setStatus('success');
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-giphar-green mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Ordonnance Envoyée !</h2>
                    <p className="text-slate-600">
                        Votre ordonnance a bien été transmise à notre équipe. Nous vous contacterons sur le
                        <span className="font-bold text-slate-900"> {formData.phone} </span>
                        dès qu'elle sera prête.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-giphar-green text-white px-8 py-3 rounded-xl font-bold hover:bg-giphar-green-dark transition-colors mt-8"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-8 pb-20 bg-slate-50 min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Envoyer une Ordonnance</h1>
                    <p className="text-slate-600">
                        Photographiez votre ordonnance et envoyez-la nous directement. Nous la préparons pour vous.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* File Upload Area */}
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    id="prescription-upload"
                                />
                                <div className={`border-3 border-dashed rounded-2xl p-10 text-center transition-all ${preview ? 'border-giphar-green bg-green-50' : 'border-slate-200 hover:border-giphar-green hover:bg-slate-50'
                                    }`}>
                                    {preview ? (
                                        <div className="relative">
                                            <img src={preview} alt="Prévisualisation" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                                            <div className="mt-4 text-giphar-green font-medium flex items-center justify-center gap-2">
                                                <Camera size={20} /> Changer la photo
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-giphar-green">
                                                <Camera size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">Prendre une photo</h3>
                                                <p className="text-sm text-slate-500">ou importer depuis la galerie</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Votre téléphone (Requis) *</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Ex: 77 123 45 67"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-giphar-green outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Votre nom (Optionnel)</label>
                                    <input
                                        type="text"
                                        placeholder="Votre nom complet"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-giphar-green outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!file || !formData.phone || status === 'uploading'}
                                className="w-full bg-giphar-orange hover:bg-giphar-orange-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'uploading' ? (
                                    <>
                                        <Loader className="animate-spin" /> Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        Envoyer l'ordonnance <Upload size={20} />
                                    </>
                                )}
                            </button>

                        </form>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
                    <FileText size={16} />
                    <span>Vos données de santé sont sécurisées et confidentielles.</span>
                </div>

            </div>
        </div>
    );
}
