'use server';

import { partnerService } from '@/lib/services/partner-service';
import { auth } from '@clerk/nextjs';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createPartner(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      relationship: (formData.get('relationship') as string) || 'prospect',
      status: (formData.get('status') as string) || 'active',
      description: (formData.get('description') as string) || undefined,
      contactInfo: {
        email: (formData.get('email') as string) || undefined,
        phone: (formData.get('phone') as string) || undefined,
        website: (formData.get('website') as string) || undefined
      },
      tags: formData.get('tags')
        ? (formData.get('tags') as string).split(',').map((tag) => tag.trim())
        : [],
      rating: formData.get('rating')
        ? Number(formData.get('rating'))
        : undefined,
      notes: (formData.get('notes') as string) || undefined
    };

    const partner = await partnerService.createPartner({
      ...rawData,
      createdBy: userId,
      projectIds: [],
      documentIds: [],
      collaborationIds: [],
      contractIds: []
    });

    revalidateTag('partners');
    revalidatePath('/dashboard');

    return { success: true, data: partner };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updatePartner(partnerId: string, formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      relationship: formData.get('relationship') as string,
      status: formData.get('status') as string,
      description: (formData.get('description') as string) || undefined,
      contactInfo: {
        email: (formData.get('email') as string) || undefined,
        phone: (formData.get('phone') as string) || undefined,
        website: (formData.get('website') as string) || undefined
      },
      tags: formData.get('tags')
        ? (formData.get('tags') as string).split(',').map((tag) => tag.trim())
        : [],
      rating: formData.get('rating')
        ? Number(formData.get('rating'))
        : undefined,
      notes: (formData.get('notes') as string) || undefined
    };

    await partnerService.updatePartner(
      partnerId,
      {
        ...rawData,
        updatedBy: userId
      },
      userId
    );

    revalidateTag('partners');
    revalidateTag(`partner-${partnerId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deletePartner(partnerId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    await partnerService.deletePartner(partnerId, userId);

    revalidateTag('partners');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
