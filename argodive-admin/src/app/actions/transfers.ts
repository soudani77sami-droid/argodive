'use server';

import { prisma } from '@argodive/shared';
import { createSuccess, createError } from '@/lib/actions';
import type { ActionState } from '@/lib/actions';
import { revalidatePath } from 'next/cache';

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
  try {
    const data = await prisma.fishTransfer.findMany({
      include: {
        fromCage: true,
        toCage: true,
        species: true,
        performedBy: true,
      },
      orderBy: { scheduledDate: 'desc' },
    });
    return createSuccess(data);
  } catch {
    return createError('Failed to fetch transfers');
  }
}

export async function createTransfer(data: TransferInput): Promise<ActionState> {
  try {
    await prisma.fishTransfer.create({
      data: {
        fromCageId: data.fromCageId,
        toCageId: data.toCageId,
        speciesId: data.speciesId,
        fishCount: data.fishCount,
        avgWeight: data.avgWeight,
        reason: data.reason as any,
        scheduledDate: new Date(data.scheduledDate),
        notes: data.notes,
      },
    });
    revalidatePath('/transfers');
    return createSuccess();
  } catch {
    return createError('Failed to create transfer');
  }
}

export async function updateTransfer(id: string, data: TransferInput): Promise<ActionState> {
  try {
    await prisma.fishTransfer.update({
      where: { id },
      data: {
        fromCageId: data.fromCageId,
        toCageId: data.toCageId,
        speciesId: data.speciesId,
        fishCount: data.fishCount,
        avgWeight: data.avgWeight,
        reason: data.reason as any,
        scheduledDate: new Date(data.scheduledDate),
        notes: data.notes,
      },
    });
    revalidatePath('/transfers');
    return createSuccess();
  } catch {
    return createError('Failed to update transfer');
  }
}

export async function deleteTransfer(id: string): Promise<ActionState> {
  try {
    await prisma.fishTransfer.delete({ where: { id } });
    revalidatePath('/transfers');
    return createSuccess();
  } catch {
    return createError('Failed to delete transfer');
  }
}
