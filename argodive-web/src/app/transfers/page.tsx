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
import { Search, ArrowUpDown, ArrowRight } from 'lucide-react';
import { getTransfersList } from '@/app/actions/data';

type Transfer = {
  id: string; fromCage: string; toCage: string; species: string; fishCount: number;
  reason: string; scheduledDate: string; completedDate: string | null; status: string;
};

function transferStatus(s: string) {
  switch (s) {
    case 'COMPLETED': return 'Completed';
    case 'IN_PROGRESS': return 'In Progress';
    case 'PLANNED': return 'Planned';
    case 'CANCELLED': return 'Cancelled';
    default: return s;
  }
}

function transferReason(s: string) {
  switch (s) {
    case 'GRADING': return 'Grading';
    case 'STOCKING': return 'Stocking';
    case 'RESTOCKING': return 'Restocking';
    case 'HARVEST': return 'Harvest';
    case 'SPLITTING': return 'Splitting';
    case 'MEDICAL_TREATMENT': return 'Medical Treatment';
    case 'MORTALITY_REMOVAL': return 'Mortality Removal';
    case 'RELOCATION': return 'Relocation';
    default: return s;
  }
}

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
  const [data, setData] = useState<Transfer[]>([]);

  useEffect(() => {
    getTransfersList().then((transfers) => {
      const mapped: Transfer[] = transfers.map((t: any) => ({
        id: t.id,
        fromCage: t.fromCage?.cageNumber ?? '',
        toCage: t.toCage?.cageNumber ?? '',
        species: t.species?.name ?? '',
        fishCount: t.fishCount,
        reason: transferReason(t.reason),
        scheduledDate: t.scheduledDate?.slice(0, 10) ?? '',
        completedDate: t.completedDate?.slice(0, 10) ?? null,
        status: transferStatus(t.status),
      }));
      setData(mapped);
    });
  }, []);

  const table = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting, globalFilter },
  });

  const reasonData = Object.entries(
    data.reduce((acc, t) => {
      acc[t.reason] = (acc[t.reason] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  ).map(([reason, count]) => ({ reason, count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Fish Transfers</h1>
        <p className="text-muted-foreground">Track fish movements between cages</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Transfers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Completed</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{data.filter(d => d.status === 'Completed').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">In Progress / Planned</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-amber-600">{data.filter(d => d.status === 'In Progress' || d.status === 'Planned').length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">All Transfers</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search transfers..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="h-9 max-w-sm pl-9" />
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
  );
}
