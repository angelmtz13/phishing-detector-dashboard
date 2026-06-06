import React, { useState, useEffect } from 'react';

export default function Dashboard({ analysisResult, isLoading }) {
  const [techOpen, setTechOpen] = useState(false);

  // Reset accordion state on new analysis result
  useEffect(() => {
    setTechOpen(false);
  }, [analysisResult]);

  if (isLoading) {
    return (
      <div className="glass-panel loading-state">
        <div className="radar-loader">
          <div className="radar-center"></div>
        </div>
        <div className="loading-text">
          <span>Escaneando Indicadores</span>
          <span className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="glass-panel empty-state">
        <div className="empty-icon-wrapper">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <h3 className="empty-title">Esperando Entrada</h3>
        <p className="empty-desc">
          Introduce el texto de un correo sospechoso o un enlace web en el formulario de la izquierda para analizar posibles riesgos de seguridad.
        </p>
      </div>
    );
  }

  const { riskLevel, riskScore, threatsFound, technicalDetails, recommendations } = analysisResult;

  // Determine styles and labels based on risk level
  const getRiskDetails = () => {
    switch (riskLevel) {
      case 'high':
        return {
          className: 'risk-high-style',
          label: 'Riesgo Crítico',
          color: 'var(--risk-high)',
          desc: 'Se han detectado múltiples indicadores de fraude y técnicas directas de phishing. Evita interactuar con este remitente o dominio.',
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )
        };
      case 'medium':
        return {
          className: 'risk-medium-style',
          label: 'Sospechoso',
          color: 'var(--risk-medium)',
          desc: 'Se observaron anomalías en el formato o dominio. Podría tratarse de un sitio no oficial o una campaña de spam publicitario.',
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )
        };
      case 'low':
      default:
        return {
          className: 'risk-low-style',
          label: 'Seguro / Limpio',
          color: 'var(--risk-low)',
          desc: 'No se encontraron firmas maliciosas y las credenciales de origen están verificadas. Sin embargo, mantente atento a anomalías del contexto.',
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          )
        };
    }
  };

  const riskInfo = getRiskDetails();

  // SVG Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className="results-container">
      {/* Top Section - Gauge and Summary */}
      <div className="glass-panel">
        <div className="result-header-panel">
          {/* Circular SVG Gauge */}
          <div className="gauge-container">
            <svg width="120" height="120" className="gauge-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} className="gauge-bg" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="gauge-fill"
                stroke={riskInfo.color}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="gauge-center-info">
              <span className="gauge-score">{riskScore}</span>
              <span className="gauge-max">/ 100</span>
            </div>
          </div>

          {/* Text Summary */}
          <div className="risk-details-summary">
            <div className="result-badge-container">
              <span className={`risk-level-badge ${riskInfo.className}`}>
                {riskInfo.icon}
                {riskInfo.label}
              </span>
            </div>
            <h3 className="result-status-title">Puntuación de Amenaza</h3>
            <p className="result-desc">{riskInfo.desc}</p>
          </div>
        </div>
      </div>

      {/* Main Indicators Panel */}
      <div className="glass-panel findings-section">
        <h3 className="findings-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Indicadores de Riesgo Detectados
        </h3>

        <div className="threat-list">
          {threatsFound && threatsFound.length > 0 ? (
            threatsFound.map((threat, idx) => (
              <div key={idx} className="threat-item">
                <span className="threat-icon" style={{ color: riskInfo.color }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
                <span className="threat-text">{threat}</span>
              </div>
            ))
          ) : (
            <div className="threat-item" style={{ borderColor: 'var(--risk-low-border)' }}>
              <span className="threat-icon" style={{ color: 'var(--risk-low)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="threat-text" style={{ color: 'var(--text-secondary)' }}>
                Ningún vector común de ataque identificado en el contenido analizado.
              </span>
            </div>
          )}
        </div>

        {/* Technical Details Console Collapsible */}
        {technicalDetails && technicalDetails.length > 0 && (
          <div className="tech-details-container">
            <div
              className="tech-details-header"
              onClick={() => setTechOpen(!techOpen)}
            >
              <span className="tech-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                Inspección Técnica de Seguridad
              </span>
              <span className={`tech-arrow ${techOpen ? 'open' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
            {techOpen && (
              <div className="tech-details-content">
                {technicalDetails.map((detail, idx) => (
                  <div key={idx} className="tech-log-line">
                    <span className="tech-prompt-symbol">&gt;</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suggested Actions panel */}
      {recommendations && recommendations.length > 0 && (
        <div className="glass-panel findings-section">
          <h3 className="findings-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Acciones Recomendadas
          </h3>
          <div className="recommendations-grid">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="rec-card">
                <span className="rec-number">{idx + 1}</span>
                <span className="rec-text">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
