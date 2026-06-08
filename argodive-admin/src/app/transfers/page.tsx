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
import { listTransfers, createTransfer, updateTransfer, deleteTransfer } from '@/app/actions/transfers';

const TRANSFER_REASONS = [
  { label: 'Grading', value: 'GRADING' },
  { label: 'Stocking', value: 'STOCKING' },
  { label: 'Restocking', value: 'RESTOCKING' },
  { label: 'Harvest', value: 'HARVEST' },
  { label: 'Splitting', value: 'SPLITTING' },
  { label: 'Medical Treatment', value: 'MEDICAL_TREATMENT' },
  { label: 'Mortality Removal', value: 'MORTALITY_REMOVAL' },
  { label: 'Relocation', value: 'RELOCATION' },
  { label: 'Other', value: 'OTHER' },
];

const transferFormFields: FieldConfig[] = [
  { name: 'fromCageId', label: 'From Cage ID', type: 'text', required: true, placeholder: 'Source cage ID' },
  { name: 'toCageId', label: 'To Cage ID', type: 'text', required: true, placeholder: 'Destination cage ID' },
  { name: 'speciesId', label: 'Species ID', type: 'text', required: true, placeholder: 'Species ID' },
  { name: 'fishCount', label: 'Fish Count', type: 'number', required: true, placeholder: 'e.g. 5000' },
  { name: 'avgWeight', label: 'Avg Weight (kg)', type: 'number', placeholder: 'e.g. 2.5' },
  { name: 'reason', label: 'Reason', type: 'select', options: TRANSFER_REASONS },
  { name: 'scheduledDate', label: 'Scheduled Date', type: 'date', required: true },
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Optional notes' },
];

type TransferRecord = {
  id: string;
  fromCageId: string;
  toCageId: string;
  speciesId: string;
  fishCount: number;
  avgWeight: number | null;
  reason: string;
  status: string;
  scheduledDate: string;
  completedDate: string | null;
  notes: string | null;
  fromCage?: { cageNumber: string };
  toCage?: { cageNumber: string };
  species?: { name: string };
  performedBy?: { name: string } | null;
};

const transferStatusVariant: Record<string, 'success' | 'warning' | 'default' | 'secondary'> = {
  COMPLETED: 'success',
  IN_PROGRESS: 'warning',
  PLANNED: 'default',
  CANCELLED: 'secondary',
};

export default function TransfersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<TransferRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<TransferRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<TransferRecord | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await listTransfers();
    if (result.success) setData(result.data as TransferRecord[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = useCallback(async (values: Record<string, string>) => {
    const result = await createTransfer({
      fromCageId: values.fromCageId,
      toCageId: values.toCageId,
      speciesId: values.speciesId,
      fishCount: Number(values.fishCount),
      avgWeight: values.avgWeight ? Number(values.avgWeight) : undefined,
      reason: values.reason,
      scheduledDate: values.scheduledDate,
      notes: values.notes || undefined,
    });
    if (!result.success) return result.error || 'Failed to create';
    await fetchData();
  }, [fetchData]);

  const handleUpdate = useCallback(async (values: Record<string, string>) => {
    if (!editItem) return;
    const result = await updateTransfer(editItem.id, {
      fromCageId: values.fromCageId,
      toCageId: values.toCageId,
      speciesId: values.speciesId,
      fishCount: Number(values.fishCount),
      avgWeight: values.avgWeight ? Number(values.avgWeight) : undefined,
      reason: values.reason,
      scheduledDate: values.scheduledDate,
      notes: values.notes || undefined,
    });
    if (!result.success) return result.error || 'Failed to update';
    await fetchData();
  }, [editItem, fetchData]);

  const handleDelete = useCallback(async () => {
    if (!deleteItem) return;
    await deleteTransfer(deleteItem.id);
    setDeleteItem(null);
    await fetchData();
  }, [deleteItem, fetchData]);

  const columns: ColumnDef<TransferRecord>[] = useMemo(() => [
    {
      id: 'from',
      header: 'From',
      cell: ({ row }) => (row.original as any).fromCage?.cageNumber || row.original.fromCageId,
    },
    {
      id: 'to',
      header: 'To',
      cell: ({ row }) => (row.original as any).toCage?.cageNumber || row.original.toCageId,
    },
    {
      id: 'species',
      header: 'Species',
      cell: ({ row }) => (row.original as any).species?.name || row.original.speciesId,
    },
    { accessorKey: 'fishCount', header: 'Fish Count', cell: ({ row }) => (row.getValue('fishCount') as number).toLocaleString() },
    { accessorKey: 'reason', header: 'Reason' },
    {
      accessorKey: 'scheduledDate',
      header: ({ column }) => (
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting()}>
          Date <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (row.getValue('scheduledDate') as string).split('T')[0],
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant={transferStatusVariant[status] || 'secondary'}>{status}</Badge>;
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
          <h1 className="text-3xl font-bold tracking-tight">Fish Transfers</h1>
          <p className="text-muted-foreground">Track and manage fish movements between cages</p>
        </div>
        <Button size="sm" onClick={() => { setEditItem(null); setDialogOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add Transfer</Button>
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
                    <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No transfers found.</TableCell></TableRow>
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
        title={editItem ? 'Edit Transfer' : 'Add Transfer'}
        description={editItem ? 'Edit fish transfer details' : 'Record a new fish transfer between cages'}
        fields={transferFormFields}
        initialValues={editItem ? {
          fromCageId: editItem.fromCageId,
          toCageId: editItem.toCageId,
          speciesId: editItem.speciesId,
          fishCount: editItem.fishCount.toString(),
          avgWeight: editItem.avgWeight?.toString() || '',
          reason: editItem.reason,
          scheduledDate: editItem.scheduledDate.split('T')[0],
          notes: editItem.notes || '',
        } : undefined}
        onSubmit={editItem ? handleUpdate : handleCreate}
        submitLabel={editItem ? 'Update' : 'Create'}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => { if (!open) setDeleteItem(null); }}
        title="Delete Transfer"
        description={`Are you sure you want to delete this fish transfer?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
