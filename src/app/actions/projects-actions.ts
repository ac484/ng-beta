'use server';

import { projectService } from '@/lib/services/project-service';
import {
  projectCreateSchema,
  projectUpdateSchema,
  subtaskCreateSchema,
  subtaskUpdateSchema,
  taskCreateSchema,
  taskUpdateSchema
} from '@/lib/validations/projects.schemas';
import { auth } from '@clerk/nextjs';
import { revalidatePath, revalidateTag } from 'next/cache';

// Projects
export async function createProject(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as string,
      startDate: new Date(formData.get('startDate') as string),
      endDate: formData.get('endDate')
        ? new Date(formData.get('endDate') as string)
        : undefined,
      tags: formData.get('tags')
        ? (formData.get('tags') as string).split(',').map((tag) => tag.trim())
        : [],
      partnerId: (formData.get('partnerId') as string) || undefined
    };

    const validatedData = projectCreateSchema.parse(rawData);

    const project = await projectService.createProject({
      ...validatedData,
      createdBy: userId,
      documentIds: [],
      taskIds: [],
      contractIds: []
    });

    revalidateTag('projects');
    revalidatePath('/dashboard');

    return { success: true, data: project };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateProject(projectId: string, formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string,
      priority: formData.get('priority') as string,
      progress: Number(formData.get('progress')),
      endDate: formData.get('endDate')
        ? new Date(formData.get('endDate') as string)
        : undefined,
      tags: formData.get('tags')
        ? (formData.get('tags') as string).split(',').map((tag) => tag.trim())
        : []
    };

    const validatedData = projectUpdateSchema.parse(rawData);

    await projectService.updateProject(
      projectId,
      {
        ...validatedData,
        updatedBy: userId
      },
      userId
    );

    revalidateTag('projects');
    revalidateTag(`project-${projectId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deleteProject(projectId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    await projectService.deleteProject(projectId, userId);

    revalidateTag('projects');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Tasks
export async function createTask(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      priority: formData.get('priority') as string,
      dueDate: formData.get('dueDate')
        ? new Date(formData.get('dueDate') as string)
        : undefined,
      assignedTo: (formData.get('assignedTo') as string) || undefined,
      projectId: formData.get('projectId') as string
    };

    const validatedData = taskCreateSchema.parse(rawData);

    const task = await projectService.createTask({
      ...validatedData,
      createdBy: userId,
      subtaskIds: []
    });

    revalidateTag('tasks');
    revalidateTag(`project-${validatedData.projectId}`);
    revalidatePath('/dashboard');

    return { success: true, data: task };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateTask(taskId: string, formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      status: formData.get('status') as string,
      priority: formData.get('priority') as string,
      dueDate: formData.get('dueDate')
        ? new Date(formData.get('dueDate') as string)
        : undefined,
      assignedTo: (formData.get('assignedTo') as string) || undefined
    };

    const validatedData = taskUpdateSchema.parse(rawData);

    await projectService.updateTask(
      taskId,
      {
        ...validatedData,
        updatedBy: userId
      },
      userId
    );

    revalidateTag('tasks');
    revalidateTag(`task-${taskId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deleteTask(taskId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    await projectService.deleteTask(taskId, userId);

    revalidateTag('tasks');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Subtasks
export async function createSubtask(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      taskId: formData.get('taskId') as string,
      aiGenerated: formData.get('aiGenerated') === 'true'
    };

    const validatedData = subtaskCreateSchema.parse(rawData);

    const subtask = await projectService.createSubtask({
      ...validatedData,
      createdBy: userId
    });

    revalidateTag('subtasks');
    revalidateTag(`task-${validatedData.taskId}`);
    revalidatePath('/dashboard');

    return { success: true, data: subtask };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateSubtask(subtaskId: string, formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      completed: formData.get('completed') === 'true'
    };

    const validatedData = subtaskUpdateSchema.parse(rawData);

    await projectService.updateSubtask(
      subtaskId,
      {
        ...validatedData,
        updatedBy: userId
      },
      userId
    );

    revalidateTag('subtasks');
    revalidateTag(`subtask-${subtaskId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deleteSubtask(subtaskId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    await projectService.deleteSubtask(subtaskId, userId);

    revalidateTag('subtasks');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Utility actions
export async function updateProjectProgress(projectId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const progress = await projectService.getProjectProgress(projectId, userId);

    await projectService.updateProject(
      projectId,
      {
        progress,
        updatedBy: userId
      },
      userId
    );

    revalidateTag(`project-${projectId}`);
    revalidatePath('/dashboard');

    return { success: true, progress };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
