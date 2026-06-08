'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getDashboardStats } from '@/app/actions/data';

const reports = [
  { title: 'Monthly Production Report - May 2026', date: 'Jun 1, 2026', type: 'PDF', size: '2.4 MB' },
  { title: 'Mortality Summary - Q2 2026', date: 'May 31, 2026', type: 'PDF', size: '1.1 MB' },
  { title: 'Cage Health Report - Weekly', date: 'May 28, 2026', type: 'XLSX', size: '4.2 MB' },
  { title: 'Feed Conversion Analysis', date: 'May 25, 2026', type: 'PDF', size: '3.0 MB' },
  { title: 'Environmental Data Log - May', date: 'May 24, 2026', type: 'CSV', size: '0.8 MB' },
  { title: 'Water Quality Trends Report', date: 'May 20, 2026', type: 'PDF', size: '5.6 MB' },
];

export default function ReportsPage() {
  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jan', harvest: 0, mortality: 0, transfers: 0 },
    { month: 'Jun', harvest: 0, mortality: 0, transfers: 0 },
  ]);
  const [growthData, setGrowthData] = useState<{ week: string; salmon: number; trout: number }[]>([]);

  useEffect(() => {
    getDashboardStats().then((result) => {
      const currMonth = new Date().toLocaleString('default', { month: 'short' });
      const totalFish = result.cages.reduce((s: number, c: any) => s + (c.currentFishCount ?? 0), 0);
      const totalBiomass = result.cages.reduce((s: number, c: any) => s + (c.currentBiomass ?? 0), 0);
      const transferCount = result.transfers.length;

      setMonthlyData([
        { month: currMonth, harvest: Math.round(totalBiomass / 100), mortality: 0, transfers: transferCount },
      ]);

      const salmonSpecies = result.species.find((s: any) => s.code === 'SAL');
      const troutSpecies = result.species.find((s: any) => s.code === 'RBT');
      if (salmonSpecies || troutSpecies) {
        setGrowthData([
          { week: 'Current', salmon: salmonSpecies?.growthRate ?? 0, trout: troutSpecies?.growthRate ?? 0 },
        ]);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Reports</h1>
          <p className="text-muted-foreground">Operational reports and data exports</p>
        </div>
        <Button size="sm"><Download className="mr-1 h-4 w-4" /> Generate Report</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-ocean" /> Production Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--card))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Bar dataKey="harvest" name="Harvest (t)" fill="var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="transfers" name="Transfers" fill="var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-ocean" /> Growth Rate by Species</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--card))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Line type="monotone" dataKey="salmon" name="Salmon" stroke="var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="trout" name="Trout" stroke="var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-ocean" /> Generated Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {reports.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ocean/10 text-ocean">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.date} &middot; {r.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{r.type}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
