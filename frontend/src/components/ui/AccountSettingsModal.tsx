import { changeMyPassword, updateMyProfile } from '@api/auth.api';
import { uploadImage } from '@api/uploads.api';
import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';
import { useAuth } from '@store/auth-context';
import { useToast } from '@store/toast-context';
import { useMutation } from '@tanstack/react-query';
import { Camera } from 'lucide-react';
import { useState } from 'react';

function errorMessage(err: unknown, fallback: string): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;
}

export function AccountSettingsModal({ onClose }: { onClose: () => void }) {
  const { actor, updateActor } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(actor?.name ?? '');
  const [email, setEmail] = useState(actor?.email ?? '');
  const [avatarUrl, setAvatarUrl] = useState(actor?.avatarUrl ?? null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const profileMutation = useMutation({
    mutationFn: () => updateMyProfile({ name, email, avatarUrl: avatarUrl ?? undefined }),
    onSuccess: (updated) => {
      updateActor({ name: updated.name, email: updated.email, avatarUrl: updated.avatarUrl });
      toast.success('Profile updated');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not update your profile')),
  });

  const passwordMutation = useMutation({
    mutationFn: () => changeMyPassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError(null);
    },
    onError: (err) => setPasswordError(errorMessage(err, 'Could not update your password')),
  });

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const url = await uploadImage(file, 'avatars');
      setAvatarUrl(url);
    } catch {
      toast.error('Could not upload that photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    passwordMutation.mutate();
  }

  return (
    <Modal title="Account settings" onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-brand-light text-lg font-bold text-brand-dark">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                (actor?.name ?? '?').charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text hover:bg-bg-subtle">
              <Camera size={12} />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
          <span className="text-sm text-text-muted">
            {isUploadingPhoto ? 'Uploading…' : 'Click the camera icon to change your photo'}
          </span>
        </div>

        <form
          className={f.form}
          onSubmit={(e) => {
            e.preventDefault();
            profileMutation.mutate();
          }}
        >
          <div className={f.field}>
            <label className={f.label} htmlFor="account-name">
              Name
            </label>
            <input
              id="account-name"
              className={f.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={f.field}>
            <label className={f.label} htmlFor="account-email">
              Email
            </label>
            <input
              id="account-email"
              type="email"
              className={f.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={f.actions}>
            <button type="submit" className={f.primaryButton} disabled={profileMutation.isPending}>
              {profileMutation.isPending ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>

        <div className="border-t border-border pt-5">
          <span className="mb-3 block text-sm font-bold text-text">Change password</span>
          <form className={f.form} onSubmit={handlePasswordSubmit}>
            <div className={f.field}>
              <label className={f.label} htmlFor="current-password">
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                className={f.input}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className={f.row}>
              <div className={f.field}>
                <label className={f.label} htmlFor="new-password">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  className={f.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <div className={f.field}>
                <label className={f.label} htmlFor="confirm-password">
                  Confirm new password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className={f.input}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
            </div>
            {passwordError && <span className={f.error}>{passwordError}</span>}
            <div className={f.actions}>
              <button type="submit" className={f.primaryButton} disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
