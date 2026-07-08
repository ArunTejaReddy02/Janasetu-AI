/**
 * api.js — Centralized API client for SetuAI
 * Currently returns mock data for hackathon MVP.
 * Swap BASE_URL and remove mocks to connect to FastAPI backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// ─── Mock Data ───

const mockSubmissions = [
  {
    submission_id: 'SC-9821-B',
    channel: 'whatsapp',
    status: 'received',
    created_at: '2026-07-01T09:12:00Z',
    time_ago: '2m ago',
    raw_content: {
      type: 'text',
      transcript: 'पाइप फट गया है, पानी बहुत ज्यादा बर्बाद हो रहा है और सड़क पर गड्ढा हो गया है। कृपया जल्दी भेजें किसी को।',
      detected_language: 'hi',
    },
    extracted: {
      facility_type: 'water_infrastructure',
      urgency: 'high',
      summary: 'Water pipeline burst in Sector 47',
      location_text: 'Sector 47, Gate 2',
      cluster_id: 'INFRA_WATER_22',
    },
    location: {
      lat: 17.6868,
      lng: 83.2185,
      admin_unit_id: 'AU-VZG-WARD-07',
    },
  },
  {
    submission_id: 'SC-9820-A',
    channel: 'web',
    status: 'processed',
    created_at: '2026-07-01T08:59:00Z',
    time_ago: '15m ago',
    raw_content: {
      type: 'text',
      transcript: 'Street light in front of house no 45 is flickering since 2 days. It causes safety issues at night for elders.',
      detected_language: 'en',
    },
    extracted: {
      facility_type: 'lighting',
      urgency: 'normal',
      summary: 'Street Light Maintenance Request',
      location_text: 'Model Town',
      cluster_id: null,
    },
    location: {
      lat: 17.7231,
      lng: 83.2016,
      admin_unit_id: 'AU-VZG-WARD-12',
    },
  },
  {
    submission_id: 'SC-9819-V',
    channel: 'voice',
    status: 'processed',
    created_at: '2026-07-01T08:42:00Z',
    time_ago: '22m ago',
    raw_content: {
      type: 'audio',
      transcript: 'पार्कच्या बाहेर कचरा साचला आहे, दुर्गंधी येत आहे. लोक चालताना त्रास होतोय. कृपया सफाई कामगार पाठवा.',
      detected_language: 'mr',
    },
    extracted: {
      facility_type: 'sanitation',
      urgency: 'normal',
      summary: 'Garbage accumulation near city park',
      location_text: 'Central Park South',
      cluster_id: null,
    },
    location: {
      lat: 17.7100,
      lng: 83.2300,
      admin_unit_id: 'AU-VZG-WARD-03',
    },
  },
  {
    submission_id: 'SC-9818-C',
    channel: 'whatsapp',
    status: 'received',
    created_at: '2026-07-01T08:15:00Z',
    time_ago: '45m ago',
    raw_content: {
      type: 'text',
      transcript: 'शाळेसमोरचा रस्ता खराब झाला आहे, मुलांना शाळेत जायला अडचण होत आहे. दुरुस्ती करा.',
      detected_language: 'mr',
    },
    extracted: {
      facility_type: 'roads',
      urgency: 'high',
      summary: 'Damaged road near school causing access issues',
      location_text: 'Near Govt. Primary School, Ward 5',
      cluster_id: 'INFRA_ROAD_08',
    },
    location: {
      lat: 17.6950,
      lng: 83.2400,
      admin_unit_id: 'AU-VZG-WARD-05',
    },
  },
  {
    submission_id: 'SC-9817-D',
    channel: 'web',
    status: 'processed',
    created_at: '2026-07-01T07:30:00Z',
    time_ago: '1h ago',
    raw_content: {
      type: 'text',
      transcript: 'The drainage system near Station Road is completely blocked. During rains, water enters houses. Please clear the drains.',
      detected_language: 'en',
    },
    extracted: {
      facility_type: 'drainage',
      urgency: 'high',
      summary: 'Blocked drainage system causing waterlogging',
      location_text: 'Station Road, Ward 9',
      cluster_id: 'INFRA_DRAIN_15',
    },
    location: {
      lat: 17.7050,
      lng: 83.2150,
      admin_unit_id: 'AU-VZG-WARD-09',
    },
  },
  {
    submission_id: 'SC-4821',
    channel: 'whatsapp',
    status: 'processed',
    created_at: '2026-06-30T11:00:00Z',
    time_ago: '1d ago',
    raw_content: {
      type: 'audio',
      transcript: 'Anganwadi daggara borewell pani ledu, rendu vaaralugaa',
      detected_language: 'te',
    },
    extracted: {
      facility_type: 'water_infrastructure',
      urgency: 'high',
      summary: 'Non-functional borewell near Anganwadi, ongoing 2 weeks.',
      location_text: 'near Anganwadi, Ward 7',
      cluster_id: 'CL-WATER-07-014',
    },
    location: { lat: 17.6868, lng: 83.2185, admin_unit_id: 'AU-VZG-WARD-07' },
  },
  {
    submission_id: 'SC-4790',
    channel: 'whatsapp',
    status: 'processed',
    created_at: '2026-06-29T16:00:00Z',
    time_ago: '2d ago',
    raw_content: {
      type: 'text',
      transcript: 'Borewell near temple has no water since monsoon started. Children walk far for water.',
      detected_language: 'en',
    },
    extracted: {
      facility_type: 'water_infrastructure',
      urgency: 'high',
      summary: 'Dry borewell affecting families near temple',
      location_text: 'Ward 7 temple area',
      cluster_id: 'CL-WATER-07-014',
    },
    location: { lat: 17.6875, lng: 83.2190, admin_unit_id: 'AU-VZG-WARD-07' },
  },
  {
    submission_id: 'SC-5012',
    channel: 'web',
    status: 'processed',
    created_at: '2026-06-28T09:00:00Z',
    time_ago: '3d ago',
    raw_content: {
      type: 'text',
      transcript: 'NH junction road is full of potholes. Accidents happening daily.',
      detected_language: 'en',
    },
    extracted: {
      facility_type: 'roads',
      urgency: 'high',
      summary: 'Severe potholes at NH junction',
      location_text: 'NH Junction, Ward 9',
      cluster_id: 'CL-ROAD-09-003',
    },
    location: { lat: 17.7060, lng: 83.2160, admin_unit_id: 'AU-VZG-WARD-09' },
  },
  {
    submission_id: 'SC-5030',
    channel: 'voice',
    status: 'processed',
    created_at: '2026-06-27T14:00:00Z',
    time_ago: '4d ago',
    raw_content: {
      type: 'audio',
      transcript: 'रस्ता बहुत खराब है, स्कूल के बच्चे गिर जाते हैं',
      detected_language: 'hi',
    },
    extracted: {
      facility_type: 'roads',
      urgency: 'high',
      summary: 'Damaged road near school — safety hazard',
      location_text: 'Near primary school, NH area',
      cluster_id: 'CL-ROAD-09-003',
    },
    location: { lat: 17.7045, lng: 83.2145, admin_unit_id: 'AU-VZG-WARD-09' },
  },
  {
    submission_id: 'SC-6100',
    channel: 'web',
    status: 'processed',
    created_at: '2026-06-25T10:00:00Z',
    time_ago: '6d ago',
    raw_content: {
      type: 'text',
      transcript: 'Youth in our ward need vocational training. No ITI or skill centre nearby.',
      detected_language: 'en',
    },
    extracted: {
      facility_type: 'education',
      urgency: 'normal',
      summary: 'Need for vocational training centre in Ward 9',
      location_text: 'Ward 9 residential block',
      cluster_id: 'CL-EDU-09-001',
    },
    location: { lat: 17.7055, lng: 83.2155, admin_unit_id: 'AU-VZG-WARD-09' },
  },
];

const mockRecommendations = [
  {
    project_id: 'PR-2026-0091',
    title: 'Borewell Repair — Ward 7 (near Anganwadi)',
    cluster_ids: ['CL-WATER-07-014', 'CL-WATER-07-019'],
    admin_unit_id: 'AU-VZG-WARD-07',
    final_score: 78.4,
    score_breakdown: {
      citizen_demand: { raw: 73, weight: 0.30, weighted: 21.9 },
      demographic_need: { raw: 65, weight: 0.20, weighted: 13.0 },
      infrastructure_gap: { raw: 80, weight: 0.25, weighted: 20.0 },
      feasibility: { raw: 70, weight: 0.15, weighted: 10.5 },
      plan_alignment: { raw: 90, weight: 0.10, weighted: 9.0 },
    },
    evidence: { submission_count: 14, sample_submission_ids: ['SC-4821', 'SC-4790'] },
    status: 'under_review',
  },
  {
    project_id: 'PR-2026-0102',
    title: 'Road Repair — NH Junction',
    cluster_ids: ['CL-ROAD-09-003'],
    admin_unit_id: 'AU-VZG-WARD-09',
    final_score: 71.2,
    score_breakdown: {
      citizen_demand: { raw: 60, weight: 0.30, weighted: 18.0 },
      demographic_need: { raw: 70, weight: 0.20, weighted: 14.0 },
      infrastructure_gap: { raw: 75, weight: 0.25, weighted: 18.75 },
      feasibility: { raw: 65, weight: 0.15, weighted: 9.75 },
      plan_alignment: { raw: 85, weight: 0.10, weighted: 8.5 },
    },
    evidence: { submission_count: 9, sample_submission_ids: ['SC-5012', 'SC-5030'] },
    status: 'new',
  },
  {
    project_id: 'PR-2026-0115',
    title: 'Street Lighting Upgrade — Model Town',
    cluster_ids: ['CL-LIGHT-12-007'],
    admin_unit_id: 'AU-VZG-WARD-12',
    final_score: 62.8,
    score_breakdown: {
      citizen_demand: { raw: 50, weight: 0.30, weighted: 15.0 },
      demographic_need: { raw: 60, weight: 0.20, weighted: 12.0 },
      infrastructure_gap: { raw: 68, weight: 0.25, weighted: 17.0 },
      feasibility: { raw: 80, weight: 0.15, weighted: 12.0 },
      plan_alignment: { raw: 68, weight: 0.10, weighted: 6.8 },
    },
    evidence: { submission_count: 6, sample_submission_ids: ['SC-9820'] },
    status: 'new',
  },
  {
    project_id: 'PR-2026-0120',
    title: 'Vocational Training Centre — Ward 9',
    cluster_ids: ['CL-EDU-09-001'],
    admin_unit_id: 'AU-VZG-WARD-09',
    final_score: 48.25,
    score_breakdown: {
      citizen_demand: { raw: 40, weight: 0.30, weighted: 12.0 },
      demographic_need: { raw: 55, weight: 0.20, weighted: 11.0 },
      infrastructure_gap: { raw: 50, weight: 0.25, weighted: 12.5 },
      feasibility: { raw: 45, weight: 0.15, weighted: 6.75 },
      plan_alignment: { raw: 60, weight: 0.10, weighted: 6.0 },
    },
    evidence: { submission_count: 4, sample_submission_ids: ['SC-6100'] },
    status: 'new',
  },
  {
    project_id: 'PR-2026-0125',
    title: 'Primary School Expansion — Ward 5',
    cluster_ids: ['CL-EDU-05-002'],
    admin_unit_id: 'AU-VZG-WARD-05',
    final_score: 67.5,
    score_breakdown: {
      citizen_demand: { raw: 55, weight: 0.30, weighted: 16.5 },
      demographic_need: { raw: 78, weight: 0.20, weighted: 15.6 },
      infrastructure_gap: { raw: 72, weight: 0.25, weighted: 18.0 },
      feasibility: { raw: 55, weight: 0.15, weighted: 8.25 },
      plan_alignment: { raw: 92, weight: 0.10, weighted: 9.2 },
    },
    evidence: { submission_count: 8, sample_submission_ids: ['SC-9818-C'] },
    status: 'new',
  },
  {
    project_id: 'PR-2026-0130',
    title: 'Drainage Clearance — Station Road',
    cluster_ids: ['CL-DRAIN-09-015'],
    admin_unit_id: 'AU-VZG-WARD-09',
    final_score: 65.3,
    score_breakdown: {
      citizen_demand: { raw: 58, weight: 0.30, weighted: 17.4 },
      demographic_need: { raw: 62, weight: 0.20, weighted: 12.4 },
      infrastructure_gap: { raw: 70, weight: 0.25, weighted: 17.5 },
      feasibility: { raw: 75, weight: 0.15, weighted: 11.25 },
      plan_alignment: { raw: 67, weight: 0.10, weighted: 6.7 },
    },
    evidence: { submission_count: 7, sample_submission_ids: ['SC-9817-D'] },
    status: 'new',
  },
  {
    project_id: 'PR-2026-0135',
    title: 'Sanitation Drive — Central Park',
    cluster_ids: ['CL-SAN-03-001'],
    admin_unit_id: 'AU-VZG-WARD-03',
    final_score: 58.9,
    score_breakdown: {
      citizen_demand: { raw: 48, weight: 0.30, weighted: 14.4 },
      demographic_need: { raw: 52, weight: 0.20, weighted: 10.4 },
      infrastructure_gap: { raw: 58, weight: 0.25, weighted: 14.5 },
      feasibility: { raw: 82, weight: 0.15, weighted: 12.3 },
      plan_alignment: { raw: 73, weight: 0.10, weighted: 7.3 },
    },
    evidence: { submission_count: 5, sample_submission_ids: ['SC-9819-V'] },
    status: 'new',
  },
  {
    project_id: 'PR-2026-0140',
    title: 'Community Health Centre — Ward 3',
    cluster_ids: ['CL-HEALTH-03-002'],
    admin_unit_id: 'AU-VZG-WARD-03',
    final_score: 56.2,
    score_breakdown: {
      citizen_demand: { raw: 42, weight: 0.30, weighted: 12.6 },
      demographic_need: { raw: 74, weight: 0.20, weighted: 14.8 },
      infrastructure_gap: { raw: 68, weight: 0.25, weighted: 17.0 },
      feasibility: { raw: 50, weight: 0.15, weighted: 7.5 },
      plan_alignment: { raw: 44, weight: 0.10, weighted: 4.4 },
    },
    evidence: { submission_count: 3, sample_submission_ids: ['SC-9819-V'] },
    status: 'new',
  },
  {
    project_id: 'PR-2026-0145',
    title: 'Hand Pump Installation — Ward 7',
    cluster_ids: ['CL-WATER-07-019'],
    admin_unit_id: 'AU-VZG-WARD-07',
    final_score: 54.8,
    score_breakdown: {
      citizen_demand: { raw: 45, weight: 0.30, weighted: 13.5 },
      demographic_need: { raw: 58, weight: 0.20, weighted: 11.6 },
      infrastructure_gap: { raw: 62, weight: 0.25, weighted: 15.5 },
      feasibility: { raw: 68, weight: 0.15, weighted: 10.2 },
      plan_alignment: { raw: 40, weight: 0.10, weighted: 4.0 },
    },
    evidence: { submission_count: 5, sample_submission_ids: ['SC-4821', 'SC-4790'] },
    status: 'new',
  },
  {
    project_id: 'PR-2026-0150',
    title: 'Bus Shelter Construction — Model Town',
    cluster_ids: ['CL-TRANS-12-001'],
    admin_unit_id: 'AU-VZG-WARD-12',
    final_score: 51.4,
    score_breakdown: {
      citizen_demand: { raw: 38, weight: 0.30, weighted: 11.4 },
      demographic_need: { raw: 48, weight: 0.20, weighted: 9.6 },
      infrastructure_gap: { raw: 55, weight: 0.25, weighted: 13.75 },
      feasibility: { raw: 72, weight: 0.15, weighted: 10.8 },
      plan_alignment: { raw: 58, weight: 0.10, weighted: 5.8 },
    },
    evidence: { submission_count: 3, sample_submission_ids: ['SC-9820-A'] },
    status: 'new',
  },
  {
    project_id: 'PR-2026-0155',
    title: 'Anganwadi Upgrade — Ward 7',
    cluster_ids: ['CL-EDU-07-003'],
    admin_unit_id: 'AU-VZG-WARD-07',
    final_score: 49.6,
    score_breakdown: {
      citizen_demand: { raw: 35, weight: 0.30, weighted: 10.5 },
      demographic_need: { raw: 68, weight: 0.20, weighted: 13.6 },
      infrastructure_gap: { raw: 52, weight: 0.25, weighted: 13.0 },
      feasibility: { raw: 58, weight: 0.15, weighted: 8.7 },
      plan_alignment: { raw: 38, weight: 0.10, weighted: 3.8 },
    },
    evidence: { submission_count: 2, sample_submission_ids: ['SC-4821'] },
    status: 'new',
  },
  {
    project_id: 'PR-2026-0160',
    title: 'Footbridge — Ward 5 School Zone',
    cluster_ids: ['CL-ROAD-05-004'],
    admin_unit_id: 'AU-VZG-WARD-05',
    final_score: 46.1,
    score_breakdown: {
      citizen_demand: { raw: 32, weight: 0.30, weighted: 9.6 },
      demographic_need: { raw: 50, weight: 0.20, weighted: 10.0 },
      infrastructure_gap: { raw: 48, weight: 0.25, weighted: 12.0 },
      feasibility: { raw: 42, weight: 0.15, weighted: 6.3 },
      plan_alignment: { raw: 82, weight: 0.10, weighted: 8.2 },
    },
    evidence: { submission_count: 2, sample_submission_ids: ['SC-9818-C'] },
    status: 'new',
  },
];

/** Gap scores per admin unit (FR-7 basic MVP — water sector) */
export const mockGapScores = [
  { admin_unit_id: 'AU-VZG-WARD-07', sector: 'water', gap_score: 80, label: 'High water access gap' },
  { admin_unit_id: 'AU-VZG-WARD-05', sector: 'education', gap_score: 72, label: 'School distance deficit' },
  { admin_unit_id: 'AU-VZG-WARD-09', sector: 'water', gap_score: 65, label: 'Moderate water gap' },
  { admin_unit_id: 'AU-VZG-WARD-03', sector: 'sanitation', gap_score: 58, label: 'Sanitation coverage gap' },
  { admin_unit_id: 'AU-VZG-WARD-12', sector: 'education', gap_score: 45, label: 'Low education gap' },
];

const mockHotspots = {
  layer_type: 'hotspot_kde',
  facility_type: 'all',
  generated_at: '2026-07-01T10:00:00Z',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.2185, 17.6868] }, properties: { density: 0.87, submission_count: 14, label: 'Ward 7 — Water' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.2016, 17.7231] }, properties: { density: 0.45, submission_count: 6, label: 'Model Town — Lighting' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.2300, 17.7100] }, properties: { density: 0.32, submission_count: 4, label: 'Central Park — Sanitation' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.2400, 17.6950] }, properties: { density: 0.65, submission_count: 9, label: 'Ward 5 — Roads' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.2150, 17.7050] }, properties: { density: 0.58, submission_count: 7, label: 'Station Road — Drainage' } },
  ],
};

const mockStats = {
  total_today: 1482,
  total_trend: '+12%',
  unprocessed: 42,
  languages: { Hindi: 45, Telugu: 23, Marathi: 21, English: 11 },
  channels_active: 12,
};

// ─── API Functions ───

// ─── Cache and Helpers ───
let cachedSubmissions = [];
let cachedRecommendations = [];

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapSubmission(s) {
  return {
    submission_id: s.id,
    channel: (s.channel ?? 'web').toLowerCase(),
    status: (s.status ?? 'pending').toLowerCase(),
    created_at: s.submittedAt ?? s.createdAt,
    time_ago: formatTimeAgo(s.submittedAt ?? s.createdAt),
    raw_content: {
      type: s.audioUrl ? 'audio' : 'text',
      transcript: s.translatedText || s.rawText || '',
      detected_language: (s.language ?? 'en').toLowerCase(),
    },
    extracted: {
      facility_type: (s.category ?? 'other').toLowerCase(),
      urgency: s.entities?.urgency || (s.urgencyScore > 0.7 ? 'high' : 'normal'),
      summary: s.entities?.summary || s.rawText || '',
      location_text: s.locationName || s.entities?.location_text || '',
      cluster_id: s.clusterId || null,
    },
    location: {
      lat: s.latitude,
      lng: s.longitude,
      admin_unit_id: s.adminUnitId,
    },
  };
}

function mapRecommendation(r) {
  const metadata = r.metadata || {};
  const rawScores = metadata.rawScores || {
    citizen_demand: Math.round((r.urgencyScore ?? 0.7) * 100),
    demographic_need: Math.round((r.impactScore ?? 0.6) * 100),
    infrastructure_gap: Math.round((r.costBenefitScore ?? 0.8) * 100),
    feasibility: Math.round((r.feasibilityScore ?? 0.7) * 100),
    plan_alignment: metadata.plan_alignment ?? 75,
  };

  const score_breakdown = {};
  const DEFAULT_WEIGHTS = {
    citizen_demand: 0.30,
    demographic_need: 0.20,
    infrastructure_gap: 0.25,
    feasibility: 0.15,
    plan_alignment: 0.10,
  };

  for (const [key, raw] of Object.entries(rawScores)) {
    const weight = DEFAULT_WEIGHTS[key] ?? 0.2;
    score_breakdown[key] = {
      raw,
      weight,
      weighted: Number((raw * weight).toFixed(2)),
    };
  }

  const final_score = Object.values(score_breakdown).reduce((sum, item) => sum + item.weighted, 0);

  return {
    project_id: r.id,
    title: r.title,
    admin_unit_id: r.hotspot?.adminUnitId ?? 'AU-VZG-WARD-07',
    status: r.project?.status?.toLowerCase() || 'new',
    evidence: {
      submission_count: r.hotspot?.submissionCount ?? 1,
      sample_submission_ids: r.hotspot?.submissions?.map((s) => s.id) ?? [],
    },
    score_breakdown,
    final_score: Math.round(final_score * 100) / 100,
  };
}

// ─── API Functions ───

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }
  return res;
}

export async function fetchSubmissions() {
  const res = await fetchWithAuth(`${BASE_URL}/submissions`);
  if (!res.ok) throw new Error('Failed to fetch submissions');
  const json = await res.json();
  const rawData = Array.isArray(json) ? json : (json.data || []);
  cachedSubmissions = rawData.map(mapSubmission);
  return cachedSubmissions;
}

export async function submitReport(data) {
  const res = await fetchWithAuth(`${BASE_URL}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Submission failed');
  const json = await res.json();
  return {
    submission_id: json.id || json.submission_id,
    status: json.status,
    reference_message: 'Thank you, your report has been recorded.',
  };
}

export async function fetchRecommendationsBase(constituencyId = 'CST-VZG-01') {
  const res = await fetchWithAuth(`${BASE_URL}/recommendations`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  const json = await res.json();
  const rawData = Array.isArray(json) ? json : (json.data || []);
  cachedRecommendations = rawData.map(mapRecommendation);
  return cachedRecommendations;
}

export async function fetchRecommendations(constituencyId = 'CST-VZG-01') {
  return fetchRecommendationsBase(constituencyId);
}

export function getProjectById(projectId) {
  return cachedRecommendations.find((p) => p.project_id === projectId) ?? null;
}

export function getSubmissionsForProject(projectId) {
  const project = getProjectById(projectId);
  if (!project) return [];
  const ids = new Set(project.evidence.sample_submission_ids);
  const clusterIds = new Set(project.cluster_ids);
  return cachedSubmissions.filter(
    (s) => ids.has(s.submission_id) || (s.extracted.cluster_id && clusterIds.has(s.extracted.cluster_id))
  );
}

export async function fetchHotspots(constituencyId = 'CST-VZG-01', facilityType = 'all', dateRange = 'all') {
  const res = await fetchWithAuth(`${BASE_URL}/hotspots`);
  if (!res.ok) throw new Error('Failed to fetch hotspots');
  const hotspots = await res.json();
  const rawData = Array.isArray(hotspots) ? hotspots : (hotspots.data || []);

  const features = rawData.map((h) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [h.longitude ?? 83.22, h.latitude ?? 17.705],
    },
    properties: {
      density: (h.priorityScore ?? 0) / 100,
      submission_count: h.submissionCount ?? 0,
      label: `${h.title} — ${h.category}`,
    },
  }));

  let filteredFeatures = features;
  if (facilityType !== 'all') {
    filteredFeatures = features.filter((f) =>
      f.properties.label?.toLowerCase().includes(facilityType.replace('_', ' ').split(' ')[0])
    );
  }

  return {
    layer_type: 'hotspot_kde',
    facility_type: facilityType,
    generated_at: new Date().toISOString(),
    features: filteredFeatures,
  };
}

export async function fetchGapScores() {
  return new Promise((resolve) => setTimeout(() => resolve(mockGapScores), 100));
}

export async function fetchStats() {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/analytics/dashboard`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Dashboard stats fetch failed, falling back to mock:', err);
  }
  return new Promise((resolve) => setTimeout(() => resolve(mockStats), 150));
}

export async function fetchRankingWeights() {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/settings/ranking-weights`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch ranking weights, using local fallback:', err);
  }
  return null;
}

export async function updateRankingWeights(weights) {
  const res = await fetchWithAuth(`${BASE_URL}/settings/ranking-weights`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(weights),
  });
  if (!res.ok) throw new Error('Failed to update weights on backend');
  return await res.json();
}

export default {
  fetchSubmissions,
  submitReport,
  fetchRecommendations,
  fetchHotspots,
  fetchStats,
  fetchRankingWeights,
  updateRankingWeights,
};
