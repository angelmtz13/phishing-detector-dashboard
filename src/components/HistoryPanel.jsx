export default function HistoryPanel({ history, onSelectEntry, onDeleteEntry }) {
  if (!history || history.length === 0) return null;

  const getRiskLabel = (level) => {
    switch (level) {
      case 'high': return 'Alto';
      case 'medium': return 'Medio';
      case 'low': return 'Bajo';
      default: return 'Bajo';
    }
  };

  const getRiskClass = (level) => {
    switch (level) {
      case 'high': return 'risk-high-style';
      case 'medium': return 'risk-medium-style';
      case 'low': return 'risk-low-style';
      default: return 'risk-low-style';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        );
      case 'url':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        );
      case 'headers':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="glass-panel history-panel" style={{ marginTop: '1rem', padding: '1.25rem' }}>
      <h3 className="panel-title" style={{ fontSize: '1.05rem', marginBottom: '1.0rem' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Historial de Análisis
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {history.map((entry, idx) => (
          <div
            key={entry.id || idx}
            onClick={() => onSelectEntry(entry)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.6rem 0.8rem',
              borderRadius: '0.5rem',
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              gap: '0.75rem',
            }}
            className="history-item-chip"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }} title={entry.type}>
                {getTypeIcon(entry.type)}
              </span>
              <span
                className={`risk-level-badge ${getRiskClass(entry.riskLevel)}`}
                style={{
                  padding: '0.15rem 0.45rem',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  margin: 0,
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  whiteSpace: 'nowrap'
                }}
              >
                {getRiskLabel(entry.riskLevel)}
              </span>
              <span
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1
                }}
              >
                {entry.preview}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginRight: '0.25rem' }}>
                {formatTime(entry.analyzedAt)}
              </span>
              <button
                className="history-view-btn"
                onClick={(e) => { e.stopPropagation(); onSelectEntry(entry); }}
                title="Ver resultado"
                style={{
                  background: 'transparent',
                  border: '1px solid transparent',
                  color: 'var(--text-muted)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button
                className="history-delete-btn"
                onClick={(e) => { e.stopPropagation(); onDeleteEntry(entry.id); }}
                title="Eliminar"
                style={{
                  background: 'transparent',
                  border: '1px solid transparent',
                  color: 'var(--text-muted)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
