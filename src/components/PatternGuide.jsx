import { useState } from 'react';

export default function PatternGuide() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="glass-panel pattern-guide-panel" style={{ marginTop: '2.5rem' }}>
      <div 
        className="guide-header" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <h2 className="panel-title" style={{ margin: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Casos Reales y Patrones Registrados
        </h2>
        <span className={`tech-arrow ${isOpen ? 'open' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className="guide-body" style={{ marginTop: '1.5rem', animation: 'slideDown 0.3s ease-out' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Email Patterns Card */}
            <div 
              style={{ 
                background: 'var(--bg-main)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '0.75rem', 
                padding: '1.25rem',
                transition: 'var(--transition-smooth)'
              }}
              className="pattern-card-hover"
            >
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--risk-high)' }}>●</span> Asuntos de Correo Comunes
              </h4>
              <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.6', margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>"Notificación Final de Bloqueo"</strong> (Usa urgencia para asustar).</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>"ALERTA EMAIL"</strong> o <strong>"Último Aviso"</strong> (Simula advertencias del sistema).</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>"Bono de Conectividad o Estudiante"</strong> (Usa beneficios económicos falsos).</li>
              </ul>
            </div>

            {/* URL Patterns Card */}
            <div 
              style={{ 
                background: 'var(--bg-main)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '0.75rem', 
                padding: '1.25rem',
                transition: 'var(--transition-smooth)'
              }}
              className="pattern-card-hover"
            >
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--risk-high)' }}>●</span> Dominios & Hosts de Abuso Frecuente
              </h4>
              <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.6', margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Hosts gratuitos:</strong> <code>zya.me</code>, <code>iceiy.com</code>, <code>hstn.me</code> (falsos inicios de sesión).</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Creadores web:</strong> <code>versoly.page</code>, <code>sevalla.page</code>, <code>replit.app</code>.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Cloud Storage & Sites:</strong> <code>web.core.windows.net</code>, <code>sites.google.com/view/</code>.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>TLDs baratos/sospechosos:</strong> extensiones como <code>.sbs</code> (ej. <code>rinvota.sbs</code>).</li>
              </ul>
            </div>

            {/* SPF/DKIM Authentication Card */}
            <div 
              style={{ 
                background: 'var(--bg-main)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '0.75rem', 
                padding: '1.25rem',
                transition: 'var(--transition-smooth)'
              }}
              className="pattern-card-hover"
            >
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--color-primary)' }}>●</span> Autenticación de Correo (SPF y DKIM)
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 0.5rem 0' }}>
                Firmas de seguridad técnica que validan la legitimidad del remitente:
              </p>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.5', margin: 0 }}>
                <li style={{ marginBottom: '0.4rem' }}><strong>SPF</strong>: Lista los servidores e IPs autorizados a enviar correos a nombre del dominio de la organización.</li>
                <li style={{ marginBottom: '0.4rem' }}><strong>DKIM</strong>: Firma criptográfica digital que garantiza que el mensaje no ha sido modificado en tránsito.</li>
                <li style={{ marginBottom: '0.4rem' }}><strong>DMARC</strong>: Política que determina cómo actuar ante correos que fallan los filtros SPF o DKIM (spam o descarte).</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
