import { useState } from 'react';

export default function AnalysisHistory({ history, onSelectEntry, onDeleteEntry, onClearHistory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!history || history.length === 0) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'var(--risk-high)';
      case 'medium': return 'var(--risk-medium)';
      case 'low': return 'var(--risk-low)';
      default: return 'var(--text-muted)';
    }
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case 'high': return 'Crítico';
      case 'medium': return 'Sospechoso';
      case 'low': return 'Seguro';
      default: return 'N/D';
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    onClearHistory();
    setConfirmClear(false);
  };

  return (
    <div className="glass-panel history-panel">
      <div
        className="history-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="panel-title" style={{ margin: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Historial de Análisis
          <span className="history-count">{history.length}</span>
        </h2>
        <span className={`tech-arrow ${isOpen ? 'open' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className="history-body">
          <div className="history-actions-bar">
            <span className="history-summary-text">
              {history.length} análisis registrado{history.length !== 1 ? 's' : ''}
            </span>
            <button
              className={`history-clear-btn ${confirmClear ? 'confirm' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              {confirmClear ? '¿Confirmar?' : 'Limpiar'}
            </button>
          </div>

          <div className="history-list">
            {history.map((entry, idx) => (
              <div
                key={entry.id}
                className="history-item"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div className="history-item-left">
                  <div className="history-item-meta">
                    <span
                      className="history-risk-dot"
                      style={{ background: getRiskColor(entry.riskLevel) }}
                    />
                    <span className="history-type-badge">
                      {entry.inputType === 'email' ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      )}
                    </span>
                    <span className="history-score" style={{ color: getRiskColor(entry.riskLevel) }}>
                      {entry.riskScore}
                    </span>
                    <span className="history-risk-label" style={{ color: getRiskColor(entry.riskLevel) }}>
                      {getRiskLabel(entry.riskLevel)}
                    </span>
                  </div>
                  <p className="history-preview">{entry.inputPreview}</p>
                  <span className="history-date">{formatDate(entry.timestamp)}</span>
                </div>
                <div className="history-item-actions">
                  <button
                    className="history-view-btn"
                    onClick={() => onSelectEntry(entry)}
                    title="Ver resultado"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    className="history-delete-btn"
                    onClick={() => onDeleteEntry(entry.id)}
                    title="Eliminar"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
