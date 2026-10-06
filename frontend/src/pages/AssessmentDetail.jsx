import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAssessment, fetchImageBlob, downloadReport } from '../api/client';

export default function AssessmentDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [a, setA] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAssessment(id).then(setA).catch((e) => setError(e.message));
    fetchImageBlob(id).then(setImgSrc).catch(() => {});
  }, [id]);

  if (error) return <main role="alert" style={{ color: '#C62828' }}>{error}</main>;
  if (!a) return <main>…</main>;

  return (
    <main>
      <h1>{new Date(a.date).toLocaleString()}</h1>
      <div className="card">
        <span className={`badge ${a.classification}`}>{t(`classes.${a.classification}`)}</span>
        <div className="metrics" style={{ marginTop: '1rem' }}>
          <div className="metric"><b>{a.angleDeg}°</b><span>{t('new.angle')}</span></div>
          <div className="metric"><b>{a.heightDiffPx}</b><span>{t('new.diffPx')}</span></div>
          <div className="metric"><b>{a.heightDiffPct}%</b><span>{t('new.diffPct')}</span></div>
        </div>
      </div>
      {imgSrc && <img className="preview" src={imgSrc} alt="Evaluación" />}
      <p style={{ marginTop: '1rem' }}><button onClick={() => downloadReport(id)}>{t('new.download')}</button></p>
    </main>
  );
}
