import { useState } from 'react';

export default function PhishingGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const conceptCards = [
    {
      title: 'El Gancho (Anatomía)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      description: 'Los atacantes no hackean sistemas; hackean personas. Usan la urgencia ("tu cuenta expirará hoy") o falsos bonos para generar pánico o codicia, haciéndote actuar sin pensar.'
    },
    {
      title: 'Vectores Comunes',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      description: 'Desde correos masivos de marcas populares, hasta Spear Phishing (ataques dirigidos con tu nombre y logo de tu empresa) o Smishing (mensajes de texto falsos en tu móvil).'
    },
    {
      title: 'Focos Rojos (Red Flags)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      description: 'Direcciones de correo extrañas (ej: @mantenimiento-365.iceiy.com), enlaces que apuntan a hostings gratuitos (como replit.app o sevalla.page) y saludos impersonales.'
    },
    {
      title: 'Tu Línea de Defensa',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      description: 'Verifica los remitentes reales en las cabeceras SPF/DKIM, nunca introduzcas contraseñas en enlaces externos y activa siempre el Doble Factor de Autenticación (2FA).'
    }
  ];

  return (
    <div className="glass-panel phishing-guide-panel" style={{ marginBottom: '2.5rem' }}>
      <div 
        className="guide-header" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <h2 className="panel-title" style={{ margin: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
          Manual de Ciberdefensa: ¿Qué es el Phishing?
        </h2>
        <span className={`tech-arrow ${isOpen ? 'open' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className="guide-body" style={{ marginTop: '1.5rem', animation: 'slideDown 0.3s ease-out' }}>
          <div className="guide-origin-card" style={{ 
            background: 'var(--bg-main)', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--text-primary)',
            marginBottom: '1.25rem'
          }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              Origen del Proyecto: ¿Por qué surge esta idea?
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              Este proyecto nace de la observación directa de incidentes en entornos organizacionales reales. Al supervisar el flujo diario de correos y ver cómo usuarios reales caen víctimas de tácticas de urgencia y suplantación de identidad (como alertas de bloqueo del sistema o solicitudes falsas de soporte), se hizo evidente que la mejor defensa es la educación interactiva. Esta herramienta fue creada para automatizar el análisis rápido de estos vectores de ataque y concientizar de manera visual a la comunidad.
            </p>
          </div>

          <div className="guide-intro-card" style={{ 
            background: 'var(--bg-main)', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            borderLeft: '4px solid var(--text-primary)',
            marginBottom: '1.5rem'
          }}>
            <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500', lineHeight: '1.6', margin: 0 }}>
              "El phishing no es magia, es pura manipulación psicológica. Los atacantes saben que es más fácil hackear la mente de un usuario bajo presión que romper un cifrado de seguridad corporativo. Si aprendes a reconocer el anzuelo, el juego de los ciberdelincuentes se termina de inmediato."
            </p>
          </div>

          <div className="guide-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {conceptCards.map((card, idx) => (
              <div 
                key={idx} 
                className="guide-card" 
                style={{ 
                  background: 'var(--bg-main)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '0.75rem', 
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{card.icon}</span>
                  <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{card.title}</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="guide-examples-section" style={{ 
            marginTop: '2rem', 
            borderTop: '1px solid var(--border-subtle)', 
            paddingTop: '1.5rem' 
          }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Casos Reales y Patrones Registrados
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Email Patterns Card */}
              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--risk-high)' }}>●</span> Asuntos de Correo Comunes
                </h4>
                <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.6', margin: 0 }}>
                  <li><strong>"Notificación Final de Bloqueo"</strong> (Usa urgencia para asustar).</li>
                  <li><strong>"ALERTA EMAIL"</strong> o <strong>"Último Aviso"</strong> (Simula advertencias del sistema).</li>
                  <li><strong>"Bono de Conectividad o Estudiante"</strong> (Usa beneficios económicos falsos).</li>
                </ul>
              </div>

              {/* URL Patterns Card */}
              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--risk-high)' }}>●</span> Dominios & Hosts de Abuso Frecuente
                </h4>
                <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.6', margin: 0 }}>
                  <li><strong>Hosts gratuitos:</strong> <code>zya.me</code>, <code>iceiy.com</code>, <code>hstn.me</code> (falsos inicios de sesión).</li>
                  <li><strong>Creadores web:</strong> <code>versoly.page</code>, <code>sevalla.page</code>, <code>replit.app</code>.</li>
                  <li><strong>Cloud Storage & Sites:</strong> <code>web.core.windows.net</code>, <code>sites.google.com/view/</code>.</li>
                  <li><strong>TLDs baratos o sospechosos:</strong> extensiones como <code>.sbs</code> (ej. <code>rinvota.sbs</code>).</li>
                </ul>
              </div>

              {/* SPF/DKIM Authentication Card */}
              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--color-primary)' }}>●</span> Autenticación de Correo (SPF y DKIM)
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 0.5rem 0' }}>
                  Firmas de seguridad técnica que validan la legitimidad del remitente:
                </p>
                <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.5', margin: 0 }}>
                  <li><strong>SPF</strong>: Lista los servidores e IPs autorizados a enviar correos a nombre del dominio de la organización.</li>
                  <li><strong>DKIM</strong>: Firma criptográfica digital que garantiza que el mensaje no ha sido modificado en tránsito.</li>
                  <li><strong>DMARC</strong>: Política que determina cómo actuar ante correos que fallan los filtros SPF o DKIM (spam o descarte).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
