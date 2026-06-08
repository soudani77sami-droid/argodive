'use server';

import { prisma } from '@argodive/shared';
import { createSuccess, createError } from '@/lib/actions';
import type { ActionState } from '@/lib/actions';
import { revalidatePath } from 'next/cache';

type SpeciesInput = {
  name: string;
  code: string;
  scientificName?: string;
  category?: string;
  description?: string;
  optimalTempMin?: number;
  optimalTempMax?: number;
  optimalSalinityMin?: number;
  optimalSalinityMax?: number;
  optimalDO?: number;
  growthRate?: number;
  maxDensity?: number;
  avgMarketWeight?: number;
  daysToHarvest?: number;
};

export async function listSpecies(): Promise<ActionState<unknown[]>> {
  try {
    const data = await prisma.species.findMany({ orderBy: { name: 'asc' } });
    return createSuccess(data);
  } catch {
    return createError('Failed to fetch species');
  }
}

export async function createSpecies(data: SpeciesInput): Promise<ActionState> {
  try {
    await prisma.species.create({
      data: {
        name: data.name,
        code: data.code,
        scientificName: data.scientificName,
        category: data.category as any,
        description: data.description,
        optimalTempMin: data.optimalTempMin,
        optimalTempMax: data.optimalTempMax,
        optimalSalinityMin: data.optimalSalinityMin,
        optimalSalinityMax: data.optimalSalinityMax,
        optimalDO: data.optimalDO,
        growthRate: data.growthRate,
        maxDensity: data.maxDensity,
        avgMarketWeight: data.avgMarketWeight,
        daysToHarvest: data.daysToHarvest,
        isActive: true,
      },
    });
    revalidatePath('/species');
    return createSuccess();
  } catch {
    return createError('Failed to create species');
  }
}

export async function updateSpecies(id: string, data: SpeciesInput): Promise<ActionState> {
  try {
    await prisma.species.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        scientificName: data.scientificName,
        category: data.category as any,
        description: data.description,
        optimalTempMin: data.optimalTempMin,
        optimalTempMax: data.optimalTempMax,
        optimalSalinityMin: data.optimalSalinityMin,
        optimalSalinityMax: data.optimalSalinityMax,
        optimalDO: data.optimalDO,
        growthRate: data.growthRate,
        maxDensity: data.maxDensity,
        avgMarketWeight: data.avgMarketWeight,
        daysToHarvest: data.daysToHarvest,
      },
    });
    revalidatePath('/species');
    return createSuccess();
  } catch {
    return createError('Failed to update species');
  }
}

export async function deleteSpecies(id: string): Promise<ActionState> {
  try {
    await prisma.species.delete({ where: { id } });
    revalidatePath('/species');
    return createSuccess();
  } catch {
    return createError('Failed to delete species');
  }
}
