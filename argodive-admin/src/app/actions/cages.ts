'use server';

import { createSuccess } from '@/lib/actions';
import type { ActionState } from '@/lib/actions';
import { revalidatePath } from 'next/cache';
import { mockList, mockCreate, mockUpdate, mockDelete, toPlainObject } from '@/lib/mock-data';

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
  const data = toPlainObject(mockList('cages'));
  return createSuccess(data);
}

export async function listSites(): Promise<ActionState<unknown[]>> {
  return createSuccess([]);
}

export async function createCage(data: CageInput): Promise<ActionState> {
  mockCreate('cages', data);
  revalidatePath('/cages');
  return createSuccess();
}

export async function updateCage(id: string, data: CageInput): Promise<ActionState> {
  mockUpdate('cages', id, data);
  revalidatePath('/cages');
  return createSuccess();
}

export async function deleteCage(id: string): Promise<ActionState> {
  mockDelete('cages', id);
  revalidatePath('/cages');
  return createSuccess();
}
