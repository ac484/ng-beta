'use server';

import { contractService } from '@/lib/services/contract-service';
import { auth } from '@clerk/nextjs';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createContract(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      type: formData.get('type') as string,
      status: (formData.get('status') as string) || 'draft',
      startDate: new Date(formData.get('startDate') as string),
      endDate: formData.get('endDate')
        ? new Date(formData.get('endDate') as string)
        : undefined,
      value: formData.get('value') ? Number(formData.get('value')) : undefined,
      currency: (formData.get('currency') as string) || undefined,
      projectId: (formData.get('projectId') as string) || undefined,
      partnerId: (formData.get('partnerId') as string) || undefined,
      reminderDays: formData.get('reminderDays')
        ? (formData.get('reminderDays') as string)
            .split(',')
            .map((d) => Number(d.trim()))
        : undefined
    };

    const contract = await contractService.createContract({
      ...rawData,
      createdBy: userId,
      keyTerms: []
    });

    revalidateTag('contracts');
    revalidatePath('/dashboard');

    return { success: true, data: contract };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateContract(contractId: string, formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      status: formData.get('status') as string,
      endDate: formData.get('endDate')
        ? new Date(formData.get('endDate') as string)
        : undefined,
      value: formData.get('value') ? Number(formData.get('value')) : undefined,
      summary: (formData.get('summary') as string) || undefined,
      riskLevel: (formData.get('riskLevel') as string) || undefined
    };

    await contractService.updateContract(
      contractId,
      {
        ...rawData,
        updatedBy: userId
      },
      userId
    );

    revalidateTag('contracts');
    revalidateTag(`contract-${contractId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deleteContract(contractId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    await contractService.deleteContract(contractId, userId);

    revalidateTag('contracts');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
