'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, MapPin, Thermometer, Fish, Waves, AlertTriangle,
  Image, ArrowRight, ArrowLeftRight, ClipboardCheck, Activity, ArrowLeft as ArrowLeftIcon,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { getCageDetail } from '@/app/actions/data';

const envReadings = [
  { date: 'Jun 1', temp: 14.2, do: 7.8, salinity: 32.1 },
  { date: 'Jun 2', temp: 14.5, do: 7.5, salinity: 32.4 },
  { date: 'Jun 3', temp: 14.8, do: 7.2, salinity: 32.0 },
  { date: 'Jun 4', temp: 15.1, do: 7.6, salinity: 31.8 },
  { date: 'Jun 5', temp: 14.6, do: 7.9, salinity: 32.2 },
  { date: 'Jun 6', temp: 14.3, do: 8.1, salinity: 32.3 },
  { date: 'Jun 7', temp: 14.0, do: 7.7, salinity: 32.5 },
];

function statusBadge(status: string) {
  const map: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'info'> = {
    ACTIVE: 'success', COMPLETED: 'success', PLANNED: 'secondary',
    HARVESTING: 'warning', MAINTENANCE: 'destructive', FALLOW: 'secondary', EMPTY: 'secondary',
  };
  return <Badge variant={map[status] || 'secondary'}>{status}</Badge>;
}

function conditionColor(condition: string) {
  switch (condition) {
    case 'EXCELLENT': case 'GOOD': return 'green';
    case 'FAIR': return 'yellow';
    case 'POOR': case 'DAMAGED': return 'red';
    default: return 'gray';
  }
}

function conditionDot(color: string) {
  const colors: Record<string, string> = {
    green: 'bg-emerald-500',
    yellow: 'bg-amber-400',
    red: 'bg-destructive',
    gray: 'bg-muted',
  };
  return <span className={`inline-block h-3 w-3 rounded-full ${colors[color] || 'bg-muted'}`} />;
}

export default function CageDetailPage() {
  const params = useParams();
  const cageId = params.id as string;
  const [cage, setCage] = useState<any>(null);

  useEffect(() => {
    getCageDetail(cageId).then(setCage);
  }, [cageId]);

  if (!cage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/cages" className="hover:text-ocean transition-colors">Cages</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{cageId}</span>
        </div>
        <p className="text-muted-foreground">Loading cage data...</p>
      </div>
    );
  }

  const nets = (cage.nets ?? []).map((n: any) => ({
    ...n,
    conditionColor: conditionColor(n.condition),
    ageDays: n.installationDate ? Math.floor((Date.now() - new Date(n.installationDate).getTime()) / 86400000) : 0,
    lastCleaning: n.lastCleaningDate?.slice(0, 10) ?? '--',
    lastRepair: n.lastRepairDate?.slice(0, 10) ?? null,
  }));

  const inspections = (cage.inspections ?? []).map((i: any) => ({
    id: i.id,
    title: i.title,
    type: i.inspectionType,
    date: i.scheduledDate?.slice(0, 10) ?? '',
    inspector: i.conductedBy?.name ?? 'TBD',
    healthScore: i.healthScore ?? 0,
    findings: i.findings ?? '',
    status: i.status === 'COMPLETED' ? 'Completed' : i.status === 'SCHEDULED' ? 'Scheduled' : i.status,
  }));

  const photos = (cage.inspections ?? []).flatMap((i: any) =>
    (i.photos ?? []).map((p: any) => ({
      id: p.id,
      caption: p.caption ?? '',
      date: p.takenAt?.slice(0, 10) ?? i.scheduledDate?.slice(0, 10) ?? '',
      photographer: i.conductedBy?.name ?? '',
    })),
  );

  const transfers = [
    ...(cage.transfersFrom ?? []).map((t: any) => ({
      id: t.id,
      direction: 'out' as const,
      fromCage: cage.cageNumber,
      toCage: t.toCage?.cageNumber ?? '',
      fishCount: t.fishCount,
      reason: t.reason,
      date: t.scheduledDate?.slice(0, 10) ?? '',
      performedBy: t.performedBy?.name ?? 'TBD',
      status: t.status === 'COMPLETED' ? 'Completed' : t.status === 'PLANNED' ? 'Planned' : t.status,
    })),
    ...(cage.transfersTo ?? []).map((t: any) => ({
      id: t.id,
      direction: 'in' as const,
      fromCage: t.fromCage?.cageNumber ?? '',
      toCage: cage.cageNumber,
      fishCount: t.fishCount,
      reason: t.reason,
      date: t.scheduledDate?.slice(0, 10) ?? '',
      performedBy: t.performedBy?.name ?? 'TBD',
      status: t.status === 'COMPLETED' ? 'Completed' : t.status === 'PLANNED' ? 'Planned' : t.status,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/cages" className="hover:text-ocean transition-colors">Cages</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{cageId}</span>
      </div>

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
              <MapPin className="h-3.5 w-3.5" /> {cage.site?.name ?? ''} &middot; {cage.name ?? ''} &middot; {cage.species?.name ?? ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Edit Cage</Button>
          <Button size="sm">Schedule Inspection</Button>
        </div>
      </div>

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
              <p className="text-sm font-medium">{cage.species?.name ?? 'None'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Shape / Diameter</p>
              <p className="text-sm font-medium">{cage.shape} &middot; {cage.diameter ?? 0}m</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Volume</p>
              <p className="text-sm font-medium">{(cage.volume ?? 0).toLocaleString()} m³</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Max Capacity</p>
              <p className="text-sm font-medium">{(cage.maxCapacity ?? 0).toLocaleString()} fish</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Current Fish</p>
              <p className="text-sm font-medium">{(cage.currentFishCount ?? 0).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Biomass</p>
              <p className="text-sm font-medium">{((cage.currentBiomass ?? 0) / 1000).toFixed(1)} t</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Avg Weight</p>
              <p className="text-sm font-medium">{cage.avgWeight ?? 0} kg</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Stocking Density</p>
              <p className="text-sm font-medium">{cage.stockingDensity ?? 0} kg/m³</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Installed</p>
              <p className="text-sm font-medium">{cage.installationDate?.slice(0, 10) ?? '--'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last Cleaned</p>
              <p className="text-sm font-medium">{cage.lastCleaningDate?.slice(0, 10) ?? '--'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last Stocked</p>
              <p className="text-sm font-medium">{cage.lastStockingDate?.slice(0, 10) ?? '--'}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {cage.notes && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Notes</p>
              <p className="text-sm">{cage.notes}</p>
            </div>
          )}

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
            {nets.length === 0 && <p className="text-sm text-muted-foreground col-span-2">No nets recorded for this cage.</p>}
            {nets.map((net: any) => (
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
                  <span>Mesh: {net.meshSize ?? '--'}mm</span>
                  <span>{net.material}</span>
                  <span>Depth: {net.depth ?? '--'}m</span>
                  <span>Circum: {net.circumference ?? '--'}m</span>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-ocean" /> Inspection History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inspections.length === 0 && <p className="text-sm text-muted-foreground">No inspections recorded for this cage.</p>}
            {inspections.map((ins: any) => (
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
                    {statusBadge(ins.status)}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{ins.findings}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Image className="h-4 w-4 text-ocean" /> Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.length === 0 && <p className="text-sm text-muted-foreground col-span-3">No photos available for this cage.</p>}
            {photos.map((photo: any) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-ocean" /> Fish Transfer History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transfers.length === 0 && <p className="text-sm text-muted-foreground">No transfers recorded for this cage.</p>}
            {transfers.map((t: any) => (
              <div key={t.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  t.direction === 'out' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                }`}>
                  {t.direction === 'out' ? (
                    <ArrowRight className="h-4 w-4" />
                  ) : (
                    <ArrowLeftIcon className="h-4 w-4" />
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
