'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Fish,
  Grid3X3,
  ClipboardCheck,
  AlertTriangle,
  TrendingUp,
  Activity,
  XCircle,
  Info,
  Bell,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  type PieLabelRenderProps,
} from 'recharts';
import { computeNetAlerts } from '@argodive/shared';
import type { NetAlertInput } from '@argodive/shared';

const stats = [
  { title: 'Active Cages', value: '24', change: '+2', icon: Grid3X3, variant: 'info' as const },
  { title: 'Total Fish (M)', value: '3.2', change: '+12%', icon: Fish, variant: 'success' as const },
  { title: 'Inspections This Month', value: '47', change: '+8', icon: ClipboardCheck, variant: 'default' as const },
  { title: 'Active Alerts', value: '3', change: '-1', icon: AlertTriangle, variant: 'warning' as const },
];

const weeklyData = [
  { day: 'Mon', inspections: 4, transfers: 2 },
  { day: 'Tue', inspections: 6, transfers: 3 },
  { day: 'Wed', inspections: 8, transfers: 5 },
  { day: 'Thu', inspections: 5, transfers: 2 },
  { day: 'Fri', inspections: 7, transfers: 4 },
  { day: 'Sat', inspections: 3, transfers: 1 },
  { day: 'Sun', inspections: 2, transfers: 1 },
];

const speciesDist = [
  { name: 'Atlantic Salmon', value: 45 },
  { name: 'Rainbow Trout', value: 25 },
  { name: 'Sea Bass', value: 18 },
  { name: 'Tilapia', value: 12 },
];

const COLORS = ['var(--chart-1))', 'var(--chart-2))', 'var(--chart-3))', 'var(--chart-4))'];

const cageHealth = [
  { name: 'Excellent', value: 40 },
  { name: 'Good', value: 35 },
  { name: 'Fair', value: 18 },
  { name: 'Needs Attention', value: 7 },
];

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

export default function DashboardPage() {
  const alerts = useMemo(() => computeNetAlerts(nets), []);
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Operational overview</p>
        </div>
        {criticalCount > 0 ? (
          <Badge variant="destructive" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            {criticalCount} Critical
          </Badge>
        ) : warningCount > 0 ? (
          <Badge variant="warning" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            {warningCount} Warning
          </Badge>
        ) : (
          <Badge variant="success" className="gap-1">
            All Systems Normal
          </Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.variant === 'warning' ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'}>
                  {stat.change}
                </span>{' '}
                from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--popover))',
                      border: '1px solid var(--border))',
                      borderRadius: 'var(--radius)',
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="inspections" name="Inspections" fill="var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="transfers" name="Transfers" fill="var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Species Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={speciesDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }: PieLabelRenderProps) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {speciesDist.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--popover))',
                      border: '1px solid var(--border))',
                      borderRadius: 'var(--radius)',
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Cage Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cageHealth} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" className="text-xs" tick={{ fontSize: 12 }} width={120} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--popover))',
                      border: '1px solid var(--border))',
                      borderRadius: 'var(--radius)',
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="value" name="Cages" fill="var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-ocean" /> Net Alerts
            </CardTitle>
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
