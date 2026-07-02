// ─── Application Constants ────────────────────────────────────

export const APP_CONSTANTS = {
  APP_NAME: 'JanaSetu-AI',
  VERSION: '1.0.0',
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ─── Role Hierarchy ───────────────────────────────────────────

export const ROLE_HIERARCHY = {
  SUPER_ADMIN: 6,
  ADMIN: 5,
  ANALYST: 4,
  WARD_OFFICER: 3,
  FIELD_AGENT: 2,
  CITIZEN: 1,
} as const;

// ─── Supported Languages ──────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  { code: 'ENGLISH', name: 'English', iso: 'en' },
  { code: 'HINDI', name: 'हिन्दी', iso: 'hi' },
  { code: 'TELUGU', name: 'తెలుగు', iso: 'te' },
  { code: 'KANNADA', name: 'ಕನ್ನಡ', iso: 'kn' },
  { code: 'TAMIL', name: 'தமிழ்', iso: 'ta' },
  { code: 'MARATHI', name: 'मराठी', iso: 'mr' },
  { code: 'BENGALI', name: 'বাংলা', iso: 'bn' },
  { code: 'GUJARATI', name: 'ગુજરાતી', iso: 'gu' },
  { code: 'PUNJABI', name: 'ਪੰਜਾਬੀ', iso: 'pa' },
  { code: 'MALAYALAM', name: 'മലയാളം', iso: 'ml' },
  { code: 'ODIA', name: 'ଓଡ଼ିଆ', iso: 'or' },
  { code: 'URDU', name: 'اردو', iso: 'ur' },
] as const;

// ─── Scoring Weights (defaults — overridden by Settings) ──────

export const DEFAULT_SCORING_WEIGHTS = {
  URGENCY: 0.35,
  IMPACT: 0.30,
  FEASIBILITY: 0.20,
  COST_BENEFIT: 0.15,
} as const;

// ─── Categories ───────────────────────────────────────────────

export const ISSUE_CATEGORIES = [
  'INFRASTRUCTURE',
  'WATER_SANITATION',
  'ELECTRICITY',
  'HEALTHCARE',
  'EDUCATION',
  'ROADS',
  'DRAINAGE',
  'WASTE_MANAGEMENT',
  'PUBLIC_SAFETY',
  'GREEN_SPACES',
  'HOUSING',
  'TRANSPORTATION',
  'EMPLOYMENT',
  'OTHER',
] as const;
