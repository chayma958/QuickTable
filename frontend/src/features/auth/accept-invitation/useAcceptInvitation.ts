import { acceptInvitation, getInvitationByToken } from '@api/invitations.api';
import { useToast } from '@store/toast-context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { AcceptInvitationFormValues } from './accept-invitation.schema';

export function useAcceptInvitation(token: string) {
  const toast = useToast();
  const navigate = useNavigate();

  const invitationQuery = useQuery({
    queryKey: ['invitation', token],
    queryFn: () => getInvitationByToken(token),
    retry: false,
  });

  const acceptMutation = useMutation({
    mutationFn: (values: AcceptInvitationFormValues) => acceptInvitation(token, values.password),
    onSuccess: () => {
      toast.success('Account activated — please sign in.');
      navigate('/login', { replace: true });
    },
    onError: () => {
      toast.error('Could not activate your account. The link may have expired.');
    },
  });

  return {
    invitation: invitationQuery.data,
    isLoading: invitationQuery.isLoading,
    isError: invitationQuery.isError,
    submit: (values: AcceptInvitationFormValues) => acceptMutation.mutateAsync(values),
    isSubmitting: acceptMutation.isPending,
  };
}
