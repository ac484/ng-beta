import {
  createProject,
  createSubtask,
  createTask,
  deleteProject,
  deleteSubtask,
  deleteTask,
  updateProject,
  updateProjectProgress,
  updateSubtask,
  updateTask
} from '@/app/actions/projects-actions';
import { projectService } from '@/lib/services/project-service';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Projects
export function useProjects() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['projects', userId],
    queryFn: () => projectService.getProjects(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useProject(projectId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProject(projectId, userId!),
    enabled: !!userId && !!projectId,
    staleTime: 5 * 60 * 1000
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    }
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      formData
    }: {
      projectId: string;
      formData: FormData;
    }) => updateProject(projectId, formData),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({
          queryKey: ['project', variables.projectId]
        });
      }
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    }
  });
}

// Tasks
export function useProjectTasks(projectId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => projectService.getProjectTasks(projectId, userId!),
    enabled: !!userId && !!projectId,
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
}

export function useTask(taskId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => projectService.getTask(taskId, userId!),
    enabled: !!userId && !!taskId,
    staleTime: 2 * 60 * 1000
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      formData
    }: {
      taskId: string;
      formData: FormData;
    }) => updateTask(taskId, formData),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
      }
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    }
  });
}

// Subtasks
export function useTaskSubtasks(taskId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['subtasks', taskId],
    queryFn: () => projectService.getTaskSubtasks(taskId, userId!),
    enabled: !!userId && !!taskId,
    staleTime: 1 * 60 * 1000 // 1 minute
  });
}

export function useSubtask(subtaskId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['subtask', subtaskId],
    queryFn: () => projectService.getSubtask(subtaskId, userId!),
    enabled: !!userId && !!subtaskId,
    staleTime: 1 * 60 * 1000
  });
}

export function useCreateSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubtask,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['subtasks'] });
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    }
  });
}

export function useUpdateSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subtaskId,
      formData
    }: {
      subtaskId: string;
      formData: FormData;
    }) => updateSubtask(subtaskId, formData),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['subtasks'] });
        queryClient.invalidateQueries({
          queryKey: ['subtask', variables.subtaskId]
        });
      }
    }
  });
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubtask,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['subtasks'] });
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    }
  });
}

// Utility hooks
export function useUpdateProjectProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectProgress,
    onSuccess: (data, projectId) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    }
  });
}
