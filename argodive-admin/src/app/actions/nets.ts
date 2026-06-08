'use server';

import { createSuccess } from '@/lib/actions';
import type { ActionState } from '@/lib/actions';
import { revalidatePath } from 'next/cache';
import { mockList, mockCreate, mockUpdate, mockDelete, toPlainObject } from '@/lib/mock-data';

type NetInput = {
  netNumber: string;
  cageId: string;
  meshSize?: number;
  material?: string;
  depth?: number;
  circumference?: number;
  condition?: string;
  installationDate?: string;
  notes?: string;
};

export async function listNets(): Promise<ActionState<unknown[]>> {
  const data = toPlainObject(mockList('nets'));
  return createSuccess(data);
}

export async function createNet(data: NetInput): Promise<ActionState> {
  mockCreate('nets', data);
  revalidatePath('/nets');
  return createSuccess();
}

export async function updateNet(id: string, data: NetInput): Promise<ActionState> {
  mockUpdate('nets', id, data);
  revalidatePath('/nets');
  return createSuccess();
}

export async function deleteNet(id: string): Promise<ActionState> {
  mockDelete('nets', id);
  revalidatePath('/nets');
  return createSuccess();
}
