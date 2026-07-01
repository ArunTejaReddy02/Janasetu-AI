/**
 * clustering.js — Semantic clustering utilities for SetuAI
 * Groups semantically similar submissions into "need clusters".
 * Per PRD FR-5: uses sentence-embedding similarity + same admin_unit + facility_type constraint.
 */

// Mock cluster data
const mockClusters = [
  {
    cluster_id: 'CL-WATER-07-014',
    facility_type: 'water_infrastructure',
    admin_unit_id: 'AU-VZG-WARD-07',
    title: 'Borewell/Pipeline Issues — Ward 7',
    submission_count: 14,
    status: 'verified',
    created_at: '2026-06-28T10:00:00Z',
    representative_summary: 'Multiple reports of non-functional borewells and burst water pipelines in the Ward 7 area near Anganwadi.',
  },
  {
    cluster_id: 'CL-ROAD-09-003',
    facility_type: 'roads',
    admin_unit_id: 'AU-VZG-WARD-09',
    title: 'Road Damage — NH Junction Area',
    submission_count: 9,
    status: 'pending_verification',
    created_at: '2026-06-29T14:00:00Z',
    representative_summary: 'Recurring reports of potholes and road damage near the NH junction and Station Road.',
  },
  {
    cluster_id: 'CL-LIGHT-12-007',
    facility_type: 'lighting',
    admin_unit_id: 'AU-VZG-WARD-12',
    title: 'Street Lighting — Model Town',
    submission_count: 6,
    status: 'pending_verification',
    created_at: '2026-06-30T08:00:00Z',
    representative_summary: 'Multiple flickering and non-functional street lights reported in Model Town residential area.',
  },
  {
    cluster_id: 'CL-DRAIN-09-015',
    facility_type: 'drainage',
    admin_unit_id: 'AU-VZG-WARD-09',
    title: 'Blocked Drainage — Station Road',
    submission_count: 7,
    status: 'verified',
    created_at: '2026-06-30T12:00:00Z',
    representative_summary: 'Drainage blockage near Station Road causing waterlogging during monsoon rains.',
  },
];

// Mock verification queue items
const mockVerificationQueue = [
  {
    id: 'VQ-001',
    cluster_id: 'CL-X92',
    type: 'duplicate_merge',
    confidence: 0.94,
    title: 'Potential Duplicate: Water Leak',
    description: 'Merge report #9821-B with #9700-A in the Sector 47 cluster?',
    actions: ['Merge', 'Reject'],
  },
  {
    id: 'VQ-002',
    cluster_id: 'CL-V11',
    type: 'entity_confirm',
    confidence: 0.81,
    title: 'Confirm Entity: "Hospital"',
    description: 'User mentioned "Clinic next to temple". AI mapped to "Public Health Center". Correct?',
    actions: ['Approve', 'Edit'],
  },
  {
    id: 'VQ-003',
    cluster_id: 'CL-R33',
    type: 'location_verify',
    confidence: 0.67,
    title: 'Verify Location: Ward 5',
    description: 'Submission mentions "near the big banyan tree". Geocoded to Ward 5 centroid. Confirm or pin exact location.',
    actions: ['Confirm', 'Relocate'],
  },
  {
    id: 'VQ-004',
    cluster_id: 'CL-S44',
    type: 'spam_flag',
    confidence: 0.72,
    title: 'Possible Spam Submission',
    description: 'Submission SC-9815 flagged as potential duplicate/spam. Content appears promotional.',
    actions: ['Remove', 'Keep'],
  },
];

// Mock active projects
const mockActiveProjects = [
  { id: 'AP-001', title: 'Monsoon Preparedness 24', report_count: 124, progress: 72, color: 'primary' },
  { id: 'AP-002', title: 'Pothole Mapping Drive', report_count: 89, progress: 45, color: 'secondary' },
  { id: 'AP-003', title: 'School Zone Safety Audit', report_count: 56, progress: 30, color: 'tertiary' },
];

/**
 * Fetch all need clusters.
 */
export async function fetchClusters() {
  return new Promise((resolve) => setTimeout(() => resolve(mockClusters), 200));
}

/**
 * Fetch the verification queue for officer review.
 */
export async function fetchVerificationQueue() {
  return new Promise((resolve) => setTimeout(() => resolve(mockVerificationQueue), 150));
}

/**
 * Fetch active projects with progress.
 */
export async function fetchActiveProjects() {
  return new Promise((resolve) => setTimeout(() => resolve(mockActiveProjects), 100));
}

/**
 * Merge two clusters.
 */
export async function mergeClusters(sourceClusterId, targetClusterId) {
  console.log(`[Clustering] Merging ${sourceClusterId} into ${targetClusterId}`);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 200));
}

/**
 * Process a verification queue action.
 */
export async function processVerificationAction(queueItemId, action) {
  console.log(`[Clustering] Processing ${action} on ${queueItemId}`);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 150));
}

export default {
  fetchClusters,
  fetchVerificationQueue,
  fetchActiveProjects,
  mergeClusters,
  processVerificationAction,
};
