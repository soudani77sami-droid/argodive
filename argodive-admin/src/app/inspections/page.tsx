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
import { listInspections, createInspection, updateInspection, deleteInspection } from '@/app/actions/inspections';

const INSPECTION_TYPES = [
  { label: 'Routine', value: 'ROUTINE' },
  { label: 'Structural', value: 'STRUCTURAL' },
  { label: 'Pre-Harvest', value: 'PRE_HARVEST' },
  { label: 'Post-Storm', value: 'POST_STORM' },
  { label: 'Emergency', value: 'EMERGENCY' },
  { label: 'Environmental', value: 'ENVIRONMENTAL' },
  { label: 'Health', value: 'HEALTH' },
  { label: 'Mortality', value: 'MORTALITY' },
];

const INSPECTION_STATUSES = [
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Overdue', value: 'OVERDUE' },
];

const inspectionFormFields: FieldConfig[] = [
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g. Monthly Routine Check' },
  { name: 'cageId', label: 'Cage ID', type: 'text', required: true, placeholder: 'Cage ID from database' },
  { name: 'inspectionType', label: 'Type', type: 'select', options: INSPECTION_TYPES },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description' },
  { name: 'scheduledDate', label: 'Scheduled Date', type: 'date', required: true },
  { name: 'healthScore', label: 'Health Score (0-100)', type: 'number', min: 0, max: 100, placeholder: 'e.g. 85' },
  { name: 'findings', label: 'Findings', type: 'textarea', placeholder: 'Inspection findings' },
  { name: 'recommendations', label: 'Recommendations', type: 'textarea', placeholder: 'Follow-up actions' },
  { name: 'status', label: 'Status', type: 'select', options: INSPECTION_STATUSES },
];

type InspectionRecord = {
  id: string;
  title: string;
  cageId: string;
  inspectionType: string;
  description: string | null;
  scheduledDate: string;
  completedDate: string | null;
  healthScore: number | null;
  findings: string | null;
  recommendations: string | null;
  status: string;
  cage?: { cageNumber: string };
  conductedBy?: { name: string } | null;
};

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default' | 'secondary' | 'info'> = {
  COMPLETED: 'success',
  IN_PROGRESS: 'info',
  SCHEDULED: 'default',
  CANCELLED: 'secondary',
  OVERDUE: 'destructive',
};

export default function InspectionsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<InspectionRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<InspectionRecord | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await listInspections();
    if (result.success) setData(result.data as InspectionRecord[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = useCallback(async (values: Record<string, string>) => {
    const result = await createInspection({
      title: values.title,
      cageId: values.cageId,
      inspectionType: values.inspectionType,
      description: values.description || undefined,
      scheduledDate: values.scheduledDate,
      healthScore: values.healthScore ? Number(values.healthScore) : undefined,
      findings: values.findings || undefined,
      recommendations: values.recommendations || undefined,
      status: values.status,
    });
    if (!result.success) return result.error || 'Failed to create';
    await fetchData();
  }, [fetchData]);

  const handleUpdate = useCallback(async (values: Record<string, string>) => {
    if (!editItem) return;
    const result = await updateInspection(editItem.id, {
      title: values.title,
      cageId: values.cageId,
      inspectionType: values.inspectionType,
      description: values.description || undefined,
      scheduledDate: values.scheduledDate,
      healthScore: values.healthScore ? Number(values.healthScore) : undefined,
      findings: values.findings || undefined,
      recommendations: values.recommendations || undefined,
      status: values.status,
    });
    if (!result.success) return result.error || 'Failed to update';
    await fetchData();
  }, [editItem, fetchData]);

  const handleDelete = useCallback(async () => {
    if (!deleteItem) return;
    await deleteInspection(deleteItem.id);
    setDeleteItem(null);
    await fetchData();
  }, [deleteItem, fetchData]);

  const columns: ColumnDef<InspectionRecord>[] = useMemo(() => [
    { accessorKey: 'title', header: ({ column }) => (
      <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting()}>
        Title <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    )},
    {
      id: 'cage',
      header: 'Cage',
      cell: ({ row }) => (row.original as any).cage?.cageNumber || row.original.cageId,
    },
    { accessorKey: 'inspectionType', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.getValue('inspectionType')}</Badge> },
    {
      accessorKey: 'scheduledDate',
      header: 'Scheduled',
      cell: ({ row }) => (row.getValue('scheduledDate') as string).split('T')[0],
    },
    {
      accessorKey: 'healthScore',
      header: 'Score',
      cell: ({ row }) => {
        const score = row.getValue('healthScore') as number | null;
        if (score === null) return '—';
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-12 rounded-full bg-muted">
              <div className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-destructive'}`} style={{ width: `${score}%` }} />
            </div>
            <span className="text-xs">{score}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant={statusVariant[status] || 'secondary'}>{status}</Badge>;
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
          <h1 className="text-3xl font-bold tracking-tight">Inspections</h1>
          <p className="text-muted-foreground">Manage cage inspections and dive operations</p>
        </div>
        <Button size="sm" onClick={() => { setEditItem(null); setDialogOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add Inspection</Button>
      </div>

      <Card>
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
                    <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No inspections found.</TableCell></TableRow>
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
        title={editItem ? 'Edit Inspection' : 'Add Inspection'}
        description={editItem ? `Editing ${editItem.title}` : 'Schedule a new cage inspection'}
        fields={inspectionFormFields}
        initialValues={editItem ? {
          title: editItem.title,
          cageId: editItem.cageId,
          inspectionType: editItem.inspectionType,
          description: editItem.description || '',
          scheduledDate: editItem.scheduledDate.split('T')[0],
          healthScore: editItem.healthScore?.toString() || '',
          findings: editItem.findings || '',
          recommendations: editItem.recommendations || '',
          status: editItem.status,
        } : undefined}
        onSubmit={editItem ? handleUpdate : handleCreate}
        submitLabel={editItem ? 'Update' : 'Create'}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => { if (!open) setDeleteItem(null); }}
        title="Delete Inspection"
        description={`Are you sure you want to delete "${deleteItem?.title}"? This will also remove all associated photos.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
