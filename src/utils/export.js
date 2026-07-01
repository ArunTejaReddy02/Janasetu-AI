/**
 * Export ranked recommendations as CSV (FR-9).
 */
export function exportRecommendationsCsv(recommendations, filename = 'setuai-ranked-projects.csv') {
  if (!recommendations?.length) return;

  const headers = [
    'Rank',
    'Project ID',
    'Title',
    'Admin Unit',
    'Final Score',
    'Status',
    'Submission Count',
    'Citizen Demand (weighted)',
    'Demographic Need (weighted)',
    'Infrastructure Gap (weighted)',
    'Feasibility (weighted)',
    'Plan Alignment (weighted)',
  ];

  const rows = recommendations.map((rec, index) => [
    index + 1,
    rec.project_id,
    rec.title,
    rec.admin_unit_id,
    rec.final_score,
    rec.status,
    rec.evidence.submission_count,
    rec.score_breakdown.citizen_demand.weighted.toFixed(2),
    rec.score_breakdown.demographic_need.weighted.toFixed(2),
    rec.score_breakdown.infrastructure_gap.weighted.toFixed(2),
    rec.score_breakdown.feasibility.weighted.toFixed(2),
    rec.score_breakdown.plan_alignment.weighted.toFixed(2),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Simple PDF export via print-friendly window (MVP — no extra deps).
 */
export function exportRecommendationsPdf(recommendations, weights) {
  const win = window.open('', '_blank');
  if (!win) return;

  const rows = recommendations
    .map(
      (rec, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${rec.title}</td>
        <td>${rec.final_score}</td>
        <td>${rec.evidence.submission_count}</td>
        <td>${rec.admin_unit_id}</td>
        <td>${rec.status.replace('_', ' ')}</td>
      </tr>`
    )
    .join('');

  const weightRows = Object.entries(weights)
    .map(([k, w]) => `<li>${k.replace(/_/g, ' ')}: ${(w * 100).toFixed(0)}%</li>`)
    .join('');

  win.document.write(`
    <!DOCTYPE html>
    <html><head><title>SetuAI — Ranked Projects Brief</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 24px; color: #1c1b1b; }
      h1 { font-size: 20px; } table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
      th { background: #f0edec; }
      .meta { font-size: 11px; color: #666; margin-bottom: 16px; }
    </style></head><body>
    <h1>SetuAI — Ranked Development Projects</h1>
    <p class="meta">Generated ${new Date().toLocaleString()} · Constituency CST-VZG-01</p>
    <h2>Weight Configuration</h2><ul>${weightRows}</ul>
    <h2>Ranked List</h2>
    <table>
      <thead><tr><th>Rank</th><th>Project</th><th>Score</th><th>Submissions</th><th>Admin Unit</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <script>window.onload = () => { window.print(); }</script>
    </body></html>
  `);
  win.document.close();
}
