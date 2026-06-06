import React, { useState } from 'react';

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
  ]
};

const PLACEHOLDERS = {
  email: 'Pega el texto del correo sospechoso aquí...\n(Ej: "Estimado: usuario@institucion.edu este es su: ULTIMO AVISO...")',
  url: 'Escribe o pega la dirección URL sospechosa...\n(Ej: https://verificacion-01--seguridad-0201.replit.app)'
};

export default function AnalysisForm({ onSubmit, isLoading }) {
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'url'
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
    setError('');
    onSubmit(activeTab, inputText);
  };

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
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="scanner-input">Contenido sospechoso</label>
          <div className="textarea-wrapper">
            <textarea
              id="scanner-input"
              className="text-input"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder={PLACEHOLDERS[activeTab]}
              disabled={isLoading}
            />
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
