'use server';

import { prisma } from '@argodive/shared';
import { createSuccess, createError } from '@/lib/actions';
import type { ActionState } from '@/lib/actions';
import { revalidatePath } from 'next/cache';

type CageInput = {
  cageNumber: string;
  name?: string;
  siteId: string;
  speciesId?: string;
  shape?: string;
  depth?: number;
  circumference?: number;
  diameter?: number;
  volume?: number;
  maxCapacity?: number;
  currentFishCount?: number;
  currentBiomass?: number;
  avgWeight?: number;
  stockingDensity?: number;
  status?: string;
  installationDate?: string;
  notes?: string;
};

export async function listCages(): Promise<ActionState<unknown[]>> {
  try {
    const data = await prisma.cage.findMany({
      include: { site: true, species: true },
      orderBy: { cageNumber: 'asc' },
    });
    return createSuccess(data);
  } catch {
    return createError('Failed to fetch cages');
  }
}

export async function listSites(): Promise<ActionState<unknown[]>> {
  try {
    const data = await prisma.diveSite.findMany({ orderBy: { name: 'asc' } });
    return createSuccess(data);
  } catch {
    return createError('Failed to fetch sites');
  }
}

export async function createCage(data: CageInput): Promise<ActionState> {
  try {
    await prisma.cage.create({
      data: {
        cageNumber: data.cageNumber,
        name: data.name,
        siteId: data.siteId,
        speciesId: data.speciesId,
        shape: data.shape as any,
        depth: data.depth,
        circumference: data.circumference,
        diameter: data.diameter,
        volume: data.volume,
        maxCapacity: data.maxCapacity,
        currentFishCount: data.currentFishCount,
        currentBiomass: data.currentBiomass,
        avgWeight: data.avgWeight,
        stockingDensity: data.stockingDensity,
        status: data.status as any,
        installationDate: data.installationDate ? new Date(data.installationDate) : undefined,
        notes: data.notes,
      },
    });
    revalidatePath('/cages');
    return createSuccess();
  } catch {
    return createError('Failed to create cage');
  }
}

export async function updateCage(id: string, data: CageInput): Promise<ActionState> {
  try {
    await prisma.cage.update({
      where: { id },
      data: {
        cageNumber: data.cageNumber,
        name: data.name,
        siteId: data.siteId,
        speciesId: data.speciesId,
        shape: data.shape as any,
        depth: data.depth,
        circumference: data.circumference,
        diameter: data.diameter,
        volume: data.volume,
        maxCapacity: data.maxCapacity,
        currentFishCount: data.currentFishCount,
        currentBiomass: data.currentBiomass,
        avgWeight: data.avgWeight,
        stockingDensity: data.stockingDensity,
        status: data.status as any,
        installationDate: data.installationDate ? new Date(data.installationDate) : undefined,
        notes: data.notes,
      },
    });
    revalidatePath('/cages');
    return createSuccess();
  } catch {
    return createError('Failed to update cage');
  }
}

export async function deleteCage(id: string): Promise<ActionState> {
  try {
    await prisma.cage.delete({ where: { id } });
    revalidatePath('/cages');
    return createSuccess();
  } catch {
    return createError('Failed to delete cage');
  }
}
