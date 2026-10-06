import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAssessments } from '../api/client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function PatientDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => { getAssessments(id).then(setList).catch((e) => setError(e.message)); }, [id]);

  const data = {
    labels: list.map((a) => new Date(a.date).toLocaleDateString()),
    datasets: [{
      label: t('new.angle') + ' (°)',
      data: list.map((a) => a.angleDeg),
      borderColor: '#1565C0',
      backgroundColor: '#1565C0',
    }],
  };

  return (
    <main>
      <h1>{t('detail.evolution')}</h1>
      {error && <p role="alert" className="alert-error">{error}</p>}
      {list.length > 0 && <div className="card"><Line data={data} /></div>}
      <h2>{t('detail.assessments')}</h2>
      <div className="card">
      <ul className="list">
        {list.map((a) => (
          <li key={a.id}>
            <Link to={`/evaluaciones/${a.id}`}>
              {new Date(a.date).toLocaleString()} — <strong>{a.angleDeg}°</strong>
            </Link>{' '}
            <span className={`badge ${a.classification}`}>{t(`classes.${a.classification}`)}</span>
          </li>
        ))}
      </ul>
      </div>
    </main>
  );
}
