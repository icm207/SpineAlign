import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

const CLASS_COLORS = {
  symmetric: '#2E7D32',
  mild: '#F9A825',
  moderate: '#EF6C00',
  marked: '#C62828',
};

const CLASS_LABELS = {
  symmetric: 'Simétrico',
  mild: 'Leve',
  moderate: 'Moderado',
  marked: 'Marcado',
};

export function generateAssessmentReport({ assessment, patient }, res) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  // Bufferizar antes de enviar: evita respuestas corruptas si algo falla a mitad.
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  doc.on('end', () => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="spinealign-${assessment.id}.pdf"`);
    res.send(Buffer.concat(chunks));
  });
  doc.on('error', (err) => {
    if (!res.headersSent) res.status(500).json({ error: 'No se pudo generar el PDF' });
  });

  const color = CLASS_COLORS[assessment.classification] ?? '#333333';

  // Encabezado
  doc.fontSize(20).fillColor('#1A3C5E').text('SpineAlign — Informe de simetría postural', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#555').text(`Generado: ${new Date().toLocaleString('es')}`, { align: 'center' });
  doc.moveDown();

  // Datos del paciente
  doc.fontSize(12).fillColor('#000').text('Datos del paciente', { underline: true });
  doc.fontSize(11);
  doc.text(`Código: ${patient.code}`);
  if (patient.name) doc.text(`Nombre: ${patient.name}`);
  if (patient.birthDate) doc.text(`Fecha de nacimiento: ${new Date(patient.birthDate).toLocaleDateString('es')}`);
  doc.text(`Fecha de evaluación: ${new Date(assessment.date).toLocaleString('es')}`);
  doc.moveDown();

  // Imagen con líneas dibujadas
  const imgPath = path.resolve(process.env.UPLOAD_DIR || './uploads', assessment.imagePath);
  if (fs.existsSync(imgPath)) {
    const maxW = 480;
    const scale = maxW / assessment.imageWidth;
    const dispW = maxW;
    const dispH = assessment.imageHeight * scale;
    const x0 = 50;
    const y0 = doc.y;
    doc.image(imgPath, x0, y0, { width: dispW, height: dispH });

    const L = assessment.leftShoulder;
    const R = assessment.rightShoulder;
    const lx = x0 + L.x * scale, ly = y0 + L.y * scale;
    const rx = x0 + R.x * scale, ry = y0 + R.y * scale;

    // Línea entre hombros
    doc.save();
    doc.strokeColor(color).lineWidth(2).moveTo(lx, ly).lineTo(rx, ry).stroke();
    // Línea horizontal de referencia desde el hombro izquierdo
    doc.strokeColor('#1565C0').lineWidth(1.5).dash(4, { space: 4 }).moveTo(lx, ly).lineTo(rx, ly).stroke();
    doc.undash();
    // Puntos
    doc.fillColor(color).circle(lx, ly, 4).fill().circle(rx, ry, 4).fill();
    doc.restore();

    doc.y = y0 + dispH + 15;
  }

  // Métricas
  doc.fontSize(12).fillColor('#000').text('Métricas', { underline: true });
  doc.fontSize(11);
  doc.text(`Ángulo de inclinación: ${assessment.angleDeg}°`);
  doc.text(`Diferencia de altura: ${assessment.heightDiffPx} px (${assessment.heightDiffPct}% del ancho)`);
  doc.moveDown(0.5);
  doc.fillColor(color).fontSize(13).text(`Clasificación: ${CLASS_LABELS[assessment.classification] ?? assessment.classification}`);
  doc.moveDown();

  // Aviso legal
  doc.fontSize(9).fillColor('#666').text(
    'Aviso: SpineAlign es una herramienta de apoyo para concientización postural y no sustituye un diagnóstico ni una evaluación clínica realizada por un profesional de la salud.',
    { align: 'justify' }
  );

  doc.end();
}
