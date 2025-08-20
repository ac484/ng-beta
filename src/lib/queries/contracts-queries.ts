import {
  createContract,
  deleteContract,
  updateContract
} from '@/app/actions/contracts-actions';
import { contractService } from '@/lib/services/contract-service';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useContracts() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['contracts', userId],
    queryFn: () => contractService.getContracts(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000
  });
}

export function useContract(contractId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['contract', contractId],
    queryFn: () => contractService.getContract(contractId, userId!),
    enabled: !!userId && !!contractId,
    staleTime: 5 * 60 * 1000
  });
}

export function useProjectContracts(projectId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['contracts', 'project', projectId],
    queryFn: () => contractService.getProjectContracts(projectId, userId!),
    enabled: !!userId && !!projectId,
    staleTime: 5 * 60 * 1000
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContract,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['contracts'] });
      }
    }
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contractId,
      formData
    }: {
      contractId: string;
      formData: FormData;
    }) => updateContract(contractId, formData),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['contracts'] });
        queryClient.invalidateQueries({
          queryKey: ['contract', variables.contractId]
        });
      }
    }
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContract,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['contracts'] });
      }
    }
  });
}
