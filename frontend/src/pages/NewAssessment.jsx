import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPatients, createPatient, createAssessment } from '../api/client';
import { usePoseDetection } from '../hooks/usePoseDetection';
import ShoulderOverlay from '../components/ShoulderOverlay';

export default function NewAssessment() {
  const { t } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef(null);
  const { detect, loading: detecting, error: detectError } = usePoseDetection();

  useEffect(() => {
    getPatients().then((list) => {
      setPatients(list);
      if (list[0]) setPatientId(list[0].id);
    }).catch((e) => setError(e.message));
  }, []);

  function onFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return setError('Máximo 5 MB');
    setFile(f);
    const url = URL.createObjectURL(f);
    setImageUrl(url);
    setResult(null);
    const img = new Image();
    img.onload = () => {
      setSize({ width: img.naturalWidth, height: img.naturalHeight });
      setLeft({ x: img.naturalWidth * 0.3, y: img.naturalHeight * 0.3 });
      setRight({ x: img.naturalWidth * 0.7, y: img.naturalHeight * 0.3 });
    };
    img.src = url;
  }

  async function onDetect() {
    const img = document.createElement('img');
    img.src = imageUrl;
    await img.decode();
    const pts = await detect(img);
    if (pts) { setLeft(pts.leftShoulder); setRight(pts.rightShoulder); }
  }

  async function onSave() {
    setLoading(true); setError(null);
    try {
      let pid = patientId;
      if (!pid) {
        const p = await createPatient(newPatientName ? { name: newPatientName } : {});
        pid = p.id;
      }
      const saved = await createAssessment(pid, file, { leftShoulder: left, rightShoulder: right, imageWidth: size.width, imageHeight: size.height });
      setResult(saved);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  const preview = left && right ? computePreview(left, right, size.width) : null;

  return (
    <main>
      <h1>{t('new.title')}</h1>

      <div className="steps">
        <span className={stepClass(!!patientId && consent)}>1 · Consentimiento</span>
        <span className={stepClass(!!file)}>2 · Foto</span>
        <span className={stepClass(!!left && !!right && !!file)}>3 · Hombros</span>
        <span className={stepClass(!!result)}>4 · Resultado</span>
      </div>

      <div className="card">
        <label>{t('new.patient')}
          <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            <option value="">— {t('patients.create')} —</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.code}{p.name ? ` — ${p.name}` : ''}</option>)}
          </select>
        </label>
        {!patientId && <label>{t('patients.name')}<input value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)} /></label>}
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'start', fontWeight: 400 }}>
          <input type="checkbox" style={{ width: 'auto' }} checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          {t('new.consent')}
        </label>
      </div>

      <div className="card">
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} disabled={!consent} aria-label={t('new.choose')} />
      </div>

      {imageUrl && left && right && (
        <div className="card">
          <button onClick={onDetect} disabled={detecting}>{detecting ? '…' : '🤖 ' + t('new.detect')}</button>
          {detectError && <p role="alert" className="alert-error">{detectError}</p>}
          <p className="muted">{t('new.adjust')}</p>
          <ShoulderOverlay
            imageSrc={imageUrl}
            width={size.width}
            height={size.height}
            left={left}
            right={right}
            onChange={({ left, right }) => { setLeft(left); setRight(right); }}
          />
          {preview && (
            <>
              <p style={{ marginTop: '1rem' }}><span className={`badge ${preview.classification}`}>{t(`classes.${preview.classification}`)}</span></p>
              <div className="metrics" style={{ marginTop: '0.5rem' }}>
                <div className="metric"><b>{preview.angleDeg}°</b><span>{t('new.angle')}</span></div>
                <div className="metric"><b>{preview.heightDiffPx}</b><span>{t('new.diffPx')}</span></div>
                <div className="metric"><b>{preview.heightDiffPct}%</b><span>{t('new.diffPct')}</span></div>
              </div>
            </>
          )}
          <p style={{ marginTop: '1rem' }}><button onClick={onSave} disabled={loading || !consent}>{loading ? '…' : '💾 ' + t('new.save')}</button></p>
        </div>
      )}

      {result && <p role="status" className="alert-success">{t('new.saved')}: {t(`classes.${result.classification}`)} ({result.angleDeg}°)</p>}
      {error && <p role="alert" className="alert-error">{error}</p>}
    </main>
  );
}

function stepClass(done) {
  return `badge ${done ? 'symmetric' : 'mild'}`;
}

function computePreview(left, right, width) {
  const angleDeg = (Math.atan2(right.y - left.y, right.x - left.x) * 180) / Math.PI;
  const heightDiffPx = Math.abs(left.y - right.y);
  const heightDiffPct = (heightDiffPx / width) * 100;
  const abs = Math.abs(angleDeg);
  const classification = abs < 2 ? 'symmetric' : abs < 5 ? 'mild' : abs < 10 ? 'moderate' : 'marked';
  return { angleDeg: angleDeg.toFixed(2), heightDiffPx: heightDiffPx.toFixed(1), heightDiffPct: heightDiffPct.toFixed(1), classification };
}
