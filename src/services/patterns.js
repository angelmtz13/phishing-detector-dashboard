/**
 * patterns.js
 * Centralized dictionary of all detection patterns for the Phishing Heuristic Engine.
 * Bilingual support: Spanish (ES) + English (EN).
 */

// ─── EMAIL PATTERNS ─────────────────────────────────────────────

export const URGENCY_KEYWORDS = [
  // Spanish
  { words: ['ultimo aviso', 'último aviso', 'aviso urgente', 'notificación final', 'notificacion final'], weight: 25, label: 'Tono de urgencia crítica / Advertencia final' },
  { words: ['suspensión', 'suspension', 'desactivar', 'desactivación', 'bloqueo', 'bloquear', 'cancelación'], weight: 20, label: 'Amenaza directa de suspensión o bloqueo de cuenta' },
  { words: ['inmediatamente', 'de inmediato', 'plazo', 'expira', 'vulnerabilidad', 'urgente'], weight: 15, label: 'Presión de tiempo para forzar la acción' },
  // English
  { words: ['final warning', 'last notice', 'urgent notice', 'final notification'], weight: 25, label: 'Critical urgency tone / Final warning (EN)' },
  { words: ['suspended', 'suspend', 'deactivate', 'deactivation', 'blocked', 'terminated', 'cancellation'], weight: 20, label: 'Direct threat of account suspension or blocking (EN)' },
  { words: ['immediately', 'right away', 'deadline', 'expires', 'act now', 'urgent', 'time-sensitive'], weight: 15, label: 'Time pressure to force action (EN)' },
];

export const CREDENTIAL_KEYWORDS = [
  // Spanish
  { words: ['validar', 'verificar', '2auth', 'vinculacion', 'vinculación', 'actualizar datos', 'restablecer', 'confirmar cuenta'], weight: 20, label: 'Solicitud de validación de credenciales / Autenticación (MFA)' },
  { words: ['soporte de ti', 'soporte-ti', 'administrador del sistema', 'equipo de microsoft', 'seguridad de correo'], weight: 15, label: 'Suplantación de identidad de departamentos de soporte de TI' },
  // English
  { words: ['verify your identity', 'confirm your account', 'validate your account', 'update your credentials', 'reset password', 'confirm identity'], weight: 20, label: 'Credential validation / MFA authentication request (EN)' },
  { words: ['it support', 'it helpdesk', 'system administrator', 'microsoft team', 'security team', 'mail security', 'tech support'], weight: 15, label: 'IT support department impersonation (EN)' },
];

export const FINANCIAL_KEYWORDS = [
  // Spanish
  'bono', 'subsidio', 'adquirir plan', 'suscripción', 'suscripcion', 'precio', 'pago', 'valor', 'dólares', 'usd', '0.',
  // English
  'bonus', 'scholarship', 'free subscription', 'payment', 'invoice', 'refund', 'prize', 'reward', 'grant', 'wire transfer',
];

export const FINANCIAL_WEIGHT = 15;

// ─── DANGEROUS ATTACHMENT PATTERNS ──────────────────────────────

export const DANGEROUS_EXTENSIONS = [
  '.exe', '.scr', '.html', '.htm', '.js', '.vbs', '.bat', '.cmd',
  '.ps1', '.zip', '.rar', '.iso', '.msi', '.dll', '.lnk', '.pif',
  '.com', '.wsf', '.hta',
];

export const ATTACHMENT_WEIGHT = 20;

// ─── EMAIL HEADER PATTERNS ──────────────────────────────────────

export const HEADER_PATTERNS = {
  spfFail: { pattern: /spf[:\s]*(fail|softfail|neutral|none)/i, weight: 20, label: 'Autenticación SPF fallida en cabeceras del correo' },
  dkimFail: { pattern: /dkim[:\s]*(fail|none)/i, weight: 20, label: 'Firma DKIM inválida o ausente en cabeceras' },
  dmarcFail: { pattern: /dmarc[:\s]*(fail|none)/i, weight: 15, label: 'Política DMARC no cumplida' },
  returnPathMismatch: { pattern: /return-path:\s*<([^>]+)>/i, weight: 10, label: 'Return-Path no coincide con el remitente visible' },
  suspiciousReceived: { pattern: /received:\s*from\s+([^\s]+)/i, weight: 0, label: 'Servidor de reenvío detectado en cabeceras' },
};

// ─── URL PATTERNS ───────────────────────────────────────────────

export const RISKY_TLDS = [
  '.sbs', '.xyz', '.page', '.me', '.online', '.site', '.click',
  '.top', '.buzz', '.icu', '.club', '.work', '.rest', '.surf',
];

export const RISKY_TLD_WEIGHT = 30;

export const FREE_HOSTING_LIST = [
  'replit.app', 'sevalla.page', 'versoly.page', 'web.core.windows.net',
  'sites.google.com', 'zya.me', 'iceiy.com', 'icciy.com', 'hstn.me',
  'netlify.app', 'vercel.app', 'herokuapp.com', 'firebaseapp.com',
  'weebly.com', 'wixsite.com', '000webhostapp.com',
];

export const FREE_HOSTING_WEIGHT = 40;

export const BRAND_KEYWORDS = [
  'microsoft', 'outlook', 'office', 'docusign', 'verificacion',
  'seguridad', 'login', 'soporte', 'cuenta', 'renovacion',
  'mantenimiento', 'acces0', 'acount', 'paypal', 'apple',
  'amazon', 'netflix', 'google', 'facebook', 'instagram',
  'whatsapp', 'telegram', 'bancomer', 'banamex', 'santander',
];

export const BRAND_KEYWORD_WEIGHT = 25;

export const URL_SHORTENERS = [
  'bit.ly', 't.ly', 'is.gd', 'tinyurl.com', 'rb.gy', 'cutt.ly',
  'ow.ly', 'shorturl.at', 'tiny.cc', 'v.gd', 'qr.ae', 'lnkd.in',
  'buff.ly', 'adf.ly', 'shorte.st', 'bc.vc', 'soo.gd',
];

export const URL_SHORTENER_WEIGHT = 20;

export const SUSPICIOUS_DOMAIN_COMPLEXITY_WEIGHT = 15;

export const TRUSTED_DOMAINS = [
  'github.com', '.edu', '.gob', '.gov', '.org', '.edu.mx', '.gob.mx',
];

export const TRUSTED_DOMAIN_REDUCTION = 50;

// ─── SUSPICIOUS DOMAINS IN EMAIL TEXT ───────────────────────────

export const SUSPICIOUS_DOMAINS_IN_TEXT = [
  'replit.app', 'sevalla.page', 'versoly.page', 'web.core.windows.net',
  'sites.google.com', 'zya.me', 'iceiy.com', 'icciy.com', 'hstn.me',
  '.sbs', '.xyz', '.me/',
  ...URL_SHORTENERS,
];

export const SUSPICIOUS_DOMAIN_TEXT_WEIGHT = 35;
