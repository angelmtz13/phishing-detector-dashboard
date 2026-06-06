import React, { useState, useEffect } from 'react';
import AnalysisForm from './components/AnalysisForm';
import Dashboard from './components/Dashboard';
import PhishingGuide from './components/PhishingGuide';
import mockData from './data/mockAnalysis.json';

const analyzeHeuristics = (type, text) => {
  const lowerText = text.toLowerCase();
  let score = 0;
  const threats = [];
  const details = [];
  const recommendations = [];

  if (type === 'email') {
    // 1. Urgency / Threat level checks
    const urgencyKeywords = [
      { words: ['ultimo aviso', 'último aviso', 'aviso urgente', 'notificación final', 'notificacion final'], weight: 25, label: 'Tono de urgencia crítica / Advertencia final' },
      { words: ['suspensión', 'suspension', 'desactivar', 'desactivación', 'bloqueo', 'bloquear', 'cancelación'], weight: 20, label: 'Amenaza directa de suspensión o bloqueo de cuenta' },
      { words: ['inmediatamente', 'de inmediato', 'plazo', 'expira', 'vulnerabilidad', 'urgente'], weight: 15, label: 'Presión de tiempo para forzar la acción' }
    ];

    urgencyKeywords.forEach(group => {
      const matched = group.words.filter(w => lowerText.includes(w));
      if (matched.length > 0) {
        score += group.weight;
        threats.push(`${group.label} (coincidencia con: "${matched[0]}")`);
        details.push(`Análisis lingüístico: Flag de urgencia activado por "${matched[0]}". (+${group.weight} pts)`);
      }
    });

    // 2. Authentication / Credential Harvesting hooks
    const credentialKeywords = [
      { words: ['validar', 'verificar', '2auth', 'vinculacion', 'vinculación', 'actualizar datos', 'restablecer', 'confirmar cuenta'], weight: 20, label: 'Solicitud de validación de credenciales / Autenticación (MFA)' },
      { words: ['soporte de ti', 'soporte-ti', 'administrador del sistema', 'equipo de microsoft', 'seguridad de correo'], weight: 15, label: 'Suplantación de identidad de departamentos de soporte de TI' }
    ];

    credentialKeywords.forEach(group => {
      const matched = group.words.filter(w => lowerText.includes(w));
      if (matched.length > 0) {
        score += group.weight;
        threats.push(`${group.label} (coincidencia con: "${matched[0]}")`);
        details.push(`Análisis de comportamiento: Solicitud de validación mediante "${matched[0]}". (+${group.weight} pts)`);
      }
    });

    // 3. Financial bait keywords
    const financialKeywords = ['bono', 'subsidio', 'adquirir plan', 'suscripción', 'suscripcion', 'precio', 'pago', 'valor', 'dólares', 'usd', '0.'];
    const matchedFinance = financialKeywords.filter(w => lowerText.includes(w));
    if (matchedFinance.length > 0) {
      score += 15;
      threats.push(`Ganchos o pretextos económicos fraudulentos (ej: "${matchedFinance[0]}")`);
      details.push(`Análisis semántico: Detección de palabras clave financieras ("${matchedFinance[0]}"). (+15 pts)`);
    }

    // 4. Domains and extensions in text
    const suspiciousDomains = [
      'replit.app', 'sevalla.page', 'versoly.page', 'web.core.windows.net', 
      'sites.google.com', 'zya.me', 'iceiy.com', 'icciy.com', 'hstn.me', '.sbs', '.xyz', '.me/'
    ];
    
    const foundDomains = suspiciousDomains.filter(domain => lowerText.includes(domain));
    if (foundDomains.length > 0) {
      score += 35;
      threats.push(`Enlaces a dominios externos no institucionales sospechosos (ej: "${foundDomains[0]}")`);
      details.push(`Análisis perimetral: Detección de dominio de alto riesgo inyectado en el texto: "${foundDomains[0]}". (+35 pts)`);
    }

    // Recommendations for emails
    recommendations.push('No hagas clic en ningún enlace ni respondas a este mensaje.');
    if (score >= 70) {
      recommendations.push('Reporta este remitente de inmediato al equipo de Seguridad Informática.');
      recommendations.push('Si ingresaste credenciales, cámbialas inmediatamente en el portal oficial.');
    } else {
      recommendations.push('Compara la dirección del remitente con correos oficiales conocidos.');
    }

  } else if (type === 'url') {
    let domain = '';
    try {
      let urlString = text.trim();
      if (!/^https?:\/\//i.test(urlString)) {
        urlString = 'http://' + urlString;
      }
      const parsedUrl = new URL(urlString);
      domain = parsedUrl.hostname.toLowerCase();
    } catch (e) {
      const match = text.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/i);
      domain = match ? match[0].toLowerCase() : text.toLowerCase();
    }

    // TLD checks
    const riskyTlds = ['.sbs', '.xyz', '.page', '.me', '.online', '.site', '.click', '.top', '.xyz'];
    const matchedTld = riskyTlds.find(tld => domain.endsWith(tld));
    if (matchedTld) {
      score += 30;
      threats.push(`Uso de dominios o TLDs comúnmente abusados por atacantes (${matchedTld})`);
      details.push(`Análisis de DNS: El dominio finaliza con un TLD de bajo coste/alto riesgo. (+30 pts)`);
    }

    const freeHostingList = ['replit.app', 'sevalla.page', 'versoly.page', 'web.core.windows.net', 'sites.google.com', 'zya.me', 'iceiy.com', 'icciy.com', 'hstn.me'];
    const matchedFreeHost = freeHostingList.find(host => domain.includes(host));
    if (matchedFreeHost) {
      score += 40;
      threats.push(`Alojamiento web en servidores compartidos o infraestructuras gratuitas (${matchedFreeHost})`);
      details.push(`Análisis de Infraestructura: Dominio alojado en plataforma pública propensa a campañas fraudulentas. (+40 pts)`);
    }

    // Brand and security keywords in url
    const brandKeywords = ['microsoft', 'outlook', 'office', 'docusign', 'verificacion', 'seguridad', 'login', 'soporte', 'cuenta', 'renovacion', 'mantenimiento', 'acces0', 'acount'];
    const foundKeywords = brandKeywords.filter(kw => domain.includes(kw));
    if (foundKeywords.length > 0) {
      score += 25;
      threats.push(`Uso de palabras clave institucionales para confundir visualmente (ej: "${foundKeywords[0]}")`);
      details.push(`Análisis de typosquatting: Palabra reservada de soporte/marca identificada en el dominio ("${foundKeywords[0]}"). (+25 pts)`);
    }

    if (domain.includes('--') || (domain.match(/[0-9]/g) || []).length > 4) {
      score += 15;
      threats.push('Complejidad sintáctica del dominio sospechosa (números o guiones consecutivos)');
      details.push('Análisis morfológico: Estructura de subdominio atípica o generada aleatoriamente. (+15 pts)');
    }

    if (domain.includes('github.com') || domain.includes('.edu') || domain.includes('.gob')) {
      score = Math.max(0, score - 50);
      details.push('Filtro de confianza: Dominio institucional oficial o repositorio de confianza detectado (-50 pts).');
    }

    recommendations.push('Evita introducir información personal, números de tarjeta o credenciales.');
    if (score >= 70) {
      recommendations.push('Cierra la pestaña del navegador inmediatamente.');
      recommendations.push('Asegúrate de que tus portales institucionales usen la extensión oficial.');
    } else {
      recommendations.push('Verifica el certificado de seguridad de la conexión.');
    }
  }

  score = Math.min(100, Math.max(0, score));

  let riskLevel = 'low';
  if (score >= 70) {
    riskLevel = 'high';
  } else if (score >= 30) {
    riskLevel = 'medium';
  }

  return {
    id: `dynamic_heuristic_${type}_analysis`,
    type,
    riskLevel,
    riskScore: score,
    threatsFound: threats,
    technicalDetails: details,
    recommendations
  };
};

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleAnalysisSubmit = (type, text) => {
    setIsLoading(true);
    setAnalysisResult(null);

    // Simulate API call delay of 1.5 seconds
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let matchedScenario = null;

      // 1. Check if it matches an exact pre-defined showcase example from AnalysisForm
      if (type === 'email') {
        if (lowerText.includes('estimado:   «direccion_de_correo_electronico»   este es su: ultimo aviso')) {
          matchedScenario = mockData.scenarios.find(s => s.id === 'institutional_phishing_email');
        } else if (lowerText.includes('bono universitario de $150')) {
          matchedScenario = mockData.scenarios.find(s => s.id === 'institutional_fake_bonus_email');
        } else if (lowerText.includes('mantenimiento preventivo anual') && lowerText.includes('soporte-ti@institucion.edu')) {
          matchedScenario = mockData.scenarios.find(s => s.id === 'safe_institutional_email');
        }
      } else if (type === 'url') {
        if (lowerText.includes('verificacion-01--seguridad-0201.replit.app')) {
          matchedScenario = mockData.scenarios.find(s => s.id === 'institutional_fake_replit_url');
        } else if (lowerText.includes('intranet-universidad-portal.com/login')) {
          matchedScenario = mockData.scenarios.find(s => s.id === 'institutional_typosquatting_url');
        } else if (lowerText.includes('intranet.mi-institucion.edu/portal')) {
          matchedScenario = mockData.scenarios.find(s => s.id === 'safe_institutional_url');
        } else if (lowerText.includes('github.com')) {
          matchedScenario = mockData.scenarios.find(s => s.id === 'safe_github_url');
        }
      }

      // 2. If it is a custom input, calculate score dynamically using the Heuristic Engine
      let isCustomInput = false;
      if (!matchedScenario) {
        matchedScenario = analyzeHeuristics(type, text);
        isCustomInput = true;
      }

      // 3. For URLs, enrich with real-world urlscan.io threat intelligence ONLY if it is a custom input
      if (type === 'url' && isCustomInput) {
        let domain = null;
        try {
          let urlString = text.trim();
          if (!/^https?:\/\//i.test(urlString)) {
            urlString = 'http://' + urlString;
          }
          const parsedUrl = new URL(urlString);
          domain = parsedUrl.hostname;
        } catch (e) {
          const match = text.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/i);
          domain = match ? match[0] : null;
        }

        if (domain) {
          fetch(`https://urlscan.io/api/v1/search/?q=domain:${domain}&size=3`)
            .then(res => {
              if (!res.ok) throw new Error('API Request Failed');
              return res.json();
            })
            .then(apiData => {
              const scanCount = apiData.total || 0;
              const scanResults = apiData.results || [];
              
              const apiLogs = [
                `[urlscan.io Threat Intel]: Conexión establecida con la base de datos de reputación externa.`,
                `[urlscan.io Threat Intel]: Encontrados ${scanCount} escaneos históricos globales para '${domain}'.`
              ];

              if (scanResults.length > 0) {
                scanResults.forEach((result, idx) => {
                  apiLogs.push(`[Registro #${idx + 1}]: IP: ${result.page.ip || 'N/D'} | País: ${result.page.country || 'N/D'} | Servidor: ${result.page.server || 'N/D'}`);
                });
              } else {
                apiLogs.push(`[Alerta]: El dominio no tiene escaneos previos registrados (Comportamiento habitual en phishing del día cero).`);
              }

              setAnalysisResult({
                ...matchedScenario,
                technicalDetails: [...(matchedScenario.technicalDetails || []), ...apiLogs],
                analyzedAt: new Date().toISOString()
              });
              setIsLoading(false);
            })
            .catch(err => {
              setAnalysisResult({
                ...matchedScenario,
                technicalDetails: [
                  ...(matchedScenario.technicalDetails || []),
                  `[urlscan.io Threat Intel]: Sensor externo offline (CORS/Límite de cuota). Usando firmas de reputación locales.`
                ],
                analyzedAt: new Date().toISOString()
              });
              setIsLoading(false);
            });
        } else {
          setAnalysisResult({
            ...matchedScenario,
            analyzedAt: new Date().toISOString()
          });
          setIsLoading(false);
        }
      } else {
        // Resolve immediately for preset examples and all emails
        setAnalysisResult({
          ...matchedScenario,
          analyzedAt: new Date().toISOString()
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="app-container">
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle theme"
      >
        {darkMode ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </button>
      <header className="app-header">
        <div className="brand-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          PhishShield Corporativo v1.1
        </div>
        <h1 className="app-title">Detector de Phishing Institucional</h1>
        <p className="app-subtitle">
          Analiza correos electrónicos, URLs o cabeceras técnicas orientados a organizaciones.
          Especializado en detectar suplantación de identidad de soporte técnico de TI, falsos avisos de suspensión y dominios no institucionales.
        </p>
      </header>

      <PhishingGuide />

      <main className="dashboard-grid">
        <AnalysisForm onSubmit={handleAnalysisSubmit} isLoading={isLoading} />
        <Dashboard analysisResult={analysisResult} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
