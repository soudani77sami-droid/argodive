'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, MapPin, Thermometer, Droplets, Activity,
  Fish, Waves, AlertTriangle,
  Image, ArrowRight, ArrowLeftRight, ClipboardCheck,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DownloadCageReport } from '@/components/pdf/download-button';

// ---------- Mock data ----------

const cageDetail = {
  id: 'C-001',
  cageNumber: 'C-001',
  name: 'North Alpha',
  site: 'North Farm',
  siteId: 'S-001',
  species: 'Atlantic Salmon',
  speciesId: 'SP-001',
  shape: 'Circular',
  diameter: 25,
  circumference: 78.5,
  depth: 15,
  volume: 1200,
  maxCapacity: 60000,
  currentFishCount: 45000,
  currentBiomass: 180000,
  avgWeight: 4.0,
  stockingDensity: 37.5,
  status: 'Active',
  healthScore: 92,
  installationDate: '2024-03-15',
  lastCleaningDate: '2026-05-20',
  lastStockingDate: '2025-09-01',
  lastHarvestDate: '2025-08-15',
  notes: 'Primary grow-out cage for Atlantic Salmon. Consistent performance with above-average health metrics.',
};

const envReadings = [
  { date: 'Jun 1', temp: 14.2, do: 7.8, salinity: 32.1 },
  { date: 'Jun 2', temp: 14.5, do: 7.5, salinity: 32.4 },
  { date: 'Jun 3', temp: 14.8, do: 7.2, salinity: 32.0 },
  { date: 'Jun 4', temp: 15.1, do: 7.6, salinity: 31.8 },
  { date: 'Jun 5', temp: 14.6, do: 7.9, salinity: 32.2 },
  { date: 'Jun 6', temp: 14.3, do: 8.1, salinity: 32.3 },
  { date: 'Jun 7', temp: 14.0, do: 7.7, salinity: 32.5 },
];

const nets = [
  { id: 'N-001', netNumber: 'N-001', meshSize: 22, material: 'Nylon', depth: 15, circumference: 78.5, condition: 'Good', conditionColor: 'green', installationDate: '2025-08-15', lastCleaning: '2026-05-20', lastRepair: null, ageDays: 296 },
  { id: 'N-002', netNumber: 'N-002', meshSize: 18, material: 'Polyethylene', depth: 15, circumference: 78.5, condition: 'Excellent', conditionColor: 'green', installationDate: '2026-03-01', lastCleaning: '2026-06-01', lastRepair: null, ageDays: 98 },
  { id: 'N-003', netNumber: 'N-003', meshSize: 22, material: 'Nylon', depth: 15, circumference: 78.5, condition: 'Fair', conditionColor: 'yellow', installationDate: '2025-06-20', lastCleaning: '2026-04-10', lastRepair: '2026-02-15', ageDays: 352 },
  { id: 'N-004', netNumber: 'N-004', meshSize: 25, material: 'Nylon', depth: 15, circumference: 78.5, condition: 'Damaged', conditionColor: 'red', installationDate: '2025-04-05', lastCleaning: '2026-02-15', lastRepair: null, ageDays: 428 },
];

const inspections = [
  { id: 'I-001', title: 'Monthly Routine Check', type: 'Routine', date: '2026-06-01', inspector: 'Sarah M.', healthScore: 92, findings: 'Cage integrity good. Biofouling minimal. Fish behavior normal.', status: 'Completed' },
  { id: 'I-002', title: 'Post-Storm Assessment', type: 'Post-Storm', date: '2026-05-15', inspector: 'John D.', healthScore: 88, findings: 'Minor net deformation observed. No structural damage. DO levels recovered.', status: 'Completed' },
  { id: 'I-003', title: 'Bi-monthly Health Check', type: 'Health', date: '2026-05-01', inspector: 'Sarah M.', healthScore: 90, findings: 'All parameters within range. Growth rate consistent with projections.', status: 'Completed' },
  { id: 'I-004', title: 'Structural Integrity Check', type: 'Structural', date: '2026-04-10', inspector: 'Mike T.', healthScore: 85, findings: 'Net N-003 shows wear at connection points. Scheduled for repair.', status: 'Completed' },
  { id: 'I-005', title: 'Environmental Monitoring', type: 'Environmental', date: '2026-03-20', inspector: 'John D.', healthScore: 91, findings: 'Water quality excellent. Plankton levels normal.', status: 'Completed' },
];

const photos = [
  { id: 'P-001', caption: 'Net condition inspection - North side', date: '2026-06-01', photographer: 'Sarah M.' },
  { id: 'P-002', caption: 'Biofouling assessment N-003', date: '2026-05-15', photographer: 'John D.' },
  { id: 'P-003', caption: 'Fish health sampling session', date: '2026-05-01', photographer: 'Sarah M.' },
  { id: 'P-004', caption: 'Cage structure overview', date: '2026-04-10', photographer: 'Mike T.' },
  { id: 'P-005', caption: 'DO sensor calibration check', date: '2026-03-20', photographer: 'John D.' },
  { id: 'P-006', caption: 'Feed behavior observation', date: '2026-03-15', photographer: 'Sarah M.' },
];

const transfers = [
  { id: 'T-001', direction: 'out', fromCage: 'C-001', toCage: 'C-002', fishCount: 5000, reason: 'Splitting', date: '2026-06-01', performedBy: 'John D.', status: 'Completed' },
  { id: 'T-002', direction: 'out', fromCage: 'C-001', toCage: 'C-008', fishCount: 4000, reason: 'Medical Treatment', date: '2026-06-08', performedBy: 'Sarah M.', status: 'Planned' },
  { id: 'T-003', direction: 'in', fromCage: 'C-003', toCage: 'C-001', fishCount: 8000, reason: 'Stocking', date: '2025-09-01', performedBy: 'Mike T.', status: 'Completed' },
  { id: 'T-004', direction: 'out', fromCage: 'C-001', toCage: 'C-005', fishCount: 2000, reason: 'Grading', date: '2025-07-15', performedBy: 'John D.', status: 'Completed' },
];

// ---------- Helpers ----------

const statusBadge = (status: string) => {
  const map: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'info'> = {
    Active: 'success', Completed: 'success', Planned: 'secondary', Harvesting: 'warning', Maintenance: 'destructive', Fallow: 'secondary', Empty: 'secondary',
  };
  return <Badge variant={map[status] || 'secondary'}>{status}</Badge>;
};

const conditionDot = (color: string) => {
  const colors: Record<string, string> = {
    green: 'bg-emerald-500',
    yellow: 'bg-amber-400',
    red: 'bg-destructive',
  };
  return <span className={`inline-block h-3 w-3 rounded-full ${colors[color] || 'bg-muted'}`} />;
};

export default function CageDetailPage() {
  const params = useParams();
  const cageId = params.id as string;

  // In production, fetch by cageId. For now, use mock data scoped to C-001.
  const cage = cageDetail;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/cages" className="hover:text-ocean transition-colors">Cages</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{cageId}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/cages">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">{cage.cageNumber}</h1>
              {statusBadge(cage.status)}
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="h-3.5 w-3.5" /> {cage.site} &middot; {cage.name} &middot; {cage.species}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <DownloadCageReport cage={cage} nets={nets} inspections={inspections} photos={photos} />
          <Button variant="outline" size="sm">Edit Cage</Button>
          <Button size="sm">Schedule Inspection</Button>
        </div>
      </div>

      {/* ===== 1. GENERAL INFORMATION ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Fish className="h-4 w-4 text-ocean" /> General Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Species</p>
              <p className="text-sm font-medium">{cage.species}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Shape / Diameter</p>
              <p className="text-sm font-medium">{cage.shape} &middot; {cage.diameter}m</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Volume</p>
              <p className="text-sm font-medium">{cage.volume.toLocaleString()} m³</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Max Capacity</p>
              <p className="text-sm font-medium">{cage.maxCapacity.toLocaleString()} fish</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Current Fish</p>
              <p className="text-sm font-medium">{cage.currentFishCount.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Biomass</p>
              <p className="text-sm font-medium">{(cage.currentBiomass / 1000).toFixed(1)} t</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Avg Weight</p>
              <p className="text-sm font-medium">{cage.avgWeight} kg</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Stocking Density</p>
              <p className="text-sm font-medium">{cage.stockingDensity} kg/m³</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Health Score</p>
              <p className="text-sm font-medium flex items-center gap-2">
                {cage.healthScore}
                <span className={`inline-block h-2.5 w-16 rounded-full bg-muted overflow-hidden`}>
                  <span className={`block h-full rounded-full ${cage.healthScore >= 80 ? 'bg-emerald-500' : cage.healthScore >= 60 ? 'bg-amber-400' : 'bg-destructive'}`} style={{ width: `${cage.healthScore}%` }} />
                </span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Installed</p>
              <p className="text-sm font-medium">{cage.installationDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last Cleaned</p>
              <p className="text-sm font-medium">{cage.lastCleaningDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last Stocked</p>
              <p className="text-sm font-medium">{cage.lastStockingDate}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <p className="text-xs text-muted-foreground mb-2">Notes</p>
            <p className="text-sm">{cage.notes}</p>
          </div>

          {/* Environmental chart */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-ocean" /> Environmental Readings (7 days)
            </p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={envReadings}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--card))', border: '1px solid var(--border))', borderRadius: 'var(--radius)', fontSize: 13 }} />
                  <Line type="monotone" dataKey="temp" name="Temp (°C)" stroke="var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="do" name="DO (mg/L)" stroke="var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="salinity" name="Salinity (ppt)" stroke="var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== 2. NET INFORMATION ===== */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-ocean" /> Net Information
          </CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> OK</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Repair</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-destructive" /> Replace</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {nets.map((net) => (
              <div
                key={net.id}
                className={`rounded-lg border p-4 transition-shadow hover:shadow-sm ${
                  net.conditionColor === 'red' ? 'border-destructive/40 bg-destructive/5' :
                  net.conditionColor === 'yellow' ? 'border-amber-400/40 bg-amber-50/50 dark:bg-amber-950/10' :
                  'border-emerald-200/50 bg-emerald-50/30 dark:bg-emerald-950/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {conditionDot(net.conditionColor)}
                    <span className="font-medium text-sm">{net.netNumber}</span>
                  </div>
                  <Badge variant={net.conditionColor === 'green' ? 'success' : net.conditionColor === 'yellow' ? 'warning' : 'destructive'}>
                    {net.condition}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Mesh: {net.meshSize}mm</span>
                  <span>{net.material}</span>
                  <span>Depth: {net.depth}m</span>
                  <span>Circum: {net.circumference}m</span>
                  <span>Age: {net.ageDays} days</span>
                  <span>Cleaned: {net.lastCleaning}</span>
                </div>
                {net.lastRepair && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Last repaired: {net.lastRepair}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ===== 3. INSPECTION HISTORY ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-ocean" /> Inspection History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inspections.map((ins) => (
              <div key={ins.id} className="flex items-start gap-4 rounded-lg border p-4">
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  ins.healthScore >= 85 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                  ins.healthScore >= 70 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {ins.healthScore}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{ins.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{ins.type} &middot; {ins.date} &middot; {ins.inspector}</p>
                    </div>
                    <Badge variant="success">{ins.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{ins.findings}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ===== 4. PHOTO GALLERY ===== */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Image className="h-4 w-4 text-ocean" /> Photo Gallery
          </CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div key={photo.id} className="group cursor-pointer rounded-lg border overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-[4/3] bg-gradient-to-br from-ocean-light/10 to-seafoam/20 flex items-center justify-center relative">
                  <Image className="h-8 w-8 text-ocean-light/40" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 px-2 py-1 rounded">View</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium line-clamp-1">{photo.caption}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{photo.date} &middot; {photo.photographer}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ===== 5. FISH TRANSFER HISTORY ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-ocean" /> Fish Transfer History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transfers.map((t) => (
              <div key={t.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  t.direction === 'out' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                }`}>
                  {t.direction === 'out' ? (
                    <ArrowRight className="h-4 w-4" />
                  ) : (
                    <ArrowLeft className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">
                        {t.direction === 'out' ? (
                          <>Transfer to <span className="text-ocean font-semibold">{t.toCage}</span></>
                        ) : (
                          <>Transfer from <span className="text-ocean font-semibold">{t.fromCage}</span></>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t.fishCount.toLocaleString()} fish &middot; {t.reason} &middot; {t.date} &middot; {t.performedBy}
                      </p>
                    </div>
                    {statusBadge(t.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


