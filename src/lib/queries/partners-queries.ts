import {
  createPartner,
  deletePartner,
  updatePartner
} from '@/app/actions/partners-actions';
import { partnerService } from '@/lib/services/partner-service';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePartners() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['partners', userId],
    queryFn: () => partnerService.getPartners(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000
  });
}

export function usePartner(partnerId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['partner', partnerId],
    queryFn: () => partnerService.getPartner(partnerId, userId!),
    enabled: !!userId && !!partnerId,
    staleTime: 5 * 60 * 1000
  });
}

export function usePartnersByType(type: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['partners', 'type', type, userId],
    queryFn: () => partnerService.getPartnersByType(type as any, userId!),
    enabled: !!userId && !!type,
    staleTime: 5 * 60 * 1000
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPartner,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['partners'] });
      }
    }
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      partnerId,
      formData
    }: {
      partnerId: string;
      formData: FormData;
    }) => updatePartner(partnerId, formData),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['partners'] });
        queryClient.invalidateQueries({
          queryKey: ['partner', variables.partnerId]
        });
      }
    }
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePartner,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['partners'] });
      }
    }
  });
}
