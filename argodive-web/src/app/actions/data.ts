'use server';

import { prisma } from '@argodive/shared';

export async function getDashboardStats() {
  const [cages, inspections, transfers, netsData, species] = await Promise.all([
    prisma.cage.findMany({ include: { site: true, species: true } }),
    prisma.inspection.findMany({ include: { cage: true, conductedBy: true } }),
    prisma.fishTransfer.findMany({ include: { fromCage: true, toCage: true, species: true, performedBy: true } }),
    prisma.net.findMany({ include: { cage: true } }),
    prisma.species.findMany(),
  ]);

  const activeCages = cages.filter(c => c.status === 'ACTIVE').length;
  const totalFish = cages.reduce((s, c) => s + (c.currentFishCount ?? 0), 0);
  const totalBiomass = cages.reduce((s, c) => s + (c.currentBiomass ?? 0), 0);
  const inspectionsThisWeek = inspections.filter(i => {
    const d = new Date(i.scheduledDate);
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    return d >= weekStart;
  }).length;
  const activeTransfers = transfers.filter(t => t.status === 'IN_PROGRESS' || t.status === 'PLANNED').length;

  return {
    cages,
    inspections,
    transfers,
    netsData,
    species,
    stats: {
      activeCages,
      totalFish,
      totalBiomass,
      inspectionsThisWeek,
      activeTransfers,
      speciesCount: species.length,
      sitesCount: new Set(cages.map(c => c.siteId)).size,
    },
  };
}

export async function getCagesList() {
  return prisma.cage.findMany({
    include: { site: true, species: true },
    orderBy: { cageNumber: 'asc' },
  });
}

export async function getCageDetail(id: string) {
  const cage = await prisma.cage.findUnique({
    where: { id },
    include: {
      site: true,
      species: true,
      nets: true,
      inspections: { include: { conductedBy: true }, orderBy: { scheduledDate: 'desc' } },
      transfersFrom: { include: { toCage: true, species: true }, orderBy: { scheduledDate: 'desc' } },
      transfersTo: { include: { fromCage: true, species: true }, orderBy: { scheduledDate: 'desc' } },
    },
  });
  return cage;
}

export async function getInspectionsList() {
  return prisma.inspection.findMany({
    include: { cage: { include: { site: true } }, conductedBy: true },
    orderBy: { scheduledDate: 'desc' },
  });
}

export async function getTransfersList() {
  return prisma.fishTransfer.findMany({
    include: { fromCage: true, toCage: true, species: true, performedBy: true },
    orderBy: { scheduledDate: 'desc' },
  });
}

export async function getPhotosList() {
  return prisma.photo.findMany({
    include: { inspection: { include: { cage: true } } },
    orderBy: { takenAt: 'desc' },
  });
}
