import { useState } from 'react';

const EXAMPLES = {
  email: [
    {
      label: 'Alerta de Suspensión (Phishing)',
      text: 'Estimado:   «direccion_de_correo_electronico»   este es su: ULTIMO AVISO.\nHemos tomado la decisión en desactivar tu correo electrónico debido a los nuevos términos y condiciones 2026,,\nPor lo tanto, hemos decidido que para seguir usando tu «direccion_de_correo_electronico» normalidad debes validar tu cuenta (Proceso Básico De Vinculación 2Auth) para seguir con su correcto funcionamiento en el sistema E-MAIL\nDe lo contrario, vamos a Desactivar tu cuenta sin tu consentimiento.\nconfirme su cuenta ⬇\nDebe Ingresar en 🔗➡:   https://verificacion-01--Seguridad-0201.replit.app https://verificacion-01--Seguridad-0201.replit.app'
    },
    {
      label: 'Alerta Bloqueo (Phishing)',
      text: 'ASUNTO: ALERTA EMAIL - Notificación Final de Bloqueo de Cuenta\n\nDetectamos accesos inusuales en su cuenta de correo institucional. Si no realiza la renovación de seguridad inmediatamente en el enlace https://mantener-cuenta.iceiy.com perderá el acceso a sus servicios de manera definitiva.\n\nSoporte Técnico de Seguridad de Correo.'
    },
    {
      label: 'Bono Universitario Falso (Phishing)',
      text: 'SOPORTE DE TI - COMUNICADO OFICIAL:\n\nSe ha aprobado un subsidio de conectividad y bono universitario de $150 USD para todos los estudiantes y empleados en activo. Para reclamar el beneficio de tu cuenta institucional, por favor accede al siguiente portal de vinculación antes de que expire el plazo:\n\nhttp://bono-estudiante-beca.replit.app\n\nDirección General de Tecnología.'
    },
    {
      label: 'Correo Institucional Seguro',
      text: 'Estimado(a) miembro de la comunidad:\n\nLe informamos que a partir del próximo lunes se iniciará el mantenimiento preventivo anual en los servidores de correo de la institución. No se requieren cambios de credenciales ni ninguna acción de su parte.\n\nPara cualquier duda técnica, comuníquese directamente con soporte oficial al correo soporte-ti@institucion.edu.\n\nAtentamente,\nDepartamento de Tecnología de la Información'
    }
  ],
  url: [
    {
      label: 'Falso Portal Replit (Phishing)',
      text: 'https://verificacion-01--Seguridad-0201.replit.app'
    },
    {
      label: 'Hosting Sospechoso (Phishing)',
      text: 'https://readymains2-j332r.sevalla.page/Docusign'
    },
    {
      label: 'Typosquatting Intranet (Phishing)',
      text: 'https://www.intranet-universidad-portal.com/login'
    },
    {
      label: 'Enlace Oficial Intranet (Seguro)',
      text: 'https://intranet.mi-institucion.edu/portal'
    }
  ],
  headers: [
    {
      label: 'Cabecera Phishing (Fallo SPF/DKIM/DMARC)',
      text: 'Delivered-To: victim@institucion.edu\nReceived: from mail.attacker-domain.com (unknown [198.51.100.12])\n\tby mx.institucion.edu with SMTP id a12b34c567;\n\tSat, 06 Jun 2026 12:00:00 -0600\nFrom: Soporte Tecnico <soporte@iceiy.com>\nTo: victim@institucion.edu\nSubject: Alerta de seguridad - Actualice su cuenta\nX-Mailer: PHPMailer 6.2.0 (https://github.com/PHPMailer/PHPMailer)\nAuthentication-Results: mx.institucion.edu;\n       spf=fail smtp.mailfrom=soporte@iceiy.com;\n       dkim=fail header.i=@iceiy.com;\n       dmarc=fail'
    },
    {
      label: 'Cabecera Segura (Paso SPF/DKIM/DMARC)',
      text: 'Delivered-To: victim@institucion.edu\nReceived: from mail.institucion.edu (mail.institucion.edu [192.0.2.55])\n\tby mx.institucion.edu with SMTP id x98y76z543;\n\tSat, 06 Jun 2026 11:30:00 -0600\nFrom: Servicio de Informatica <soporte-ti@institucion.edu>\nTo: victim@institucion.edu\nSubject: Mantenimiento Preventivo Anual\nAuthentication-Results: mx.institucion.edu;\n       spf=pass smtp.mailfrom=soporte-ti@institucion.edu;\n       dkim=pass header.i=@institucion.edu;\n       dmarc=pass'
    }
  ]
};

const PLACEHOLDERS = {
  email: 'Pega el texto del correo sospechoso aquí...\n(Ej: "Estimado: usuario@institucion.edu este es su: ULTIMO AVISO...")',
  url: 'Escribe o pega la dirección URL sospechosa...\n(Ej: https://verificacion-01--seguridad-0201.replit.app)',
  headers: 'Pega las cabeceras raw del correo aquí...\n(Ej: "Delivered-To: ... Received: ... Authentication-Results: ...")'
};

const MAX_CHARS = 10000;

export default function AnalysisForm({ onSubmit, isLoading }) {
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'url' | 'headers'
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setInputText('');
    setError('');
  };

  const handleExampleClick = (text) => {
    setInputText(text);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Por favor, ingresa contenido para realizar el análisis.');
      return;
    }

    if (activeTab === 'email' && inputText.trim().length < 30) {
      setError('El correo debe tener al menos 30 caracteres para poder ser analizado.');
      return;
    }
    if (activeTab === 'url' && inputText.trim().length < 8) {
      setError('La URL debe tener al menos 8 caracteres para poder ser analizada.');
      return;
    }
    if (activeTab === 'headers' && inputText.trim().length < 30) {
      setError('Las cabeceras deben tener al menos 30 caracteres para poder ser analizadas.');
      return;
    }

    setError('');
    onSubmit(activeTab, inputText);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setInputText(value);
      if (value.trim()) setError('');
    }
  };

  const charCount = inputText.length;
  const charPercent = (charCount / MAX_CHARS) * 100;

  // SVGs for Tab icons
  const renderTabIcon = (tab) => {
    switch (tab) {
      case 'email':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        );
      case 'url':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        );
      case 'headers':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  return (
    <div className="glass-panel" style={{ height: 'fit-content' }}>
      <h2 className="panel-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)' }}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        Motor de Escaneo
      </h2>

      <form onSubmit={handleSubmit} className="analysis-form">
        <div className="input-group">
          <label className="input-label">Tipo de Entrada</label>
          <div className="tab-selector">
            <button
              type="button"
              className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => handleTabChange('email')}
              disabled={isLoading}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                {renderTabIcon('email')} Correo
              </span>
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'url' ? 'active' : ''}`}
              onClick={() => handleTabChange('url')}
              disabled={isLoading}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                {renderTabIcon('url')} Enlace URL
              </span>
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'headers' ? 'active' : ''}`}
              onClick={() => handleTabChange('headers')}
              disabled={isLoading}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                {renderTabIcon('headers')} Cabeceras
              </span>
            </button>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="scanner-input">Contenido sospechoso</label>
          <div className="textarea-wrapper">
            <textarea
              id="scanner-input"
              className="text-input"
              value={inputText}
              onChange={handleInputChange}
              placeholder={PLACEHOLDERS[activeTab]}
              disabled={isLoading}
            />
            <div className="char-counter-wrapper">
              <div className="char-counter-bar">
                <div
                  className="char-counter-fill"
                  style={{
                    width: `${charPercent}%`,
                    background: charPercent > 90 ? 'var(--risk-high)' : charPercent > 70 ? 'var(--risk-medium)' : 'var(--text-muted)',
                  }}
                />
              </div>
              <span className={`char-counter-text ${charPercent > 90 ? 'char-warn' : ''}`}>
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>
          </div>
          {activeTab === 'headers' && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.4rem', fontStyle: 'italic', background: 'var(--color-primary-glow)', padding: '0.5rem 0.75rem', borderRadius: '0.4rem', border: '1px solid var(--border-subtle)', lineHeight: '1.4' }}>
              <strong>¿Cómo obtener las cabeceras?</strong><br/>
              • En <strong>Gmail</strong>: Abre el correo &gt; Tres puntos ⋮ &gt; <em>"Mostrar original"</em>.<br/>
              • En <strong>Outlook</strong>: Abre el correo &gt; Tres puntos &gt; <em>"Ver" &gt; "Detalles del mensaje"</em> (u "Origen del mensaje").<br/>
              Copia todo el texto y pégalo arriba.
            </div>
          )}
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.4rem', lineHeight: '1.4' }}>
            Tu contenido se analiza localmente en el navegador. Solo el dominio de URLs personalizadas se consulta con urlscan.io de forma anónima.
          </div>
          {error && <span style={{ color: 'var(--risk-high)', fontSize: '0.85rem', fontWeight: 600 }}>{error}</span>}
        </div>

        <div className="example-selector-container">
          <span className="example-label">Haga clic en un ejemplo para probar rápidamente:</span>
          <div className="example-tags">
            {EXAMPLES[activeTab].map((example, idx) => (
              <span
                key={idx}
                className="example-tag"
                onClick={() => !isLoading && handleExampleClick(example.text)}
              >
                {example.label}
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animation: 'rotateRadar 1s linear infinite' }}>
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
              Analizando...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Iniciar Análisis
            </>
          )}
        </button>
      </form>
    </div>
  );
}
