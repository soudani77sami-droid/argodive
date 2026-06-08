'use server';

import { prisma } from '@argodive/shared';
import { createSuccess, createError } from '@/lib/actions';
import type { ActionState } from '@/lib/actions';
import { revalidatePath } from 'next/cache';

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
  try {
    const data = await prisma.net.findMany({
      include: { cage: true },
      orderBy: { netNumber: 'asc' },
    });
    return createSuccess(data);
  } catch {
    return createError('Failed to fetch nets');
  }
}

export async function createNet(data: NetInput): Promise<ActionState> {
  try {
    await prisma.net.create({
      data: {
        netNumber: data.netNumber,
        cageId: data.cageId,
        meshSize: data.meshSize,
        material: data.material as any,
        depth: data.depth,
        circumference: data.circumference,
        condition: data.condition as any,
        installationDate: data.installationDate ? new Date(data.installationDate) : undefined,
        notes: data.notes,
      },
    });
    revalidatePath('/nets');
    return createSuccess();
  } catch {
    return createError('Failed to create net');
  }
}

export async function updateNet(id: string, data: NetInput): Promise<ActionState> {
  try {
    await prisma.net.update({
      where: { id },
      data: {
        netNumber: data.netNumber,
        cageId: data.cageId,
        meshSize: data.meshSize,
        material: data.material as any,
        depth: data.depth,
        circumference: data.circumference,
        condition: data.condition as any,
        installationDate: data.installationDate ? new Date(data.installationDate) : undefined,
        notes: data.notes,
      },
    });
    revalidatePath('/nets');
    return createSuccess();
  } catch {
    return createError('Failed to update net');
  }
}

export async function deleteNet(id: string): Promise<ActionState> {
  try {
    await prisma.net.delete({ where: { id } });
    revalidatePath('/nets');
    return createSuccess();
  } catch {
    return createError('Failed to delete net');
  }
}
