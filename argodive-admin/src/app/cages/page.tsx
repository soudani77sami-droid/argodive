'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, ArrowUpDown, Pencil, Trash2, TriangleAlert, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CrudDialog, type FieldConfig } from '@/components/crud/crud-dialog';
import { ConfirmDeleteDialog } from '@/components/crud/confirm-delete';
import { listCages, listSites, createCage, updateCage, deleteCage } from '@/app/actions/cages';

const CAGE_STATUSES = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Empty', value: 'EMPTY' },
  { label: 'Stocking', value: 'STOCKING' },
  { label: 'Harvesting', value: 'HARVESTING' },
  { label: 'Fallow', value: 'FALLOW' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
  { label: 'Decommissioned', value: 'DECOMMISSIONED' },
];

const CAGE_SHAPES = [
  { label: 'Circular', value: 'CIRCULAR' },
  { label: 'Square', value: 'SQUARE' },
  { label: 'Octagonal', value: 'OCTAGONAL' },
  { label: 'Rectangular', value: 'RECTANGULAR' },
  { label: 'Other', value: 'OTHER' },
];

const cageFormFields: FieldConfig[] = [
  { name: 'cageNumber', label: 'Cage Number', type: 'text', required: true, placeholder: 'e.g. C-001' },
  { name: 'name', label: 'Name', type: 'text', placeholder: 'e.g. North Alpha' },
  { name: 'siteId', label: 'Site ID', type: 'text', required: true, placeholder: 'Site ID from database' },
  { name: 'speciesId', label: 'Species ID', type: 'text', placeholder: 'Species ID from database' },
  { name: 'shape', label: 'Shape', type: 'select', options: CAGE_SHAPES },
  { name: 'diameter', label: 'Diameter (m)', type: 'number', placeholder: 'e.g. 25' },
  { name: 'depth', label: 'Depth (m)', type: 'number', placeholder: 'e.g. 15' },
  { name: 'volume', label: 'Volume (m³)', type: 'number', placeholder: 'e.g. 1200' },
  { name: 'maxCapacity', label: 'Max Capacity (fish)', type: 'number', placeholder: 'e.g. 60000' },
  { name: 'status', label: 'Status', type: 'select', options: CAGE_STATUSES },
  { name: 'installationDate', label: 'Installation Date', type: 'date' },
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Optional notes' },
];

type CageRecord = {
  id: string;
  cageNumber: string;
  name: string | null;
  siteId: string;
  speciesId: string | null;
  shape: string;
  depth: number | null;
  diameter: number | null;
  volume: number | null;
  maxCapacity: number | null;
  currentFishCount: number | null;
  currentBiomass: number | null;
  status: string;
  installationDate: string | null;
  notes: string | null;
  site?: { name: string };
  species?: { name: string } | null;
};

export default function CagesPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<CageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<CageRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<CageRecord | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await listCages();
    if (result.success) setData(result.data as CageRecord[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = useCallback(async (values: Record<string, string>) => {
    const result = await createCage({
      cageNumber: values.cageNumber,
      name: values.name || undefined,
      siteId: values.siteId,
      speciesId: values.speciesId || undefined,
      shape: values.shape,
      diameter: values.diameter ? Number(values.diameter) : undefined,
      depth: values.depth ? Number(values.depth) : undefined,
      volume: values.volume ? Number(values.volume) : undefined,
      maxCapacity: values.maxCapacity ? Number(values.maxCapacity) : undefined,
      status: values.status,
      installationDate: values.installationDate || undefined,
      notes: values.notes || undefined,
    });
    if (!result.success) return result.error || 'Failed to create';
    await fetchData();
  }, [fetchData]);

  const handleUpdate = useCallback(async (values: Record<string, string>) => {
    if (!editItem) return;
    const result = await updateCage(editItem.id, {
      cageNumber: values.cageNumber,
      name: values.name || undefined,
      siteId: values.siteId,
      speciesId: values.speciesId || undefined,
      shape: values.shape,
      diameter: values.diameter ? Number(values.diameter) : undefined,
      depth: values.depth ? Number(values.depth) : undefined,
      volume: values.volume ? Number(values.volume) : undefined,
      maxCapacity: values.maxCapacity ? Number(values.maxCapacity) : undefined,
      status: values.status,
      installationDate: values.installationDate || undefined,
      notes: values.notes || undefined,
    });
    if (!result.success) return result.error || 'Failed to update';
    await fetchData();
  }, [editItem, fetchData]);

  const handleDelete = useCallback(async () => {
    if (!deleteItem) return;
    await deleteCage(deleteItem.id);
    setDeleteItem(null);
    await fetchData();
  }, [deleteItem, fetchData]);

  const activeCages = data.filter((c) => c.status === 'ACTIVE');
  const totalFish = data.reduce((s, c) => s + (c.currentFishCount || 0), 0);

  const healthData = [
    { range: '90-100', count: data.filter((c) => c.currentFishCount && c.currentFishCount > 0).length },
  ];

  const columns: ColumnDef<CageRecord>[] = useMemo(() => [
    {
      accessorKey: 'cageNumber',
      header: ({ column }) => (
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting()}>
          Cage <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
    },
    { accessorKey: 'name', header: 'Name', cell: ({ row }) => row.getValue('name') || '—' },
    {
      id: 'site',
      header: 'Site',
      cell: ({ row }) => (row.original as any).site?.name || row.original.siteId,
    },
    {
      id: 'species',
      header: 'Species',
      cell: ({ row }) => (row.original as any).species?.name || '—',
    },
    { accessorKey: 'diameter', header: 'Dia (m)', cell: ({ row }) => row.getValue('diameter') ? `${row.getValue('diameter')}m` : '—' },
    { accessorKey: 'volume', header: 'Volume (m³)', cell: ({ row }) => row.getValue('volume')?.toLocaleString() || '—' },
    {
      accessorKey: 'currentFishCount',
      header: 'Fish Count',
      cell: ({ row }) => row.getValue('currentFishCount') ? (row.getValue('currentFishCount') as number).toLocaleString() : '0',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variant: Record<string, 'success' | 'secondary' | 'warning' | 'destructive'> = {
          ACTIVE: 'success', EMPTY: 'secondary', STOCKING: 'warning',
          HARVESTING: 'warning', FALLOW: 'secondary', MAINTENANCE: 'destructive',
          DECOMMISSIONED: 'destructive',
        };
        return <Badge variant={variant[status] || 'secondary'}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditItem(row.original); setDialogOpen(true); }}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteItem(row.original)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
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
          <h1 className="text-3xl font-bold tracking-tight">Cage Management</h1>
          <p className="text-muted-foreground">Monitor and manage all cages across sites</p>
        </div>
        <Button size="sm" onClick={() => { setEditItem(null); setDialogOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add Cage</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Cages</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{activeCages.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Fish</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalFish.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Sites</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{new Set(data.map(c => c.siteId)).size}</div></CardContent></Card>
      </div>

      <Card>
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
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>{hg.headers.map((h) => (<TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>{row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}</TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No cages found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                  <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <CrudDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditItem(null); }}
        title={editItem ? 'Edit Cage' : 'Add Cage'}
        description={editItem ? `Editing ${editItem.cageNumber}` : 'Add a new cage to the farm'}
        fields={cageFormFields}
        initialValues={editItem ? {
          cageNumber: editItem.cageNumber,
          name: editItem.name || '',
          siteId: editItem.siteId,
          speciesId: editItem.speciesId || '',
          shape: editItem.shape,
          diameter: editItem.diameter?.toString() || '',
          depth: editItem.depth?.toString() || '',
          volume: editItem.volume?.toString() || '',
          maxCapacity: editItem.maxCapacity?.toString() || '',
          status: editItem.status,
          installationDate: editItem.installationDate?.split('T')[0] || '',
          notes: editItem.notes || '',
        } : undefined}
        onSubmit={editItem ? handleUpdate : handleCreate}
        submitLabel={editItem ? 'Update' : 'Create'}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => { if (!open) setDeleteItem(null); }}
        title="Delete Cage"
        description={`Are you sure you want to delete ${deleteItem?.cageNumber}? This will also remove all associated nets and inspections.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
