'use server';

import { documentService } from '@/lib/services/document-service';
import { auth } from '@clerk/nextjs';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createDocument(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      filename: formData.get('filename') as string,
      originalName: formData.get('originalName') as string,
      mimeType: formData.get('mimeType') as string,
      size: Number(formData.get('size')),
      url: formData.get('url') as string,
      type: (formData.get('type') as string) || undefined,
      description: (formData.get('description') as string) || undefined,
      projectId: (formData.get('projectId') as string) || undefined,
      partnerId: (formData.get('partnerId') as string) || undefined,
      contractId: (formData.get('contractId') as string) || undefined,
      tags: formData.get('tags')
        ? (formData.get('tags') as string).split(',').map((tag) => tag.trim())
        : [],
      isPublic: formData.get('isPublic') === 'true'
    };

    const document = await documentService.createDocument({
      ...rawData,
      createdBy: userId,
      keywords: [],
      entities: [],
      processingStatus: 'pending'
    });

    revalidateTag('documents');
    revalidatePath('/dashboard');

    return { success: true, data: document };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateDocument(documentId: string, formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      description: (formData.get('description') as string) || undefined,
      type: (formData.get('type') as string) || undefined,
      tags: formData.get('tags')
        ? (formData.get('tags') as string).split(',').map((tag) => tag.trim())
        : [],
      extractedText: (formData.get('extractedText') as string) || undefined,
      summary: (formData.get('summary') as string) || undefined,
      processingStatus:
        (formData.get('processingStatus') as string) || undefined,
      isPublic: formData.get('isPublic') === 'true'
    };

    await documentService.updateDocument(
      documentId,
      {
        ...rawData,
        updatedBy: userId
      },
      userId
    );

    revalidateTag('documents');
    revalidateTag(`document-${documentId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deleteDocument(documentId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    await documentService.deleteDocument(documentId, userId);

    revalidateTag('documents');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
