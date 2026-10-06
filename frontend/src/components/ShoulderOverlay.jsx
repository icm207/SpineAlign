import { useRef, useState } from 'react';

const COLORS = { symmetric: '#2E7D32', mild: '#F9A825', moderate: '#EF6C00', marked: '#C62828' };

/** SVG overlay: línea entre hombros, referencia horizontal y puntos arrastrables */
export default function ShoulderOverlay({ imageSrc, width, height, left, right, onChange }) {
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const angle = (Math.atan2(right.y - left.y, right.x - left.x) * 180) / Math.PI;
  const classification = classify(Math.abs(angle));
  const color = COLORS[classification];

  function toImageCoords(e) {
    const r = svgRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * width, y: ((e.clientY - r.top) / r.height) * height };
  }
  function onPointerDown(which) { return (e) => { e.preventDefault(); setDragging(which); }; }
  function onPointerMove(e) {
    if (!dragging) return;
    const p = toImageCoords(e);
    onChange(dragging === 'left' ? { left: p, right } : { left, right: p });
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
      <img src={imageSrc} alt="Paciente" style={{ maxWidth: '100%', display: 'block', borderRadius: 12, boxShadow: 'var(--shadow)' }} />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(null)}
        onPointerLeave={() => setDragging(null)}
        role="img"
        aria-label="Línea de hombros sobre la fotografía"
      >
        <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke={color} strokeWidth={Math.max(2, width / 250)} />
        <line x1={left.x} y1={left.y} x2={right.x} y2={left.y} stroke="#1565C0" strokeWidth={Math.max(1.5, width / 400)} strokeDasharray="8 6" />
        <text x={(left.x + right.x) / 2} y={(left.y + right.y) / 2 - 10} fill={color} fontSize={Math.max(14, width / 40)} textAnchor="middle">
          {angle.toFixed(1)}°
        </text>
        <circle cx={left.x} cy={left.y} r={Math.max(10, width / 60)} fill={color} stroke="#fff" strokeWidth={3} onPointerDown={onPointerDown('left')} style={{ cursor: 'grab' }} aria-label="Punto hombro izquierdo" />
        <circle cx={right.x} cy={right.y} r={Math.max(10, width / 60)} fill={color} stroke="#fff" strokeWidth={3} onPointerDown={onPointerDown('right')} style={{ cursor: 'grab' }} aria-label="Punto hombro derecho" />
      </svg>
    </div>
  );
}

function classify(absAngle) {
  if (absAngle < 2) return 'symmetric';
  if (absAngle < 5) return 'mild';
  if (absAngle < 10) return 'moderate';
  return 'marked';
}
