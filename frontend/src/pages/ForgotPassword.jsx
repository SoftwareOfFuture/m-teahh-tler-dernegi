import { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { authApi } from '../api/client';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID_RESET = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESET || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus(null);
    setLoading(true);
    try {
      const data = await authApi.forgotPassword(email);
      if (data.resetLink && data.email && SERVICE_ID && TEMPLATE_ID_RESET && PUBLIC_KEY) {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID_RESET, {
          to_email: data.email,
          reset_link: data.resetLink,
          user_email: data.email,
        }, PUBLIC_KEY);
      }
      setStatus('success');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="font-serif text-2xl font-semibold text-dark-gray text-center">Şifremi Unuttum</h1>
          <p className="text-sm text-gray-600 text-center mt-1">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>
            )}
            {status === 'success' && (
              <div className="p-3 rounded-md bg-green-50 text-green-800 text-sm border border-green-200">
                Bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi. Lütfen gelen kutunuzu kontrol edin.
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="ornek@email.com"
                autoComplete="email"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
              {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            <Link to="/login" className="text-primary font-medium hover:underline">Giriş sayfasına dön</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
