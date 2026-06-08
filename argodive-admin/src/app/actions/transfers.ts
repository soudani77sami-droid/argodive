'use server';

import { createSuccess } from '@/lib/actions';
import type { ActionState } from '@/lib/actions';
import { revalidatePath } from 'next/cache';
import { mockList, mockCreate, mockUpdate, mockDelete, toPlainObject } from '@/lib/mock-data';

type TransferInput = {
  fromCageId: string;
  toCageId: string;
  speciesId: string;
  fishCount: number;
  avgWeight?: number;
  reason?: string;
  scheduledDate: string;
  notes?: string;
};

export async function listTransfers(): Promise<ActionState<unknown[]>> {
  const data = toPlainObject(mockList('transfers'));
  return createSuccess(data);
}

export async function createTransfer(data: TransferInput): Promise<ActionState> {
  mockCreate('transfers', data);
  revalidatePath('/transfers');
  return createSuccess();
}

export async function updateTransfer(id: string, data: TransferInput): Promise<ActionState> {
  mockUpdate('transfers', id, data);
  revalidatePath('/transfers');
  return createSuccess();
}

export async function deleteTransfer(id: string): Promise<ActionState> {
  mockDelete('transfers', id);
  revalidatePath('/transfers');
  return createSuccess();
}
