'use server';

import { createSuccess } from '@/lib/actions';
import type { ActionState } from '@/lib/actions';
import { revalidatePath } from 'next/cache';
import { mockList, mockCreate, mockUpdate, mockDelete, toPlainObject } from '@/lib/mock-data';

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
  const data = toPlainObject(mockList('species'));
  return createSuccess(data);
}

export async function createSpecies(data: SpeciesInput): Promise<ActionState> {
  mockCreate('species', { ...data, category: data.category, isActive: true });
  revalidatePath('/species');
  return createSuccess();
}

export async function updateSpecies(id: string, data: SpeciesInput): Promise<ActionState> {
  mockUpdate('species', id, { ...data, category: data.category });
  revalidatePath('/species');
  return createSuccess();
}

export async function deleteSpecies(id: string): Promise<ActionState> {
  mockDelete('species', id);
  revalidatePath('/species');
  return createSuccess();
}
