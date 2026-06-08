'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  AreaChart,
  Area,
} from 'recharts';
import { Download, FileText, TrendingUp } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', harvest: 120, mortality: 8, transfers: 15 },
  { month: 'Feb', harvest: 95, mortality: 12, transfers: 10 },
  { month: 'Mar', harvest: 140, mortality: 6, transfers: 18 },
  { month: 'Apr', harvest: 160, mortality: 10, transfers: 22 },
  { month: 'May', harvest: 180, mortality: 7, transfers: 20 },
  { month: 'Jun', harvest: 200, mortality: 9, transfers: 25 },
];

const growthData = [
  { week: 'W1', salmon: 0.8, trout: 1.0, bass: 0.6 },
  { week: 'W2', salmon: 1.0, trout: 1.2, bass: 0.7 },
  { week: 'W3', salmon: 1.1, trout: 1.3, bass: 0.8 },
  { week: 'W4', salmon: 1.3, trout: 1.5, bass: 0.9 },
  { week: 'W5', salmon: 1.4, trout: 1.6, bass: 1.0 },
  { week: 'W6', salmon: 1.6, trout: 1.8, bass: 1.1 },
];

const reports = [
  { title: 'Monthly Production Report', date: 'Jun 1, 2026', type: 'PDF', size: '2.4 MB' },
  { title: 'Mortality Summary - Q2 2026', date: 'May 31, 2026', type: 'PDF', size: '1.1 MB' },
  { title: 'Cage Health Report', date: 'May 28, 2026', type: 'XLSX', size: '4.2 MB' },
  { title: 'Feed Conversion Analysis', date: 'May 25, 2026', type: 'PDF', size: '3.0 MB' },
  { title: 'Transfer Log - May 2026', date: 'May 24, 2026', type: 'CSV', size: '0.8 MB' },
  { title: 'Water Quality Trends', date: 'May 20, 2026', type: 'PDF', size: '5.6 MB' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports Center</h1>
          <p className="text-muted-foreground">Analytics, trends, and generated reports</p>
        </div>
        <Button size="sm"><Download className="mr-1 h-4 w-4" /> Generate Report</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Production Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--popover))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Bar dataKey="harvest" name="Harvest (tons)" fill="var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="transfers" name="Transfers" fill="var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Growth Rate by Species</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--popover))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Line type="monotone" dataKey="salmon" name="Salmon" stroke="var(--chart-1))" strokeWidth={2} />
                  <Line type="monotone" dataKey="trout" name="Trout" stroke="var(--chart-2))" strokeWidth={2} />
                  <Line type="monotone" dataKey="bass" name="Bass" stroke="var(--chart-3))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Mortality Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--popover))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Area type="monotone" dataKey="mortality" name="Mortality" stroke="var(--destructive))" fill="var(--destructive))" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Generated Reports</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reports.map((r) => (
                <div key={r.title} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                  <FileText className="h-8 w-8 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.date} &middot; {r.size}</p>
                  </div>
                  <Badge variant="secondary">{r.type}</Badge>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
