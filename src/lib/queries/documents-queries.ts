import {
  createDocument,
  deleteDocument,
  updateDocument
} from '@/app/actions/documents-actions';
import { documentService } from '@/lib/services/document-service';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useDocuments() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['documents', userId],
    queryFn: () => documentService.getDocuments(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000
  });
}

export function useDocument(documentId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentService.getDocument(documentId, userId!),
    enabled: !!userId && !!documentId,
    staleTime: 5 * 60 * 1000
  });
}

export function useProjectDocuments(projectId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['documents', 'project', projectId],
    queryFn: () => documentService.getProjectDocuments(projectId, userId!),
    enabled: !!userId && !!projectId,
    staleTime: 5 * 60 * 1000
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocument,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    }
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      formData
    }: {
      documentId: string;
      formData: FormData;
    }) => updateDocument(documentId, formData),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({
          queryKey: ['document', variables.documentId]
        });
      }
    }
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    }
  });
}
