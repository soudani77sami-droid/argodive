'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, Clock } from 'lucide-react';
import { computeNetAlerts } from '@argodive/shared';
import type { NetAlertInput } from '@argodive/shared';

type AlertItem = {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  time: string;
  active: boolean;
};

const nets: NetAlertInput[] = [
  { netNumber: 'N-001', cageId: 'C-001', site: 'North Farm', ageDays: 296, condition: 'Good' },
  { netNumber: 'N-002', cageId: 'C-001', site: 'North Farm', ageDays: 98, condition: 'Excellent' },
  { netNumber: 'N-003', cageId: 'C-002', site: 'North Farm', ageDays: 352, condition: 'Fair' },
  { netNumber: 'N-004', cageId: 'C-003', site: 'South Bay', ageDays: 209, condition: 'Good' },
  { netNumber: 'N-005', cageId: 'C-005', site: 'East Cove', ageDays: 428, condition: 'Damaged' },
  { netNumber: 'N-006', cageId: 'C-006', site: 'North Farm', ageDays: 260, condition: 'Good' },
  { netNumber: 'N-007', cageId: 'C-007', site: 'East Cove', ageDays: 143, condition: 'Excellent' },
  { netNumber: 'N-008', cageId: 'C-003', site: 'South Bay', ageDays: 402, condition: 'Poor' },
];

const staticAlerts: AlertItem[] = [
  {
    id: '1', title: 'Cage C-007 - Critical DO Levels',
    description: 'Dissolved oxygen dropped to 3.2 mg/L. Immediate aeration required.',
    severity: 'critical', source: 'Sensor Network', time: '2 min ago', active: true,
  },
  {
    id: '2', title: 'Net N-005 Structural Damage',
    description: 'Tear detected in net section B3. Estimated 15cm opening.',
    severity: 'critical', source: 'Inspection Report', time: '15 min ago', active: true,
  },
  {
    id: '3', title: 'Mortality Spike - Cage C-002',
    description: 'Mortality rate increased to 4.2% in the last 24 hours.',
    severity: 'warning', source: 'Monitoring System', time: '45 min ago', active: true,
  },
  {
    id: '4', title: 'Scheduled Maintenance Due',
    description: 'Cage C-012 net replacement scheduled for tomorrow.',
    severity: 'info', source: 'Calendar', time: '2 hrs ago', active: true,
  },
  {
    id: '5', title: 'Water Temperature Alert',
    description: 'Surface temperature at North Farm reached 18.5°C.',
    severity: 'warning', source: 'Sensor Network', time: '3 hrs ago', active: true,
  },
  {
    id: '6', title: 'Transfer Complete - C-003 to C-004',
    description: '6,000 Rainbow Trout successfully transferred.',
    severity: 'info', source: 'Transfer Log', time: '5 hrs ago', active: false,
  },
  {
    id: '7', title: 'Low Feed Stock Alert',
    description: 'Feed inventory for Site A below 15% capacity.',
    severity: 'warning', source: 'Inventory', time: '6 hrs ago', active: false,
  },
  {
    id: '8', title: 'Inspection Overdue - Cage C-008',
    description: 'Routine inspection was due 3 days ago.', 
    severity: 'warning', source: 'Schedule', time: '1 day ago', active: false,
  },
];

export default function AlertsPage() {
  const allAlerts = useMemo(() => {
    const netAlerts = computeNetAlerts(nets, staticAlerts as any);
    return netAlerts;
  }, []);

  const activeAlerts = allAlerts.filter(a => a.active);
  const criticalCount = allAlerts.filter(a => a.severity === 'critical' && a.active).length;
  const warningCount = allAlerts.filter(a => a.severity === 'warning' && a.active).length;
  const infoCount = allAlerts.filter(a => a.severity === 'info' && a.active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alert Center</h1>
          <p className="text-muted-foreground">Real-time notifications and system alerts</p>
        </div>
        <Button variant="outline" size="sm"><CheckCircle className="mr-1 h-4 w-4" /> Mark All Read</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-destructive/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Requires immediate action</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{warningCount}</div>
            <p className="text-xs text-muted-foreground">Monitor and address</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Information</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{infoCount}</div>
            <p className="text-xs text-muted-foreground">General notifications</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Active Alerts</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {activeAlerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <CheckCircle className="h-10 w-10 mb-3 text-emerald-500" />
              <p className="text-sm font-medium">No active alerts</p>
              <p className="text-xs">All systems operating normally</p>
            </div>
          )}
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 transition-colors ${
                alert.severity === 'critical'
                  ? 'border-destructive/30 bg-destructive/5'
                  : alert.severity === 'warning'
                    ? 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20'
                    : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {alert.severity === 'critical' ? (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                ) : alert.severity === 'warning' ? (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                ) : (
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    </div>
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : alert.severity === 'warning' ? 'warning' : 'info'}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {alert.time}
                    </span>
                    <span>Source: {alert.source}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Alert History</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {allAlerts.filter(a => !a.active).map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 rounded-lg border p-3 opacity-70">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground line-through">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
              <Badge variant="secondary">Resolved</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
