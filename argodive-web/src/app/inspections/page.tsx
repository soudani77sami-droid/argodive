'use client';

import { useEffect, useState } from 'react';
import {
  ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getInspectionsList } from '@/app/actions/data';

type Inspection = {
  id: string; title: string; cageId: string; site: string; type: string;
  scheduledDate: string; completedDate: string | null; conductedBy: string; healthScore: number | null; status: string;
};

function formatDate(d: string | null) {
  if (!d) return '';
  return d.slice(0, 10);
}

function inspStatus(s: string) {
  switch (s) {
    case 'COMPLETED': return 'Completed';
    case 'IN_PROGRESS': return 'In Progress';
    case 'SCHEDULED': return 'Scheduled';
    case 'CANCELLED': return 'Cancelled';
    case 'OVERDUE': return 'Overdue';
    default: return s;
  }
}

function inspType(s: string) {
  switch (s) {
    case 'ROUTINE': return 'Routine';
    case 'STRUCTURAL': return 'Structural';
    case 'PRE_HARVEST': return 'Pre-Harvest';
    case 'POST_STORM': return 'Post-Storm';
    case 'EMERGENCY': return 'Emergency';
    case 'ENVIRONMENTAL': return 'Environmental';
    case 'HEALTH': return 'Health';
    case 'MORTALITY': return 'Mortality';
    default: return s;
  }
}

const columns: ColumnDef<Inspection>[] = [
  { accessorKey: 'title', header: 'Title', cell: ({ row }) => <span className="font-medium">{row.getValue('title')}</span> },
  { accessorKey: 'cageId', header: 'Cage' },
  { accessorKey: 'site', header: 'Site' },
  { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge> },
  { accessorKey: 'scheduledDate', header: 'Scheduled' },
  { accessorKey: 'conductedBy', header: 'Inspector' },
  {
    accessorKey: 'healthScore', header: 'Score',
    cell: ({ row }) => {
      const score = row.getValue('healthScore') as number | null;
      if (score === null) return <span className="text-muted-foreground">--</span>;
      return <Badge variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'destructive'}>{score}</Badge>;
    },
  },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ row }) => {
      const s = row.getValue('status') as string;
      return <Badge variant={s === 'Completed' ? 'success' : s === 'In Progress' ? 'info' : 'secondary'}>{s}</Badge>;
    },
  },
];

export default function InspectionsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<Inspection[]>([]);

  useEffect(() => {
    getInspectionsList().then((inspections) => {
      const mapped: Inspection[] = inspections.map((i: any) => ({
        id: i.id,
        title: i.title,
        cageId: i.cage?.cageNumber ?? '',
        site: i.cage?.site?.name ?? '',
        type: inspType(i.inspectionType),
        scheduledDate: formatDate(i.scheduledDate),
        completedDate: i.completedDate ? formatDate(i.completedDate) : null,
        conductedBy: i.conductedBy?.name ?? 'TBD',
        healthScore: i.healthScore,
        status: inspStatus(i.status),
      }));
      setData(mapped);
    });
  }, []);

  const trendData = (() => {
    const completed = data.filter(d => d.status === 'Completed' && d.healthScore != null);
    return completed.length > 0
      ? [{ week: 'All', score: Math.round(completed.reduce((s, d) => s + (d.healthScore ?? 0), 0) / completed.length), count: completed.length }]
      : [];
  })();

  const table = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting, globalFilter },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Inspections</h1>
          <p className="text-muted-foreground">Track cage health and compliance inspections</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-ocean" /> Total</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{data.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-emerald-500" /> Completed</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600">{data.filter(d => d.status === 'Completed').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-amber-500" /> In Progress</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-amber-600">{data.filter(d => d.status === 'In Progress').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Scheduled</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">{data.filter(d => d.status === 'Scheduled').length}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm">Health Score Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--card))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Line type="monotone" dataKey="score" name="Avg Score" stroke="var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">All Inspections</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search inspections..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="h-9 max-w-sm pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
