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
import { Search, ArrowUpDown, MapPin } from 'lucide-react';
import { getDashboardStats } from '@/app/actions/data';

type Cage = {
  id: string; cageNumber: string; site: string; species: string; diameter: number;
  fishCount: number; biomass: number; doLevel: number; temp: number; status: string; healthScore: number;
};

function cageStatus(s: string) {
  switch (s) {
    case 'ACTIVE': return 'Active';
    case 'EMPTY': return 'Empty';
    case 'STOCKING': return 'Stocking';
    case 'HARVESTING': return 'Harvesting';
    case 'FALLOW': return 'Fallow';
    case 'MAINTENANCE': return 'Maintenance';
    default: return s;
  }
}

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
  const [data, setData] = useState<Cage[]>([]);
  const [siteData, setSiteData] = useState<{ site: string; cages: number; fish: number; health: number }[]>([]);

  useEffect(() => {
    getDashboardStats().then((result) => {
      const mapped: Cage[] = result.cages.map((c: any) => ({
        id: c.id,
        cageNumber: c.cageNumber,
        site: c.site?.name ?? '',
        species: c.species?.name ?? 'None',
        diameter: c.diameter ?? 0,
        fishCount: c.currentFishCount ?? 0,
        biomass: c.currentBiomass ?? 0,
        doLevel: 0,
        temp: 0,
        status: cageStatus(c.status),
        healthScore: 0,
      }));

      const inspMap = new Map<string, number>();
      for (const insp of result.inspections) {
        const key = insp.cageId;
        if (!inspMap.has(key) && insp.healthScore != null) {
          inspMap.set(key, insp.healthScore);
        }
      }
      for (const c of mapped) {
        c.healthScore = inspMap.get(c.id) ?? 0;
      }

      setData(mapped);

      const siteMap = new Map<string, { cages: number; fish: number; healthScores: number[] }>();
      for (const c of result.cages) {
        const name = c.site?.name ?? 'Unknown';
        if (!siteMap.has(name)) {
          siteMap.set(name, { cages: 0, fish: 0, healthScores: [] });
        }
        const s = siteMap.get(name)!;
        s.cages++;
        s.fish += c.currentFishCount ?? 0;
      }
      setSiteData(
        Array.from(siteMap.entries()).map(([site, info]) => ({
          site,
          cages: info.cages,
          fish: info.fish,
          health: info.healthScores.length > 0 ? Math.round(info.healthScores.reduce((a, b) => a + b, 0) / info.healthScores.length) : 0,
        })),
      );
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

  const totalFish = data.reduce((s, c) => s + c.fishCount, 0);
  const activeCount = data.filter(c => c.status === 'Active').length;
  const avgHealth = data.filter(c => c.healthScore > 0).reduce((s, c) => s + c.healthScore, 0) / Math.max(data.filter(c => c.healthScore > 0).length, 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Cages</h1>
        <p className="text-muted-foreground">Monitor all cages across farm sites</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Cages</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{activeCount}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Fish</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalFish.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Avg Health</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round(avgHealth)}</div></CardContent></Card>
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
