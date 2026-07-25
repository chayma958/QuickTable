import type { Invitation } from '@models/index';
import { useToast } from '@store/toast-context';
import { Check, Copy, Mail, X } from 'lucide-react';
import { useState } from 'react';
import { ROLE_LABELS } from '../employee.schema';

export function PendingInvitationsPanel({
  invitations,
  onRevoke,
}: {
  invitations: Invitation[];
  onRevoke: (id: string) => void;
}) {
  const toast = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const pending = invitations.filter((invite) => invite.status === 'PENDING');

  if (pending.length === 0) return null;

  async function copyLink(invite: Invitation) {
    if (!invite.inviteUrl) return;
    await navigator.clipboard.writeText(invite.inviteUrl);
    setCopiedId(invite.id);
    toast.success('Invite link copied');
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="mb-5 rounded-xl border border-border bg-bg-subtle p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-text">
        <Mail size={16} className="text-brand" />
        Pending invitations
      </div>
      <p className="mb-3 text-xs text-text-muted">
        Dev fallback: invite links are always shown here and logged server-side, even if email
        delivery isn&apos;t configured.
      </p>
      <div className="flex flex-col gap-2">
        {pending.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-bg p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-text">{invite.name}</div>
              <div className="truncate text-xs text-text-muted">
                {invite.email} · {ROLE_LABELS[invite.role as keyof typeof ROLE_LABELS]}
              </div>
            </div>
            {invite.inviteUrl && (
              <button
                type="button"
                onClick={() => copyLink(invite)}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
              >
                {copiedId === invite.id ? (
                  <>
                    <Check size={13} className="text-success" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy link
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => onRevoke(invite.id)}
              aria-label="Revoke invitation"
              className="flex shrink-0 items-center justify-center rounded-lg border border-danger px-2 py-1.5 text-danger hover:bg-danger/10"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
