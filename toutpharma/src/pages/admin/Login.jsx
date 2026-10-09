import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { api } from '../../lib/api';

export default function Login() {
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  // Le champ code 2FA n'apparaît que si le serveur l'exige (ADMIN_TOTP_SECRET).
  const [otpRequired, setOtpRequired] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login(password, otp || undefined);

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else if (data.otpRequired && !otpRequired) {
        // Mot de passe correct, 2FA activée : on révèle le champ code.
        setOtpRequired(true);
        setError('');
      } else {
        // `message` (login) ou `error` (rate-limit anti-bruteforce)
        setError(data.message || data.error || 'Connexion impossible');
      }
    } catch {
      setError('Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-100 rounded-full text-giphar-green">
            <Lock size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">Administration</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all"
              placeholder="Entrez le mot de passe"
            />
          </div>

          {otpRequired && (
            <div className="animate-fade-up">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Code de vérification (2FA)
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-giphar-green focus:border-giphar-green outline-none transition-all tracking-[0.4em] text-center font-bold text-lg"
                placeholder="••••••"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Saisissez le code à 6 chiffres de votre application d'authentification.
              </p>
            </div>
          )}

          <button className="w-full bg-giphar-green hover:bg-giphar-green-dark active:scale-[0.98] text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-200 cursor-pointer">
            {otpRequired ? 'Vérifier le code' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
