'use client';

import { useState } from 'react';
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

type Inspection = {
  id: string; title: string; cageId: string; site: string; type: string;
  scheduledDate: string; completedDate: string | null; conductedBy: string; healthScore: number | null; status: string;
};

const data: Inspection[] = [
  { id: '1', title: 'Monthly Routine Check', cageId: 'C-001', site: 'North Farm', type: 'Routine', scheduledDate: '2026-06-01', completedDate: '2026-06-01', conductedBy: 'Sarah M.', healthScore: 92, status: 'Completed' },
  { id: '2', title: 'Post-Storm Assessment', cageId: 'C-002', site: 'North Farm', type: 'Post-Storm', scheduledDate: '2026-06-02', completedDate: '2026-06-02', conductedBy: 'John D.', healthScore: 78, status: 'Completed' },
  { id: '3', title: 'Structural Integrity Check', cageId: 'C-003', site: 'South Bay', type: 'Structural', scheduledDate: '2026-06-05', completedDate: '2026-06-06', conductedBy: 'Mike T.', healthScore: 95, status: 'Completed' },
  { id: '4', title: 'Pre-Harvest Inspection', cageId: 'C-006', site: 'North Farm', type: 'Pre-Harvest', scheduledDate: '2026-06-10', completedDate: null, conductedBy: 'Sarah M.', healthScore: null, status: 'In Progress' },
  { id: '5', title: 'Environmental Monitoring', cageId: 'C-005', site: 'East Cove', type: 'Environmental', scheduledDate: '2026-06-12', completedDate: null, conductedBy: 'TBD', healthScore: null, status: 'Scheduled' },
  { id: '6', title: 'Health & Mortality Check', cageId: 'C-007', site: 'East Cove', type: 'Health', scheduledDate: '2026-06-08', completedDate: '2026-06-08', conductedBy: 'John D.', healthScore: 45, status: 'Completed' },
  { id: '7', title: 'Routine Biofouling Check', cageId: 'C-004', site: 'South Bay', type: 'Routine', scheduledDate: '2026-06-15', completedDate: null, conductedBy: 'TBD', healthScore: null, status: 'Scheduled' },
  { id: '8', title: 'Emergency Net Inspection', cageId: 'C-005', site: 'East Cove', type: 'Emergency', scheduledDate: '2026-06-03', completedDate: '2026-06-03', conductedBy: 'Mike T.', healthScore: 65, status: 'Completed' },
];

const trendData = [
  { week: 'W1', score: 82, count: 4 },
  { week: 'W2', score: 78, count: 3 },
  { week: 'W3', score: 85, count: 5 },
  { week: 'W4', score: 80, count: 4 },
];

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

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), onSortingChange: setSorting, state: { sorting, globalFilter } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Inspections</h1>
        <p className="text-muted-foreground">Schedule, track, and review cage inspections</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total This Month</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Completed</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{data.filter(i => i.status === 'Completed').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">In Progress</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-ocean">{data.filter(i => i.status === 'In Progress').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Avg Health Score</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">76</div></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm">Health Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: 'var(--card))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Line type="monotone" dataKey="score" name="Avg Score" stroke="var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
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
                <Input placeholder="Search..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="h-9 max-w-sm pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>{table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>{hg.headers.map((h) => (<TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>))}</TableHeader>
              <TableBody>{table.getRowModel().rows.map((row) => (<TableRow key={row.id}>{row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}</TableRow>))}</TableBody>
            </Table>
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</p>
              <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button><Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Critical Findings</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-medium">Cage C-007 health score critically low (45)</p>
              <p className="text-sm text-muted-foreground mt-1">Immediate intervention required. Elevated mortality detected during last inspection.</p>
            </div>
            <Button size="sm" variant="destructive" className="ml-auto shrink-0">View Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
