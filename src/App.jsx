import { useState, useEffect } from 'react';
import AnalysisForm from './components/AnalysisForm';
import Dashboard from './components/Dashboard';
import PhishingGuide from './components/PhishingGuide';
import HistoryPanel from './components/HistoryPanel';
import PatternGuide from './components/PatternGuide';
import mockData from './data/mockAnalysis.json';
import { analyzeHeuristics, extractDomain } from './services/heuristicEngine.js';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
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
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let matchedScenario = null;
      if (type === 'email') {
        if (lowerText.includes('estimado:   «direccion_de_correo_electronico»   este es su: ultimo aviso')) {
          matchedScenario = mockData.scenarios.find(s => s.id === 'institutional_phishing_email');
        } else if (lowerText.includes('notificación final de bloqueo') || lowerText.includes('mantener-cuenta.iceiy.com')) {
          matchedScenario = mockData.scenarios.find(s => s.id === 'institutional_block_alert_email');
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

      // Helper function to update history
      const addHistoryEntry = (inputType, inputText, resultObj) => {
        const entry = {
          id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          type: inputType,
          riskLevel: resultObj.riskLevel,
          riskScore: resultObj.riskScore,
          analyzedAt: resultObj.analyzedAt || new Date().toISOString(),
          preview: inputText.length > 60 ? inputText.substring(0, 60) + '...' : inputText,
          result: resultObj
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      };

      // 2. If it is a custom input, calculate score dynamically using the Heuristic Engine
      let isCustomInput = false;
      if (!matchedScenario) {
        matchedScenario = analyzeHeuristics(type, text);
        isCustomInput = true;
      }

      // 3. For URLs, enrich with real-world urlscan.io threat intelligence ONLY if it is a custom input
      if (type === 'url' && isCustomInput) {
        const domain = extractDomain(text);

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

              const finalResult = {
                ...matchedScenario,
                technicalDetails: [...(matchedScenario.technicalDetails || []), ...apiLogs],
                analyzedAt: new Date().toISOString()
              };
              setAnalysisResult(finalResult);
              setIsLoading(false);
              addHistoryEntry(type, text, finalResult);
            })
            .catch(() => {
              const finalResult = {
                ...matchedScenario,
                apiOffline: true,
                technicalDetails: [
                  ...(matchedScenario.technicalDetails || []),
                  `[urlscan.io Threat Intel]: Sensor externo offline (CORS/Límite de cuota). Usando firmas de reputación locales.`
                ],
                analyzedAt: new Date().toISOString()
              };
              setAnalysisResult(finalResult);
              setIsLoading(false);
              addHistoryEntry(type, text, finalResult);
            });
        } else {
          const finalResult = {
            ...matchedScenario,
            analyzedAt: new Date().toISOString()
          };
          setAnalysisResult(finalResult);
          setIsLoading(false);
          addHistoryEntry(type, text, finalResult);
        }
      } else {
        // Resolve immediately for preset examples, emails and headers
        const finalResult = {
          ...matchedScenario,
          analyzedAt: new Date().toISOString()
        };
        setAnalysisResult(finalResult);
        setIsLoading(false);
        addHistoryEntry(type, text, finalResult);
      }
    }, 1500);
  };

  const handleSelectHistoryEntry = (entry) => {
    setAnalysisResult(entry.result);
  };

  const handleDeleteHistoryEntry = (entryId) => {
    setHistory(prev => prev.filter(e => e.id !== entryId));
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
          Javard Corporativo v1.1
        </div>
        <h1 className="app-title">Detector de Phishing Institucional</h1>
        <p className="app-subtitle">
          Analiza correos electrónicos o URLs orientados a organizaciones.
          Especializado en detectar suplantación de identidad de soporte técnico de TI, falsos avisos de suspensión y dominios no institucionales.
        </p>
      </header>

      <PhishingGuide />

      <main className="dashboard-grid">
        <div className="left-column">
          <AnalysisForm onSubmit={handleAnalysisSubmit} isLoading={isLoading} />
          <HistoryPanel
            history={history}
            onSelectEntry={handleSelectHistoryEntry}
            onDeleteEntry={handleDeleteHistoryEntry}
          />
        </div>
        <Dashboard analysisResult={analysisResult} isLoading={isLoading} />
      </main>

      <PatternGuide />
    </div>
  );
}

export default App;
