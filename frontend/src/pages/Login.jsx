import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../api/client';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const data = await login(email, password);
      localStorage.setItem('spinealign_token', data.token);
      navigate('/');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <main style={{ maxWidth: 420 }}>
      <div className="card">
      <h1>{t('nav.login')}</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label>{t('login.email')}<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} /></label>
        <label>{t('login.password')}<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} /></label>
        <button disabled={loading}>{loading ? '…' : t('login.submit')}</button>
        {error && <p role="alert" className="alert-error">{error}</p>}
      </form>
      </div>
    </main>
  );
}
