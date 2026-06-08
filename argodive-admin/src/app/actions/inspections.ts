'use server';

import { createSuccess } from '@/lib/actions';
import type { ActionState } from '@/lib/actions';
import { revalidatePath } from 'next/cache';
import { mockList, mockCreate, mockUpdate, mockDelete, toPlainObject } from '@/lib/mock-data';

type InspectionInput = {
  title: string;
  cageId: string;
  inspectionType?: string;
  description?: string;
  scheduledDate: string;
  healthScore?: number;
  findings?: string;
  recommendations?: string;
  status?: string;
};

export async function listInspections(): Promise<ActionState<unknown[]>> {
  const data = toPlainObject(mockList('inspections'));
  return createSuccess(data);
}

export async function createInspection(data: InspectionInput): Promise<ActionState> {
  mockCreate('inspections', data);
  revalidatePath('/inspections');
  return createSuccess();
}

export async function updateInspection(id: string, data: InspectionInput): Promise<ActionState> {
  mockUpdate('inspections', id, data);
  revalidatePath('/inspections');
  return createSuccess();
}

export async function deleteInspection(id: string): Promise<ActionState> {
  mockDelete('inspections', id);
  revalidatePath('/inspections');
  return createSuccess();
}
