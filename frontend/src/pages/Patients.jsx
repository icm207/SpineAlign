import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getPatients, createPatient } from '../api/client';

export default function Patients() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => { getPatients().then(setList).catch((e) => setError(e.message)); }, []);

  async function add() {
    try {
      const p = await createPatient(name ? { name } : {});
      setList([p, ...list]); setName('');
    } catch (e) { setError(e.message); }
  }

  return (
    <main>
      <h1>{t('patients.title')}</h1>
      <div className="card" style={{ display: 'flex', gap: '0.5rem' }}>
        <input placeholder={t('patients.name')} value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={add} style={{ whiteSpace: 'nowrap' }}>{t('patients.create')}</button>
      </div>
      {error && <p role="alert" className="alert-error">{error}</p>}
      <div className="card">
        <ul className="list">
          {list.map((p) => (
            <li key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                width: 38, height: 38, borderRadius: '50%', background: '#efedff', color: 'var(--primary-dark)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
              }}>{p.code.slice(2, 4)}</span>
              <span style={{ flex: 1 }}>
                <Link to={`/pacientes/${p.id}`}><strong>{p.code}</strong>{p.name ? ` — ${p.name}` : ''}</Link>
              </span>
              <small style={{ color: 'var(--muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
