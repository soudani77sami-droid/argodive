'use server';

import { prisma } from '@argodive/shared';
import { createSuccess, createError } from '@/lib/actions';
import type { ActionState } from '@/lib/actions';
import { revalidatePath } from 'next/cache';

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
  try {
    const data = await prisma.inspection.findMany({
      include: { cage: true, conductedBy: true },
      orderBy: { scheduledDate: 'desc' },
    });
    return createSuccess(data);
  } catch {
    return createError('Failed to fetch inspections');
  }
}

export async function createInspection(data: InspectionInput): Promise<ActionState> {
  try {
    await prisma.inspection.create({
      data: {
        title: data.title,
        cageId: data.cageId,
        inspectionType: data.inspectionType as any,
        description: data.description,
        scheduledDate: new Date(data.scheduledDate),
        healthScore: data.healthScore,
        findings: data.findings,
        recommendations: data.recommendations,
        status: data.status as any,
      },
    });
    revalidatePath('/inspections');
    return createSuccess();
  } catch {
    return createError('Failed to create inspection');
  }
}

export async function updateInspection(id: string, data: InspectionInput): Promise<ActionState> {
  try {
    await prisma.inspection.update({
      where: { id },
      data: {
        title: data.title,
        cageId: data.cageId,
        inspectionType: data.inspectionType as any,
        description: data.description,
        scheduledDate: new Date(data.scheduledDate),
        healthScore: data.healthScore,
        findings: data.findings,
        recommendations: data.recommendations,
        status: data.status as any,
      },
    });
    revalidatePath('/inspections');
    return createSuccess();
  } catch {
    return createError('Failed to update inspection');
  }
}

export async function deleteInspection(id: string): Promise<ActionState> {
  try {
    await prisma.inspection.delete({ where: { id } });
    revalidatePath('/inspections');
    return createSuccess();
  } catch {
    return createError('Failed to delete inspection');
  }
}
