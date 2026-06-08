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
import { Plus, Search, ArrowUpDown, Pencil, Trash2, Loader2 } from 'lucide-react';
import { CrudDialog, type FieldConfig } from '@/components/crud/crud-dialog';
import { ConfirmDeleteDialog } from '@/components/crud/confirm-delete';
import { listNets, createNet, updateNet, deleteNet } from '@/app/actions/nets';

const NET_MATERIALS = [
  { label: 'Nylon', value: 'NYLON' },
  { label: 'Polyethylene', value: 'POLYETHYLENE' },
  { label: 'Polyester', value: 'POLYESTER' },
  { label: 'Galvanized Steel', value: 'GALVANIZED_STEEL' },
  { label: 'Copper Alloy', value: 'COPPER_ALLOY' },
  { label: 'Other', value: 'OTHER' },
];

const NET_CONDITIONS = [
  { label: 'Excellent', value: 'EXCELLENT' },
  { label: 'Good', value: 'GOOD' },
  { label: 'Fair', value: 'FAIR' },
  { label: 'Poor', value: 'POOR' },
  { label: 'Damaged', value: 'DAMAGED' },
  { label: 'Replaced', value: 'REPLACED' },
];

const netFormFields: FieldConfig[] = [
  { name: 'netNumber', label: 'Net Number', type: 'text', required: true, placeholder: 'e.g. N-001' },
  { name: 'cageId', label: 'Cage ID', type: 'text', required: true, placeholder: 'Cage ID from database' },
  { name: 'meshSize', label: 'Mesh Size (mm)', type: 'number', placeholder: 'e.g. 22' },
  { name: 'material', label: 'Material', type: 'select', options: NET_MATERIALS },
  { name: 'depth', label: 'Depth (m)', type: 'number', placeholder: 'e.g. 15' },
  { name: 'circumference', label: 'Circumference (m)', type: 'number', placeholder: 'e.g. 78.5' },
  { name: 'condition', label: 'Condition', type: 'select', options: NET_CONDITIONS },
  { name: 'installationDate', label: 'Installation Date', type: 'date' },
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Optional notes' },
];

type NetRecord = {
  id: string;
  netNumber: string;
  cageId: string;
  meshSize: number | null;
  material: string;
  depth: number | null;
  circumference: number | null;
  condition: string;
  installationDate: string | null;
  notes: string | null;
  cage?: { cageNumber: string };
};

const conditionColor: Record<string, 'success' | 'warning' | 'destructive' | 'default' | 'secondary'> = {
  EXCELLENT: 'success',
  GOOD: 'default',
  FAIR: 'warning',
  POOR: 'destructive',
  DAMAGED: 'destructive',
  REPLACED: 'secondary',
};

export default function NetsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<NetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<NetRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<NetRecord | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await listNets();
    if (result.success) setData(result.data as NetRecord[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = useCallback(async (values: Record<string, string>) => {
    const result = await createNet({
      netNumber: values.netNumber,
      cageId: values.cageId,
      meshSize: values.meshSize ? Number(values.meshSize) : undefined,
      material: values.material,
      depth: values.depth ? Number(values.depth) : undefined,
      circumference: values.circumference ? Number(values.circumference) : undefined,
      condition: values.condition,
      installationDate: values.installationDate || undefined,
      notes: values.notes || undefined,
    });
    if (!result.success) return result.error || 'Failed to create';
    await fetchData();
  }, [fetchData]);

  const handleUpdate = useCallback(async (values: Record<string, string>) => {
    if (!editItem) return;
    const result = await updateNet(editItem.id, {
      netNumber: values.netNumber,
      cageId: values.cageId,
      meshSize: values.meshSize ? Number(values.meshSize) : undefined,
      material: values.material,
      depth: values.depth ? Number(values.depth) : undefined,
      circumference: values.circumference ? Number(values.circumference) : undefined,
      condition: values.condition,
      installationDate: values.installationDate || undefined,
      notes: values.notes || undefined,
    });
    if (!result.success) return result.error || 'Failed to update';
    await fetchData();
  }, [editItem, fetchData]);

  const handleDelete = useCallback(async () => {
    if (!deleteItem) return;
    await deleteNet(deleteItem.id);
    setDeleteItem(null);
    await fetchData();
  }, [deleteItem, fetchData]);

  const columns: ColumnDef<NetRecord>[] = useMemo(() => [
    {
      accessorKey: 'netNumber',
      header: ({ column }) => (
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting()}>
          Net <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
    },
    {
      id: 'cage',
      header: 'Cage',
      cell: ({ row }) => (row.original as any).cage?.cageNumber || row.original.cageId,
    },
    { accessorKey: 'meshSize', header: 'Mesh (mm)', cell: ({ row }) => row.getValue('meshSize') ? `${row.getValue('meshSize')}mm` : '—' },
    { accessorKey: 'material', header: 'Material' },
    { accessorKey: 'depth', header: 'Depth (m)', cell: ({ row }) => row.getValue('depth') ? `${row.getValue('depth')}m` : '—' },
    {
      accessorKey: 'condition',
      header: 'Condition',
      cell: ({ row }) => {
        const cond = row.getValue('condition') as string;
        return <Badge variant={conditionColor[cond] || 'secondary'}>{cond}</Badge>;
      },
    },
    {
      accessorKey: 'installationDate',
      header: 'Installed',
      cell: ({ row }) => row.getValue('installationDate') ? (row.getValue('installationDate') as string).split('T')[0] : '—',
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
          <h1 className="text-3xl font-bold tracking-tight">Net Management</h1>
          <p className="text-muted-foreground">Track net conditions, cleaning schedules, and replacements</p>
        </div>
        <Button size="sm" onClick={() => { setEditItem(null); setDialogOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add Net</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Nets</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Good / Excellent</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{data.filter(n => n.condition === 'GOOD' || n.condition === 'EXCELLENT').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Needs Attention</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-amber-600">{data.filter(n => n.condition === 'FAIR' || n.condition === 'POOR').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Damaged</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{data.filter(n => n.condition === 'DAMAGED').length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Net Inventory</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search nets..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="h-9 max-w-sm pl-9" />
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
                    <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No nets found.</TableCell></TableRow>
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
        title={editItem ? 'Edit Net' : 'Add Net'}
        description={editItem ? `Editing ${editItem.netNumber}` : 'Add a new net to the inventory'}
        fields={netFormFields}
        initialValues={editItem ? {
          netNumber: editItem.netNumber,
          cageId: editItem.cageId,
          meshSize: editItem.meshSize?.toString() || '',
          material: editItem.material,
          depth: editItem.depth?.toString() || '',
          circumference: editItem.circumference?.toString() || '',
          condition: editItem.condition,
          installationDate: editItem.installationDate?.split('T')[0] || '',
          notes: editItem.notes || '',
        } : undefined}
        onSubmit={editItem ? handleUpdate : handleCreate}
        submitLabel={editItem ? 'Update' : 'Create'}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => { if (!open) setDeleteItem(null); }}
        title="Delete Net"
        description={`Are you sure you want to delete net ${deleteItem?.netNumber}?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
