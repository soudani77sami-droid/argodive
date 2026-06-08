'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { ClipboardCheck, Wrench, RefreshCw, ArrowLeftRight } from 'lucide-react';

// ---------- Data ----------

const inspectionsPerMonth = [
  { month: 'Jan', Routine: 5, Structural: 2, Health: 3, Emergency: 1 },
  { month: 'Feb', Routine: 4, Structural: 1, Health: 2, Emergency: 0 },
  { month: 'Mar', Routine: 6, Structural: 3, Health: 4, Emergency: 2 },
  { month: 'Apr', Routine: 4, Structural: 2, Health: 3, Emergency: 1 },
  { month: 'May', Routine: 7, Structural: 1, Health: 5, Emergency: 0 },
  { month: 'Jun', Routine: 5, Structural: 2, Health: 3, Emergency: 1 },
];

const repairsPerMonth = [
  { month: 'Jan', repairs: 3, scheduled: 2, emergency: 1 },
  { month: 'Feb', repairs: 5, scheduled: 3, emergency: 2 },
  { month: 'Mar', repairs: 2, scheduled: 2, emergency: 0 },
  { month: 'Apr', repairs: 6, scheduled: 4, emergency: 2 },
  { month: 'May', repairs: 4, scheduled: 3, emergency: 1 },
  { month: 'Jun', repairs: 3, scheduled: 2, emergency: 1 },
];

const netReplacements = [
  { month: 'Jan', replacements: 1, totalNets: 12 },
  { month: 'Feb', replacements: 2, totalNets: 12 },
  { month: 'Mar', replacements: 0, totalNets: 13 },
  { month: 'Apr', replacements: 3, totalNets: 13 },
  { month: 'May', replacements: 1, totalNets: 14 },
  { month: 'Jun', replacements: 2, totalNets: 14 },
];

const fishTransfers = [
  { month: 'Jan', Grading: 2, Stocking: 3, Splitting: 1, Medical: 0 },
  { month: 'Feb', Grading: 1, Stocking: 2, Splitting: 2, Medical: 1 },
  { month: 'Mar', Grading: 3, Stocking: 4, Splitting: 0, Medical: 0 },
  { month: 'Apr', Grading: 1, Stocking: 2, Splitting: 3, Medical: 1 },
  { month: 'May', Grading: 4, Stocking: 3, Splitting: 2, Medical: 0 },
  { month: 'Jun', Grading: 2, Stocking: 5, Splitting: 1, Medical: 1 },
];

// ---------- Derived stats ----------

const totalInspections = inspectionsPerMonth.reduce((s, m) => s + m.Routine + m.Structural + m.Health + m.Emergency, 0);
const totalRepairs = repairsPerMonth.reduce((s, m) => s + m.repairs, 0);
const totalReplacements = netReplacements.reduce((s, m) => s + m.replacements, 0);
const totalTransfers = fishTransfers.reduce((s, m) => s + m.Grading + m.Stocking + m.Splitting + m.Medical, 0);

export default function StatisticsPage() {
  const chartTooltipStyle = {
    contentStyle: {
      background: 'var(--card))',
      border: '1px solid var(--border))',
      borderRadius: 'var(--radius)',
      fontSize: 13,
    } as React.CSSProperties,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Statistics</h1>
        <p className="text-muted-foreground">Operational metrics and trends</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inspections</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInspections}</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRepairs}</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Replacements</CardTitle>
            <RefreshCw className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReplacements}</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transfers</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransfers}</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 1. Inspections per month */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-ocean" /> Inspections per Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inspectionsPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    iconType="rect"
                    iconSize={10}
                  />
                  <Bar dataKey="Routine" fill="var(--chart-1))" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="Structural" fill="var(--chart-2))" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="Health" fill="var(--chart-3))" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="Emergency" fill="var(--destructive))" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 2. Repairs per month */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-500" /> Repairs per Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repairsPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    iconType="rect"
                    iconSize={10}
                  />
                  <Bar dataKey="scheduled" name="Scheduled" fill="var(--chart-1))" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="emergency" name="Emergency" fill="var(--destructive))" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. Net replacements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-destructive" /> Net Replacements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={netReplacements}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    iconType="line"
                    iconSize={12}
                  />
                  <Line
                    type="monotone"
                    dataKey="replacements"
                    name="Replacements"
                    stroke="var(--destructive))"
                    strokeWidth={2}
                    dot={{ r: 5, fill: 'var(--destructive))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalNets"
                    name="Total Nets"
                    stroke="var(--chart-2))"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 4. Fish transfers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-emerald-500" /> Fish Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fishTransfers}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    iconType="rect"
                    iconSize={10}
                  />
                  <Bar dataKey="Grading" fill="var(--chart-1))" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="Stocking" fill="var(--chart-2))" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="Splitting" fill="var(--chart-3))" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="Medical" fill="var(--chart-4))" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-ocean/20 bg-ocean/5 p-4">
              <p className="text-sm font-medium text-ocean-dark">Busiest Inspection Month</p>
              <p className="mt-1 text-2xl font-bold">May</p>
              <p className="text-xs text-muted-foreground">13 inspections total</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Highest Repair Month</p>
              <p className="mt-1 text-2xl font-bold">April</p>
              <p className="text-xs text-muted-foreground">6 repairs performed</p>
            </div>
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">Most Net Replacements</p>
              <p className="mt-1 text-2xl font-bold">April</p>
              <p className="text-xs text-muted-foreground">3 nets replaced</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Most Transfers</p>
              <p className="mt-1 text-2xl font-bold">June</p>
              <p className="text-xs text-muted-foreground">9 transfers recorded</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
