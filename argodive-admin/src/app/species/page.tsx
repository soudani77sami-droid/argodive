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
import { listSpecies, createSpecies, updateSpecies, deleteSpecies } from '@/app/actions/species';
import type { ActionState } from '@/lib/actions';

type Species = {
  id: string;
  code: string;
  name: string;
  scientificName: string | null;
  category: string;
  growthRate: number | null;
  daysToHarvest: number | null;
  avgMarketWeight: number | null;
  isActive: boolean;
  _cageCount?: number;
};

const CATEGORIES = [
  { label: 'Finfish', value: 'FINFISH' },
  { label: 'Shellfish', value: 'SHELLFISH' },
  { label: 'Crustacean', value: 'CRUSTACEAN' },
  { label: 'Seaweed', value: 'SEAWEED' },
  { label: 'Other', value: 'OTHER' },
];

const formFields: FieldConfig[] = [
  { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'e.g. SAL' },
  { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. Atlantic Salmon' },
  { name: 'scientificName', label: 'Scientific Name', type: 'text', placeholder: 'e.g. Salmo salar' },
  { name: 'category', label: 'Category', type: 'select', options: CATEGORIES },
  { name: 'growthRate', label: 'Growth Rate (kg/yr)', type: 'number', placeholder: 'e.g. 1.2' },
  { name: 'daysToHarvest', label: 'Days to Harvest', type: 'number', placeholder: 'e.g. 540' },
  { name: 'avgMarketWeight', label: 'Avg Market Weight (kg)', type: 'number', placeholder: 'e.g. 4.5' },
];

export default function SpeciesPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Species | null>(null);
  const [deleteItem, setDeleteItem] = useState<Species | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await listSpecies();
    if (result.success) setData(result.data as Species[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = useCallback(async (values: Record<string, string>) => {
    const result = await createSpecies({
      code: values.code,
      name: values.name,
      scientificName: values.scientificName || undefined,
      category: values.category,
      growthRate: values.growthRate ? Number(values.growthRate) : undefined,
      daysToHarvest: values.daysToHarvest ? Number(values.daysToHarvest) : undefined,
      avgMarketWeight: values.avgMarketWeight ? Number(values.avgMarketWeight) : undefined,
    });
    if (!result.success) return result.error || 'Failed to create';
    await fetchData();
  }, [fetchData]);

  const handleUpdate = useCallback(async (values: Record<string, string>) => {
    if (!editItem) return;
    const result = await updateSpecies(editItem.id, {
      code: values.code,
      name: values.name,
      scientificName: values.scientificName || undefined,
      category: values.category,
      growthRate: values.growthRate ? Number(values.growthRate) : undefined,
      daysToHarvest: values.daysToHarvest ? Number(values.daysToHarvest) : undefined,
      avgMarketWeight: values.avgMarketWeight ? Number(values.avgMarketWeight) : undefined,
    });
    if (!result.success) return result.error || 'Failed to update';
    await fetchData();
  }, [editItem, fetchData]);

  const handleDelete = useCallback(async () => {
    if (!deleteItem) return;
    await deleteSpecies(deleteItem.id);
    setDeleteItem(null);
    await fetchData();
  }, [deleteItem, fetchData]);

  const openEdit = (item: Species) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  const columns: ColumnDef<Species>[] = useMemo(() => [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting()}>
          Code <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
    },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'scientificName', header: 'Scientific Name', cell: ({ row }) => row.getValue('scientificName') || '—' },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="secondary">{row.getValue('category')}</Badge>,
    },
    {
      accessorKey: 'growthRate',
      header: 'Growth (kg/yr)',
      cell: ({ row }) => row.getValue('growthRate') ? `${row.getValue('growthRate')} kg/yr` : '—',
    },
    { accessorKey: 'daysToHarvest', header: 'Days to Harvest', cell: ({ row }) => row.getValue('daysToHarvest') ?? '—' },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('isActive') ? 'success' : 'secondary'}>
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row.original)}>
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
          <h1 className="text-3xl font-bold tracking-tight">Species</h1>
          <p className="text-muted-foreground">Manage fish species and broodstock</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> Add Species</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Species</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search species..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="h-9 max-w-sm pl-9" />
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
                    <TableRow key={hg.id}>
                      {hg.headers.map((h) => (
                        <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No species found.</TableCell></TableRow>
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
        title={editItem ? 'Edit Species' : 'Add Species'}
        description={editItem ? `Editing ${editItem.name}` : 'Add a new fish species to the catalog'}
        fields={formFields}
        initialValues={editItem ? {
          code: editItem.code,
          name: editItem.name,
          scientificName: editItem.scientificName || '',
          category: editItem.category,
          growthRate: editItem.growthRate?.toString() || '',
          daysToHarvest: editItem.daysToHarvest?.toString() || '',
          avgMarketWeight: editItem.avgMarketWeight?.toString() || '',
        } : undefined}
        onSubmit={editItem ? handleUpdate : handleCreate}
        submitLabel={editItem ? 'Update' : 'Create'}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => { if (!open) setDeleteItem(null); }}
        title="Delete Species"
        description={`Are you sure you want to delete ${deleteItem?.name}? This may affect cages assigned to this species.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
