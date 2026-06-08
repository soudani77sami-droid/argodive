'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { ClipboardCheck, Wrench, RefreshCw, ArrowLeftRight } from 'lucide-react';
import { getDashboardStats } from '@/app/actions/data';

type MonthRow = {
  month: string;
  [key: string]: string | number;
};

export default function StatisticsPage() {
  const [inspectionsPerMonth, setInspectionsPerMonth] = useState<MonthRow[]>([]);
  const [repairsPerMonth] = useState<MonthRow[]>([]);
  const [netReplacements] = useState<MonthRow[]>([]);
  const [fishTransfers, setFishTransfers] = useState<MonthRow[]>([]);

  useEffect(() => {
    getDashboardStats().then((result) => {
      const inspByType: Record<string, Record<string, number>> = {};
      for (const i of result.inspections) {
        const month = new Date(i.scheduledDate).toLocaleString('default', { month: 'short' });
        if (!inspByType[month]) inspByType[month] = {};
        inspByType[month][i.inspectionType] = (inspByType[month][i.inspectionType] ?? 0) + 1;
      }
      setInspectionsPerMonth(
        Object.entries(inspByType).map(([month, types]) => ({
          month,
          Routine: types.ROUTINE ?? 0,
          Structural: types.STRUCTURAL ?? 0,
          Health: types.HEALTH ?? 0,
          Emergency: types.EMERGENCY ?? 0,
        })),
      );

      const transferByReason: Record<string, Record<string, number>> = {};
      for (const t of result.transfers) {
        const month = new Date(t.scheduledDate).toLocaleString('default', { month: 'short' });
        if (!transferByReason[month]) transferByReason[month] = {};
        transferByReason[month][t.reason] = (transferByReason[month][t.reason] ?? 0) + 1;
      }
      setFishTransfers(
        Object.entries(transferByReason).map(([month, reasons]) => ({
          month,
          Grading: reasons.GRADING ?? 0,
          Stocking: reasons.STOCKING ?? 0,
          Splitting: reasons.SPLITTING ?? 0,
          Medical: (reasons.MEDICAL_TREATMENT ?? 0) + (reasons.MORTALITY_REMOVAL ?? 0),
        })),
      );
    });
  }, []);

  const totalInspections = inspectionsPerMonth.reduce((s, m) =>
    s + (m.Routine as number) + (m.Structural as number) + (m.Health as number) + (m.Emergency as number), 0);
  const totalTransfers = fishTransfers.reduce((s, m) =>
    s + (m.Grading as number) + (m.Stocking as number) + (m.Splitting as number) + (m.Medical as number), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Statistics</h1>
        <p className="text-muted-foreground">Operational metrics and trends</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-ocean" /> Total Inspections</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalInspections}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ArrowLeftRight className="h-4 w-4 text-ocean" /> Total Transfers</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalTransfers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Wrench className="h-4 w-4 text-ocean" /> Total Species</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{inspectionsPerMonth.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><RefreshCw className="h-4 w-4 text-ocean" /> Data Periods</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{inspectionsPerMonth.length}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Inspections by Type</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inspectionsPerMonth.length > 0 ? inspectionsPerMonth : [{ month: 'No data', Routine: 0, Structural: 0, Health: 0, Emergency: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--card))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Legend />
                  <Bar dataKey="Routine" name="Routine" fill="var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Structural" name="Structural" fill="var(--chart-2))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Health" name="Health" fill="var(--chart-3))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Emergency" name="Emergency" fill="var(--chart-4))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Fish Transfers by Reason</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fishTransfers.length > 0 ? fishTransfers : [{ month: 'No data', Grading: 0, Stocking: 0, Splitting: 0, Medical: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--card))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Legend />
                  <Bar dataKey="Grading" name="Grading" fill="var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Stocking" name="Stocking" fill="var(--chart-2))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Splitting" name="Splitting" fill="var(--chart-3))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Medical" name="Medical" fill="var(--chart-4))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
