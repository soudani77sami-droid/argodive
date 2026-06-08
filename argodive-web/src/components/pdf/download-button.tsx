'use client';

import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { CageReportPDF } from '@/components/pdf/cage-report';
import { Download } from 'lucide-react';

type CageInfo = {
  cageNumber: string; name: string; site: string; species: string;
  shape: string; diameter: number; volume: number; maxCapacity: number;
  currentFishCount: number; currentBiomass: number; avgWeight: number;
  stockingDensity: number; healthScore: number; status: string;
  installationDate: string; lastCleaningDate: string; lastStockingDate: string;
  lastHarvestDate: string; notes: string;
};

type NetInfo = {
  netNumber: string; meshSize: number; material: string; depth: number;
  circumference: number; condition: string; conditionColor: string;
  installationDate: string; lastCleaning: string; lastRepair: string | null; ageDays: number;
};

type InspectionInfo = {
  title: string; type: string; date: string; inspector: string;
  healthScore: number; findings: string; status: string;
};

type PhotoInfo = {
  caption: string; date: string; photographer: string;
};

export function DownloadCageReport({
  cage, nets, inspections, photos,
}: {
  cage: CageInfo;
  nets: NetInfo[];
  inspections: InspectionInfo[];
  photos: PhotoInfo[];
}) {
  const handleDownload = async () => {
    const blob = await pdf(
      <CageReportPDF cage={cage} nets={nets} inspections={inspections} photos={photos} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cage-report-${cage.cageNumber.replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} size="sm">
      <Download className="mr-1.5 h-4 w-4" /> PDF Report
    </Button>
  );
}
