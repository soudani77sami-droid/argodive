'use client';

import { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Waves, Grid3X3, ClipboardCheck, ArrowLeftRight, TrendingUp, Thermometer,
  AlertTriangle, XCircle, Info, Bell,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { computeNetAlerts } from '@argodive/shared';
import type { NetAlertInput } from '@argodive/shared';
import { getDashboardStats } from '@/app/actions/data';

const weeklyOps = [
  { day: 'Mon', inspections: 3, transfers: 1, dives: 2 },
  { day: 'Tue', inspections: 5, transfers: 2, dives: 4 },
  { day: 'Wed', inspections: 4, transfers: 3, dives: 3 },
  { day: 'Thu', inspections: 6, transfers: 1, dives: 5 },
  { day: 'Fri', inspections: 4, transfers: 4, dives: 2 },
  { day: 'Sat', inspections: 2, transfers: 1, dives: 1 },
  { day: 'Sun', inspections: 1, transfers: 0, dives: 0 },
];

const envData = [
  { day: 'Mon', temp: 14.2, do: 7.8, salinity: 32.1 },
  { day: 'Tue', temp: 14.5, do: 7.5, salinity: 32.4 },
  { day: 'Wed', temp: 14.8, do: 7.2, salinity: 32.0 },
  { day: 'Thu', temp: 15.1, do: 7.6, salinity: 31.8 },
  { day: 'Fri', temp: 14.6, do: 7.9, salinity: 32.2 },
  { day: 'Sat', temp: 14.3, do: 8.1, salinity: 32.3 },
  { day: 'Sun', temp: 14.0, do: 7.7, salinity: 32.5 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { title: 'Active Cages', value: '0', change: '', icon: Grid3X3, color: 'text-ocean' },
    { title: 'Fish Population', value: '0', change: '', icon: Waves, color: 'text-cyan-500' },
    { title: 'Inspections This Week', value: '0', change: '', icon: ClipboardCheck, color: 'text-emerald-500' },
    { title: 'Active Transfers', value: '0', change: '', icon: ArrowLeftRight, color: 'text-amber-500' },
  ]);
  const [recentActivity, setRecentActivity] = useState<{ action: string; site: string; time: string; person: string }[]>([]);
  const [netAlertsInputs, setNetAlertsInputs] = useState<NetAlertInput[]>([]);

  useEffect(() => {
    getDashboardStats().then((result) => {
      const { cages, inspections, transfers, netsData, stats } = result;

      setStats([
        { title: 'Active Cages', value: String(stats.activeCages), change: '', icon: Grid3X3, color: 'text-ocean' },
        { title: 'Fish Population', value: (stats.totalFish / 1000).toFixed(1) + 'K', change: '', icon: Waves, color: 'text-cyan-500' },
        { title: 'Inspections This Week', value: String(stats.inspectionsThisWeek), change: '', icon: ClipboardCheck, color: 'text-emerald-500' },
        { title: 'Active Transfers', value: String(stats.activeTransfers), change: '', icon: ArrowLeftRight, color: 'text-amber-500' },
      ]);

      const activity: { action: string; site: string; time: string; person: string }[] = [];
      for (const insp of inspections.slice(0, 3)) {
        activity.push({
          action: `Inspection: ${insp.title}`,
          site: insp.cage?.cageNumber ?? '',
          time: new Date(insp.scheduledDate).toLocaleDateString(),
          person: insp.conductedBy?.name ?? 'TBD',
        });
      }
      for (const t of transfers.slice(0, 2)) {
        activity.push({
          action: `Fish Transfer: ${t.fromCage?.cageNumber ?? ''} → ${t.toCage?.cageNumber ?? ''}`,
          site: '',
          time: new Date(t.scheduledDate).toLocaleDateString(),
          person: t.performedBy?.name ?? 'Planned',
        });
      }
      setRecentActivity(activity);

      const netInputs: NetAlertInput[] = netsData.map((n: any) => ({
        netNumber: n.netNumber,
        cageId: n.cage?.cageNumber ?? '',
        site: '',
        ageDays: n.installationDate ? Math.floor((Date.now() - new Date(n.installationDate).getTime()) / 86400000) : 0,
        condition: n.condition,
      }));
      setNetAlertsInputs(netInputs);
    });
  }, []);

  const alerts = useMemo(() => computeNetAlerts(netAlertsInputs), [netAlertsInputs]);
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Dashboard</h1>
          <p className="text-muted-foreground">Real-time operational overview</p>
        </div>
        {criticalCount > 0 ? (
          <Badge variant="destructive" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            {criticalCount} Critical Alert{criticalCount !== 1 ? 's' : ''}
          </Badge>
        ) : warningCount > 0 ? (
          <Badge variant="warning" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            {warningCount} Warning{warningCount !== 1 ? 's' : ''}
          </Badge>
        ) : (
          <Badge variant="success" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Normal
          </Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className={`text-xs ${s.change.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>{s.change || 'Real-time data'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-ocean" /> Weekly Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyOps}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--card))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Bar dataKey="inspections" name="Inspections" fill="var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="transfers" name="Transfers" fill="var(--chart-2))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="dives" name="Dives" fill="var(--chart-4))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-ocean" /> Environmental Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={envData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--card))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Line type="monotone" dataKey="temp" name="Temp (°C)" stroke="var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="do" name="DO (mg/L)" stroke="var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="salinity" name="Salinity (ppt)" stroke="var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              )}
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-ocean shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.site} &middot; {a.time} &middot; {a.person}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-ocean" /> Net Alerts
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-ocean" asChild>
              <a href="/inspections">View All</a>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                <Info className="h-8 w-8 mb-2" />
                <p className="text-sm">No net alerts</p>
              </div>
            )}
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-3 ${
                  alert.severity === 'critical'
                    ? 'border-destructive/30 bg-destructive/5'
                    : 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20'
                }`}
              >
                <div className="flex items-start gap-2">
                  {alert.severity === 'critical' ? (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-tight">{alert.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{alert.description}</p>
                  </div>
                </div>
              </div>
            ))}
            {alerts.length > 5 && (
              <p className="text-xs text-center text-muted-foreground">
                +{alerts.length - 5} more alert{alerts.length - 5 !== 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
