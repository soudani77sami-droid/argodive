export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  time: string;
  active: boolean;
};

export type NetAlertInput = {
  netNumber: string;
  cageId: string;
  site?: string;
  ageDays: number;
  condition: string;
};

function daysAgo(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

export function computeNetAlerts(nets: NetAlertInput[], existingAlerts?: Alert[]): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date().toISOString().split('T')[0];

  for (const net of nets) {
    if (net.ageDays > 365) {
      alerts.push({
        id: `net-age-red-${net.netNumber}`,
        title: `Net ${net.netNumber} - Over 365 Days Old`,
        description: `Net on ${net.cageId} has been in service for ${net.ageDays} days. Immediate replacement required.`,
        severity: 'critical',
        source: 'Net Monitoring',
        time: daysAgo(now),
        active: true,
      });
    } else if (net.ageDays > 180) {
      alerts.push({
        id: `net-age-yellow-${net.netNumber}`,
        title: `Net ${net.netNumber} - Over 180 Days Old`,
        description: `Net on ${net.cageId} is ${net.ageDays} days old. Schedule inspection and plan replacement.`,
        severity: 'warning',
        source: 'Net Monitoring',
        time: daysAgo(now),
        active: true,
      });
    }

    const needsReplace = ['Replace', 'Damaged', 'Poor'].includes(net.condition);
    if (needsReplace) {
      alerts.push({
        id: `net-condition-${net.netNumber}`,
        title: `Net ${net.netNumber} - Condition: ${net.condition}`,
        description: `Net on ${net.cageId} needs replacement due to "${net.condition}" condition.`,
        severity: 'critical',
        source: 'Inspection Report',
        time: daysAgo(now),
        active: true,
      });
    }
  }

  // Merge with existing alerts (keeping non-net alerts)
  if (existingAlerts) {
    const existingNonNet = existingAlerts.filter(
      (a) => !a.id.startsWith('net-') && a.active,
    );
    return [...alerts, ...existingNonNet];
  }

  return alerts;
}
