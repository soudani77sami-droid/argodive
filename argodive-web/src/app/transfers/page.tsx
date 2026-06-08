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
import { Search, ArrowUpDown, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Transfer = {
  id: string; fromCage: string; toCage: string; species: string; fishCount: number;
  reason: string; scheduledDate: string; completedDate: string | null; status: string;
};

const data: Transfer[] = [
  { id: '1', fromCage: 'C-001', toCage: 'C-002', species: 'Atlantic Salmon', fishCount: 5000, reason: 'Splitting', scheduledDate: '2026-06-01', completedDate: '2026-06-01', status: 'Completed' },
  { id: '2', fromCage: 'C-003', toCage: 'C-004', species: 'Rainbow Trout', fishCount: 3000, reason: 'Grading', scheduledDate: '2026-06-03', completedDate: '2026-06-03', status: 'Completed' },
  { id: '3', fromCage: 'C-005', toCage: 'C-006', species: 'Tilapia', fishCount: 8000, reason: 'Stocking', scheduledDate: '2026-06-05', completedDate: null, status: 'In Progress' },
  { id: '4', fromCage: 'C-001', toCage: 'C-008', species: 'Atlantic Salmon', fishCount: 4000, reason: 'Medical Treatment', scheduledDate: '2026-06-08', completedDate: null, status: 'Planned' },
  { id: '5', fromCage: 'C-007', toCage: 'C-002', species: 'Yellowtail', fishCount: 2000, reason: 'Relocation', scheduledDate: '2026-06-10', completedDate: null, status: 'Planned' },
  { id: '6', fromCage: 'C-003', toCage: 'C-005', species: 'Rainbow Trout', fishCount: 6000, reason: 'Harvest', scheduledDate: '2026-05-28', completedDate: '2026-05-28', status: 'Completed' },
];

const reasonData = [
  { reason: 'Grading', count: 1 }, { reason: 'Splitting', count: 1 }, { reason: 'Stocking', count: 1 },
  { reason: 'Medical', count: 1 }, { reason: 'Relocation', count: 1 }, { reason: 'Harvest', count: 1 },
];

const columns: ColumnDef<Transfer>[] = [
  {
    accessorKey: 'fromCage', header: ({ column }) => (<Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting()}>From <ArrowUpDown className="ml-1 h-3 w-3" /></Button>),
    cell: ({ row }) => <Badge variant="outline" className="bg-ocean/5">{row.getValue('fromCage')}</Badge>,
  },
  { id: 'arrow', header: '', cell: () => <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" /> },
  { accessorKey: 'toCage', header: 'To', cell: ({ row }) => <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/20">{row.getValue('toCage')}</Badge> },
  { accessorKey: 'species', header: 'Species' },
  { accessorKey: 'fishCount', header: 'Fish Count', cell: ({ row }) => (row.getValue('fishCount') as number).toLocaleString() },
  { accessorKey: 'reason', header: 'Reason', cell: ({ row }) => <Badge variant="secondary">{row.getValue('reason')}</Badge> },
  { accessorKey: 'scheduledDate', header: 'Date' },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ row }) => {
      const s = row.getValue('status') as string;
      return <Badge variant={s === 'Completed' ? 'success' : s === 'In Progress' ? 'info' : 'secondary'}>{s}</Badge>;
    },
  },
];

export default function TransfersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), onSortingChange: setSorting, state: { sorting, globalFilter } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Fish Transfers</h1>
        <p className="text-muted-foreground">Track stock movements between cages</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Transfers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Completed</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{data.filter(t => t.status === 'Completed').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Planned / Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-ocean">{data.filter(t => t.status !== 'Completed').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Fish Moved</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.reduce((s, t) => s + t.fishCount, 0).toLocaleString()}</div></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm">By Reason</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reasonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="reason" type="category" tick={{ fontSize: 11 }} width={70} />
                  <Bar dataKey="count" fill="var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Transfer Log</CardTitle>
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
    </div>
  );
}
