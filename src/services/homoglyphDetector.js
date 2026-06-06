/**
 * homoglyphDetector.js
 * Detects visual confusion attacks in domain names:
 * - Homoglyph substitution (Cyrillic а vs Latin a)
 * - Punycode domains (xn--)
 * - Mixed-script attacks (combining Unicode scripts)
 */

// Map of commonly abused homoglyphs: { lookalike → real Latin character }
const HOMOGLYPH_MAP = {
  // Cyrillic
  'а': 'a', 'с': 'c', 'е': 'e', 'о': 'o', 'р': 'p', 'х': 'x',
  'у': 'y', 'ѕ': 's', 'і': 'i', 'ј': 'j', 'ɡ': 'g', 'ԁ': 'd',
  'ԝ': 'w', 'ν': 'v', 'ɑ': 'a', 'Ь': 'b',
  // Greek
  'α': 'a', 'ε': 'e', 'ι': 'i', 'ο': 'o', 'τ': 't', 'υ': 'u',
  'κ': 'k', 'η': 'n', 'ρ': 'p',
  // Special / visually similar
  '0': 'o', '1': 'l', 'ɩ': 'l', 'ⅰ': 'i', 'ℓ': 'l',
  'ℎ': 'h', 'ℊ': 'g',
};

// Unicode script ranges for mixed-script detection
const SCRIPT_RANGES = [
  { name: 'Latin', range: /[\u0041-\u024F]/ },
  { name: 'Cyrillic', range: /[\u0400-\u04FF]/ },
  { name: 'Greek', range: /[\u0370-\u03FF]/ },
  { name: 'Armenian', range: /[\u0530-\u058F]/ },
  { name: 'Georgian', range: /[\u10A0-\u10FF]/ },
];

/**
 * Detect homoglyph characters in a domain name.
 * @param {string} domain - The domain to analyze
 * @returns {{ found: boolean, score: number, details: string[], threats: string[] }}
 */
export function detectHomoglyphs(domain) {
  const results = {
    found: false,
    score: 0,
    details: [],
    threats: [],
  };

  if (!domain) return results;

  const lowerDomain = domain.toLowerCase();

  // 1. Check for punycode (xn-- prefix)
  if (lowerDomain.includes('xn--')) {
    results.found = true;
    results.score += 30;
    results.threats.push('Dominio con codificación Punycode (xn--) — posible suplantación visual de caracteres internacionales');
    results.details.push(`Análisis Unicode: Punycode detectado en "${domain}". Esto puede ocultar caracteres de otros idiomas que imitan letras latinas. (+30 pts)`);
  }

  // 2. Check for homoglyph substitutions
  const homoglyphsFound = [];
  for (const char of lowerDomain) {
    if (HOMOGLYPH_MAP[char]) {
      homoglyphsFound.push({ original: char, looksLike: HOMOGLYPH_MAP[char] });
    }
  }

  if (homoglyphsFound.length > 0) {
    results.found = true;
    results.score += 35;
    const examples = homoglyphsFound.slice(0, 3).map(h => `"${h.original}" → "${h.looksLike}"`).join(', ');
    results.threats.push(`Caracteres homoglyphs detectados: sustitución visual de letras (${examples})`);
    results.details.push(`Análisis de confusión visual: Se encontraron ${homoglyphsFound.length} carácter(es) que imitan letras latinas. Sustituciones: ${examples}. (+35 pts)`);
  }

  // 3. Check for mixed-script attack
  const detectedScripts = [];
  for (const { name, range } of SCRIPT_RANGES) {
    if (range.test(lowerDomain)) {
      detectedScripts.push(name);
    }
  }

  if (detectedScripts.length > 1) {
    results.found = true;
    results.score += 25;
    results.threats.push(`Ataque de scripts mixtos: el dominio mezcla ${detectedScripts.join(' + ')} en un solo nombre`);
    results.details.push(`Análisis de scripts Unicode: Mezcla de sistemas de escritura detectada (${detectedScripts.join(', ')}). Esto es una técnica avanzada de phishing. (+25 pts)`);
  }

  return results;
}

/**
 * Check if a domain looks like a well-known brand using Levenshtein-like comparison.
 * @param {string} domain - The domain to check
 * @returns {{ isSuspicious: boolean, matchedBrand: string|null, score: number, detail: string }}
 */
export function detectBrandImpersonation(domain) {
  const knownBrands = [
    'microsoft', 'google', 'apple', 'amazon', 'netflix', 'paypal',
    'facebook', 'instagram', 'outlook', 'office365', 'docusign',
    'dropbox', 'linkedin', 'twitter', 'whatsapp', 'telegram',
  ];

  if (!domain) return { isSuspicious: false, matchedBrand: null, score: 0, detail: '' };

  // Remove TLD for comparison
  const domainBase = domain.split('.')[0].toLowerCase().replace(/[-_0-9]/g, '');

  for (const brand of knownBrands) {
    // Check if domain contains the brand name with extra chars (typosquatting)
    if (domainBase.includes(brand) && domainBase !== brand) {
      return {
        isSuspicious: true,
        matchedBrand: brand,
        score: 20,
        detail: `Análisis de typosquatting: El dominio contiene "${brand}" combinado con caracteres adicionales — posible suplantación de marca. (+20 pts)`,
      };
    }

    // Check very close misspellings (1-char difference)
    if (domainBase.length >= brand.length - 1 && domainBase.length <= brand.length + 1) {
      const distance = levenshteinDistance(domainBase, brand);
      if (distance === 1) {
        return {
          isSuspicious: true,
          matchedBrand: brand,
          score: 25,
          detail: `Análisis de typosquatting: "${domainBase}" es muy similar a "${brand}" (distancia de 1 carácter) — posible typosquatting. (+25 pts)`,
        };
      }
    }
  }

  return { isSuspicious: false, matchedBrand: null, score: 0, detail: '' };
}

/**
 * Basic Levenshtein distance for short strings.
 */
function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}
