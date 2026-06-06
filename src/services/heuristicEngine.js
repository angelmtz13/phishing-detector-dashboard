/**
 * heuristicEngine.js
 * Refactored phishing detection engine.
 * Extracted from App.jsx for modularity and testability.
 */

import {
  URGENCY_KEYWORDS,
  CREDENTIAL_KEYWORDS,
  FINANCIAL_KEYWORDS,
  FINANCIAL_WEIGHT,
  DANGEROUS_EXTENSIONS,
  ATTACHMENT_WEIGHT,
  HEADER_PATTERNS,
  RISKY_TLDS,
  RISKY_TLD_WEIGHT,
  FREE_HOSTING_LIST,
  FREE_HOSTING_WEIGHT,
  BRAND_KEYWORDS,
  BRAND_KEYWORD_WEIGHT,
  URL_SHORTENERS,
  URL_SHORTENER_WEIGHT,
  SUSPICIOUS_DOMAIN_COMPLEXITY_WEIGHT,
  TRUSTED_DOMAINS,
  TRUSTED_DOMAIN_REDUCTION,
  SUSPICIOUS_DOMAINS_IN_TEXT,
  SUSPICIOUS_DOMAIN_TEXT_WEIGHT,
} from './patterns.js';

import { detectHomoglyphs, detectBrandImpersonation } from './homoglyphDetector.js';

/**
 * Analyze an email body for phishing indicators.
 * @param {string} text - The raw email text
 * @returns {{ score: number, threats: string[], details: string[], recommendations: string[] }}
 */
function analyzeEmail(text) {
  const lowerText = text.toLowerCase();
  let score = 0;
  const threats = [];
  const details = [];
  const recommendations = [];

  // 1. Urgency keywords
  URGENCY_KEYWORDS.forEach(group => {
    const matched = group.words.filter(w => lowerText.includes(w));
    if (matched.length > 0) {
      score += group.weight;
      threats.push(`${group.label} (coincidencia con: "${matched[0]}")`);
      details.push(`Análisis lingüístico: Flag de urgencia activado por "${matched[0]}". (+${group.weight} pts)`);
    }
  });

  // 2. Credential harvesting keywords
  CREDENTIAL_KEYWORDS.forEach(group => {
    const matched = group.words.filter(w => lowerText.includes(w));
    if (matched.length > 0) {
      score += group.weight;
      threats.push(`${group.label} (coincidencia con: "${matched[0]}")`);
      details.push(`Análisis de comportamiento: Solicitud de validación mediante "${matched[0]}". (+${group.weight} pts)`);
    }
  });

  // 3. Financial bait keywords
  const matchedFinance = FINANCIAL_KEYWORDS.filter(w => lowerText.includes(w));
  if (matchedFinance.length > 0) {
    score += FINANCIAL_WEIGHT;
    threats.push(`Ganchos o pretextos económicos fraudulentos (ej: "${matchedFinance[0]}")`);
    details.push(`Análisis semántico: Detección de palabras clave financieras ("${matchedFinance[0]}"). (+${FINANCIAL_WEIGHT} pts)`);
  }

  // 4. Suspicious domains embedded in email text
  const foundDomains = SUSPICIOUS_DOMAINS_IN_TEXT.filter(domain => lowerText.includes(domain));
  if (foundDomains.length > 0) {
    score += SUSPICIOUS_DOMAIN_TEXT_WEIGHT;
    threats.push(`Enlaces a dominios externos no institucionales sospechosos (ej: "${foundDomains[0]}")`);
    details.push(`Análisis perimetral: Detección de dominio de alto riesgo inyectado en el texto: "${foundDomains[0]}". (+${SUSPICIOUS_DOMAIN_TEXT_WEIGHT} pts)`);
  }

  // 5. Dangerous attachment extensions
  const foundExtensions = DANGEROUS_EXTENSIONS.filter(ext => lowerText.includes(ext));
  if (foundExtensions.length > 0) {
    score += ATTACHMENT_WEIGHT;
    threats.push(`Mención de archivos adjuntos potencialmente peligrosos (${foundExtensions.slice(0, 3).join(', ')})`);
    details.push(`Análisis de adjuntos: Extensiones de alto riesgo detectadas en el texto: ${foundExtensions.slice(0, 3).join(', ')}. (+${ATTACHMENT_WEIGHT} pts)`);
  }

  // 6. Email header analysis (if headers are pasted)
  Object.entries(HEADER_PATTERNS).forEach(([key, config]) => {
    if (key === 'suspiciousReceived') return; // informational only
    const match = text.match(config.pattern);
    if (match && config.weight > 0) {
      score += config.weight;
      threats.push(config.label);
      details.push(`Análisis de cabeceras: ${config.label} — patrón "${match[0]}". (+${config.weight} pts)`);
    }
  });

  // Recommendations for emails
  recommendations.push('No hagas clic en ningún enlace ni respondas a este mensaje.');
  if (score >= 70) {
    recommendations.push('Reporta este remitente de inmediato al equipo de Seguridad Informática.');
    recommendations.push('Si ingresaste credenciales, cámbialas inmediatamente en el portal oficial.');
  } else if (score >= 30) {
    recommendations.push('Compara la dirección del remitente con correos oficiales conocidos.');
    recommendations.push('No descargues archivos adjuntos de este remitente.');
  } else {
    recommendations.push('Compara la dirección del remitente con correos oficiales conocidos.');
  }

  return { score, threats, details, recommendations };
}

/**
 * Extract domain from a URL text.
 * @param {string} text - The URL text
 * @returns {string|null}
 */
function extractDomain(text) {
  try {
    let urlString = text.trim();
    if (!/^https?:\/\//i.test(urlString)) {
      urlString = 'http://' + urlString;
    }
    const parsedUrl = new URL(urlString);
    return parsedUrl.hostname.toLowerCase();
  } catch {
    const match = text.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/i);
    return match ? match[0].toLowerCase() : text.toLowerCase();
  }
}

/**
 * Analyze a URL for phishing indicators.
 * @param {string} text - The URL string
 * @returns {{ score: number, threats: string[], details: string[], recommendations: string[] }}
 */
function analyzeUrl(text) {
  const domain = extractDomain(text);
  let score = 0;
  const threats = [];
  const details = [];
  const recommendations = [];

  // 1. Risky TLD check
  const matchedTld = RISKY_TLDS.find(tld => domain.endsWith(tld));
  if (matchedTld) {
    score += RISKY_TLD_WEIGHT;
    threats.push(`Uso de dominios o TLDs comúnmente abusados por atacantes (${matchedTld})`);
    details.push(`Análisis de DNS: El dominio finaliza con un TLD de bajo coste/alto riesgo. (+${RISKY_TLD_WEIGHT} pts)`);
  }

  // 2. Free hosting platforms
  const matchedFreeHost = FREE_HOSTING_LIST.find(host => domain.includes(host));
  if (matchedFreeHost) {
    score += FREE_HOSTING_WEIGHT;
    threats.push(`Alojamiento web en servidores compartidos o infraestructuras gratuitas (${matchedFreeHost})`);
    details.push(`Análisis de Infraestructura: Dominio alojado en plataforma pública propensa a campañas fraudulentas. (+${FREE_HOSTING_WEIGHT} pts)`);
  }

  // 3. Brand keywords in URL
  const foundKeywords = BRAND_KEYWORDS.filter(kw => domain.includes(kw));
  if (foundKeywords.length > 0) {
    score += BRAND_KEYWORD_WEIGHT;
    threats.push(`Uso de palabras clave institucionales para confundir visualmente (ej: "${foundKeywords[0]}")`);
    details.push(`Análisis de typosquatting: Palabra reservada de soporte/marca identificada en el dominio ("${foundKeywords[0]}"). (+${BRAND_KEYWORD_WEIGHT} pts)`);
  }

  // 4. URL shorteners
  const matchedShortener = URL_SHORTENERS.find(s => domain.includes(s));
  if (matchedShortener) {
    score += URL_SHORTENER_WEIGHT;
    threats.push(`URL acortada que oculta el destino real del enlace (${matchedShortener})`);
    details.push(`Análisis de redirección: Servicio de acortamiento de URL detectado (${matchedShortener}). El destino real no es verificable sin seguir el enlace. (+${URL_SHORTENER_WEIGHT} pts)`);
  }

  // 5. Domain complexity (hyphens, excessive numbers)
  if (domain.includes('--') || (domain.match(/[0-9]/g) || []).length > 4) {
    score += SUSPICIOUS_DOMAIN_COMPLEXITY_WEIGHT;
    threats.push('Complejidad sintáctica del dominio sospechosa (números o guiones consecutivos)');
    details.push(`Análisis morfológico: Estructura de subdominio atípica o generada aleatoriamente. (+${SUSPICIOUS_DOMAIN_COMPLEXITY_WEIGHT} pts)`);
  }

  // 6. Homoglyph detection
  const homoglyphResult = detectHomoglyphs(domain);
  if (homoglyphResult.found) {
    score += homoglyphResult.score;
    threats.push(...homoglyphResult.threats);
    details.push(...homoglyphResult.details);
  }

  // 7. Brand impersonation via typosquatting
  const brandResult = detectBrandImpersonation(domain);
  if (brandResult.isSuspicious) {
    score += brandResult.score;
    threats.push(`Posible suplantación de la marca "${brandResult.matchedBrand}" mediante typosquatting`);
    details.push(brandResult.detail);
  }

  // 8. Trusted domain reduction
  const isTrusted = TRUSTED_DOMAINS.some(td => domain.includes(td));
  if (isTrusted) {
    score = Math.max(0, score - TRUSTED_DOMAIN_REDUCTION);
    details.push(`Filtro de confianza: Dominio institucional oficial o repositorio de confianza detectado (-${TRUSTED_DOMAIN_REDUCTION} pts).`);
  }

  // Recommendations for URLs
  recommendations.push('Evita introducir información personal, números de tarjeta o credenciales.');
  if (score >= 70) {
    recommendations.push('Cierra la pestaña del navegador inmediatamente.');
    recommendations.push('Asegúrate de que tus portales institucionales usen la extensión oficial.');
  } else if (score >= 30) {
    recommendations.push('Verifica el certificado de seguridad de la conexión.');
    recommendations.push('Compara el dominio con los enlaces oficiales de tu institución.');
  } else {
    recommendations.push('Verifica el certificado de seguridad de la conexión.');
  }

  return { score, threats, details, recommendations };
}

/**
 * Analyze raw email headers for authenticity and spam/phishing signals.
 * @param {string} text - The raw headers text
 * @returns {{ score: number, threats: string[], details: string[], recommendations: string[] }}
 */
function analyzeHeaders(text) {
  const lowerText = text.toLowerCase();
  let score = 0;
  const threats = [];
  const details = [];
  const recommendations = [];

  // 1. SPF Check
  if (lowerText.includes('spf=fail') || lowerText.includes('spf=softfail')) {
    score += 30;
    threats.push("Autenticación SPF fallida — el servidor de envío no está autorizado");
    details.push("Análisis de cabeceras: SPF fallido/incompleto detectado. (+30 pts)");
  }

  // 2. DKIM Check
  const hasDkimPass = lowerText.includes('dkim=pass');
  const hasDkimFail = lowerText.includes('dkim=fail');
  if (hasDkimFail || !hasDkimPass) {
    score += 25;
    threats.push("Firma DKIM inválida o ausente");
    details.push("Análisis de cabeceras: Firma criptográfica DKIM no válida o ausente. (+25 pts)");
  }

  // 3. DMARC Check
  if (lowerText.includes('dmarc=fail')) {
    score += 25;
    threats.push("Política DMARC violada");
    details.push("Análisis de cabeceras: Fallo en política de alineación DMARC. (+25 pts)");
  }

  // 4. X-Mailer Check
  const xMailerMatch = text.match(/x-mailer:\s*([^\r\n]+)/i);
  if (xMailerMatch) {
    const mailerVal = xMailerMatch[1].toLowerCase();
    if (mailerVal.includes('phpmailer') || mailerVal.includes('mailmate') || mailerVal.includes('swiftmailer')) {
      score += 15;
      threats.push("Mailer automatizado detectado — posible campaña masiva");
      details.push(`Análisis de cabeceras: Cliente de envío automatizado detectado (${xMailerMatch[1]}). (+15 pts)`);
    }
  }

  // 5. Received IP / Hops check
  const receivedHops = (lowerText.match(/received:/g) || []).length;
  if (receivedHops > 3) {
    score += 20;
    threats.push("Ruta de entrega sospechosa — múltiples saltos de retransmisión (Recibido > 3 veces)");
    details.push(`Análisis de cabeceras: Se detectaron ${receivedHops} saltos (Received) en la ruta del correo. (+20 pts)`);
  }

  // 6. SPF & DKIM pass together reduction
  if (lowerText.includes('spf=pass') && lowerText.includes('dkim=pass')) {
    score -= 40;
    details.push("Filtro de confianza: Verificación mutua SPF y DKIM exitosa (-40 pts).");
  }

  // Recommendations for headers
  recommendations.push("No respondas ni interactúes con enlaces de correos que muestren fallos de autenticación.");
  if (score >= 70) {
    recommendations.push("Reporta esta cabecera y el correo asociado inmediatamente al equipo de ciberseguridad.");
  } else if (score >= 30) {
    recommendations.push("Ten precaución al procesar este correo; verifica la identidad del remitente por canales alternativos.");
  } else {
    recommendations.push("Las cabeceras analizadas muestran indicadores de autenticación legítimos.");
  }

  return { score, threats, details, recommendations };
}

/**
 * Main entry point: analyze text as either email, URL, or headers.
 * @param {'email'|'url'|'headers'} type
 * @param {string} text
 * @returns {object} Full analysis result
 */
export function analyzeHeuristics(type, text) {
  let result;

  if (type === 'email') {
    result = analyzeEmail(text);
  } else if (type === 'headers') {
    result = analyzeHeaders(text);
  } else {
    result = analyzeUrl(text);
  }

  // Clamp score between 0 and 100
  result.score = Math.min(100, Math.max(0, result.score));

  // Determine risk level
  let riskLevel = 'low';
  if (result.score >= 70) {
    riskLevel = 'high';
  } else if (result.score >= 30) {
    riskLevel = 'medium';
  }

  return {
    id: `dynamic_heuristic_${type}_analysis`,
    type,
    riskLevel,
    riskScore: result.score,
    threatsFound: result.threats,
    technicalDetails: result.details,
    recommendations: result.recommendations,
  };
}

/**
 * Extract domain from URL text (exported for use in App.jsx urlscan integration).
 */
export { extractDomain };
