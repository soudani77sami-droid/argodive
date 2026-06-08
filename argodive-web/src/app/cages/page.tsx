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
import { Search, ArrowUpDown, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Cage = {
  id: string; cageNumber: string; site: string; species: string; diameter: number;
  fishCount: number; biomass: number; doLevel: number; temp: number; status: string; healthScore: number;
};

const data: Cage[] = [
  { id: '1', cageNumber: 'C-001', site: 'North Farm', species: 'Atlantic Salmon', diameter: 25, fishCount: 45000, biomass: 180000, doLevel: 7.8, temp: 14.2, status: 'Active', healthScore: 92 },
  { id: '2', cageNumber: 'C-002', site: 'North Farm', species: 'Atlantic Salmon', diameter: 25, fishCount: 42000, biomass: 168000, doLevel: 7.5, temp: 14.5, status: 'Active', healthScore: 88 },
  { id: '3', cageNumber: 'C-003', site: 'South Bay', species: 'Rainbow Trout', diameter: 20, fishCount: 35000, biomass: 70000, doLevel: 8.1, temp: 13.8, status: 'Active', healthScore: 95 },
  { id: '4', cageNumber: 'C-004', site: 'South Bay', species: 'Sea Bass', diameter: 18, fishCount: 12000, biomass: 18000, doLevel: 7.9, temp: 15.2, status: 'Empty', healthScore: 0 },
  { id: '5', cageNumber: 'C-005', site: 'East Cove', species: 'Tilapia', diameter: 22, fishCount: 28000, biomass: 22400, doLevel: 6.5, temp: 16.1, status: 'Active', healthScore: 78 },
  { id: '6', cageNumber: 'C-006', site: 'North Farm', species: 'Atlantic Salmon', diameter: 30, fishCount: 65000, biomass: 260000, doLevel: 7.2, temp: 14.8, status: 'Harvesting', healthScore: 85 },
  { id: '7', cageNumber: 'C-007', site: 'East Cove', species: 'Yellowtail', diameter: 24, fishCount: 15000, biomass: 48000, doLevel: 6.8, temp: 15.5, status: 'Maintenance', healthScore: 45 },
  { id: '8', cageNumber: 'C-008', site: 'South Bay', species: 'Rainbow Trout', diameter: 20, fishCount: 0, biomass: 0, doLevel: 0, temp: 0, status: 'Fallow', healthScore: 0 },
];

const siteData = [
  { site: 'North Farm', cages: 3, fish: 152000, health: 88 },
  { site: 'South Bay', cages: 2, fish: 47000, health: 95 },
  { site: 'East Cove', cages: 2, fish: 43000, health: 62 },
];

const columns: ColumnDef<Cage>[] = [
  {
    accessorKey: 'cageNumber',
    header: ({ column }) => (
      <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting()}>
        Cage <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue('cageNumber')}</span>,
  },
  { accessorKey: 'site', header: 'Site' },
  { accessorKey: 'species', header: 'Species' },
  {
    accessorKey: 'fishCount',
    header: 'Fish',
    cell: ({ row }) => (row.getValue('fishCount') as number).toLocaleString(),
  },
  {
    accessorKey: 'biomass',
    header: 'Biomass',
    cell: ({ row }) => `${((row.getValue('biomass') as number) / 1000).toFixed(1)}t`,
  },
  {
    accessorKey: 'doLevel',
    header: 'DO (mg/L)',
    cell: ({ row }) => {
      const v = row.getValue('doLevel') as number;
      if (v === 0) return <span className="text-muted-foreground">--</span>;
      return <span className={v < 7 ? 'text-destructive font-medium' : ''}>{v}</span>;
    },
  },
  {
    accessorKey: 'temp',
    header: 'Temp (°C)',
    cell: ({ row }) => {
      const v = row.getValue('temp') as number;
      if (v === 0) return <span className="text-muted-foreground">--</span>;
      return <span>{v}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const v = status === 'Active' ? 'success' : status === 'Empty' || status === 'Fallow' ? 'secondary' : status === 'Harvesting' ? 'warning' : 'destructive';
      return <Badge variant={v}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'healthScore',
    header: 'Health',
    cell: ({ row }) => {
      const score = row.getValue('healthScore') as number;
      if (score === 0) return <span className="text-muted-foreground">--</span>;
      return (
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-destructive'}`} style={{ width: `${score}%` }} />
          </div>
          <span className="text-xs font-medium">{score}</span>
        </div>
      );
    },
  },
];

export default function CagesPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Cages</h1>
        <p className="text-muted-foreground">Monitor all cages across farm sites</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Cages</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{data.filter(c => c.status === 'Active').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Fish</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.reduce((s, c) => s + c.fishCount, 0).toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Avg Health</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">87</div></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm">Sites Overview</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {siteData.map((s) => (
              <div key={s.site} className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-3.5 w-3.5 text-ocean" /> {s.site}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                  <div><p className="font-bold text-lg">{s.cages}</p><p className="text-muted-foreground">Cages</p></div>
                  <div><p className="font-bold text-lg">{(s.fish / 1000).toFixed(0)}K</p><p className="text-muted-foreground">Fish</p></div>
                  <div><p className="font-bold text-lg">{s.health}</p><p className="text-muted-foreground">Health</p></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">All Cages</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search cages..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="h-9 max-w-sm pl-9" />
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
