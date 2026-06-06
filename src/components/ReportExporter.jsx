export default function ReportExporter({ analysisResult }) {
  if (!analysisResult) return null;

  const { riskLevel, riskScore, threatsFound, technicalDetails, recommendations, type, analyzedAt } = analysisResult;

  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'high': return 'RIESGO CRÍTICO';
      case 'medium': return 'SOSPECHOSO';
      case 'low': return 'SEGURO / LIMPIO';
      default: return 'N/D';
    }
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high': return '#cc1a1a';
      case 'medium': return '#c2610c';
      case 'low': return '#0d7a4a';
      default: return '#666';
    }
  };

  const handleExport = () => {
    const reportDate = analyzedAt
      ? new Date(analyzedAt).toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'medium' })
      : new Date().toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'medium' });

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('No se pudo abrir la ventana de impresión. Verifica que los popups no estén bloqueados.');
      return;
    }

    const threatsList = (threatsFound || [])
      .map(t => `<li style="margin-bottom:6px;line-height:1.5;color:#1a1a2e;">${t}</li>`)
      .join('');

    const techList = (technicalDetails || [])
      .map(d => `<div style="font-family:'Courier New',monospace;font-size:13px;color:#1a1a2e;padding:4px 0;border-bottom:1px solid #f0f0f0;line-height:1.5;"><span style="color:#999;margin-right:8px;">›</span>${d}</div>`)
      .join('');

    const recList = (recommendations || [])
      .map((r, i) => `<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:8px;">
        <span style="background:#e8e8e8;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#555;flex-shrink:0;">${i + 1}</span>
        <span style="font-size:14px;color:#333;line-height:1.5;">${r}</span>
      </div>`)
      .join('');

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte de Análisis de Phishing — Javard</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1a2e; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f172a;padding-bottom:16px;margin-bottom:32px;">
    <div>
      <h1 style="font-size:22px;font-weight:700;color:#0f172a;margin-bottom:4px;">Reporte de Análisis de Phishing</h1>
      <p style="font-size:13px;color:#666;">Javard Corporativo v1.1 — Motor Heurístico de Detección</p>
    </div>
    <div style="text-align:right;">
      <p style="font-size:12px;color:#888;">Generado</p>
      <p style="font-size:13px;font-weight:600;color:#333;">${reportDate}</p>
    </div>
  </div>

  <div style="display:flex;gap:24px;align-items:center;margin-bottom:32px;padding:24px;border-radius:12px;border:2px solid ${getRiskColor()}22;background:${getRiskColor()}08;">
    <div style="text-align:center;">
      <div style="font-size:48px;font-weight:700;color:${getRiskColor()};line-height:1;">${riskScore}</div>
      <div style="font-size:12px;color:#888;margin-top:4px;">/ 100</div>
    </div>
    <div style="border-left:2px solid #e5e5e5;padding-left:24px;">
      <div style="display:inline-block;background:${getRiskColor()}15;color:${getRiskColor()};padding:4px 16px;border-radius:100px;font-size:14px;font-weight:700;letter-spacing:0.05em;margin-bottom:8px;">${getRiskLabel()}</div>
      <p style="font-size:14px;color:#555;line-height:1.5;">Tipo de análisis: <strong>${type === 'email' ? 'Correo Electrónico' : type === 'headers' ? 'Cabeceras de Correo' : 'Enlace URL'}</strong></p>
    </div>
  </div>

  ${threatsList ? `
  <div style="margin-bottom:28px;">
    <h2 style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e5e5e5;">Indicadores de Riesgo Detectados</h2>
    <ul style="padding-left:20px;list-style:disc;">${threatsList}</ul>
  </div>` : ''}

  ${techList ? `
  <div style="margin-bottom:28px;">
    <h2 style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e5e5e5;">Inspección Técnica</h2>
    <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:16px;">${techList}</div>
  </div>` : ''}

  ${recList ? `
  <div style="margin-bottom:28px;">
    <h2 style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e5e5e5;">Acciones Recomendadas</h2>
    ${recList}
  </div>` : ''}

  <div style="margin-top:40px;padding-top:16px;border-top:2px solid #e5e5e5;text-align:center;">
    <p style="font-size:11px;color:#999;line-height:1.6;">
      Este reporte fue generado automáticamente por el Motor Heurístico de Detección de Phishing — Javard Corporativo v1.1.<br/>
      Los resultados son orientativos y no constituyen un dictamen legal ni de seguridad definitivo.
    </p>
  </div>

  <div class="no-print" style="text-align:center;margin-top:32px;">
    <button onclick="window.print()" style="background:#0f172a;color:#fff;border:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;">
      Imprimir / Guardar como PDF
    </button>
  </div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <button className="export-btn" onClick={handleExport} title="Exportar reporte como PDF">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Exportar Reporte
    </button>
  );
}
