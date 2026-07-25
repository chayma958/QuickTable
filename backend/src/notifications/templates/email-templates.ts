const WRAPPER = (title: string, bodyHtml: string) => `
  <div style="font-family: -apple-system, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #0f172a;">
    <h1 style="font-size: 18px; margin-bottom: 16px;">${title}</h1>
    ${bodyHtml}
    <p style="margin-top: 32px; font-size: 12px; color: #64748b;">Sent by QuickTable</p>
  </div>
`;

export function invitationEmail(params: {
  restaurantName: string;
  inviterName: string;
  role: string;
  inviteUrl: string;
}) {
  return WRAPPER(
    `You've been invited to join ${params.restaurantName} on QuickTable`,
    `
      <p>${params.inviterName} has invited you to join <strong>${params.restaurantName}</strong> as a <strong>${params.role.toLowerCase()}</strong>.</p>
      <a href="${params.inviteUrl}" style="display: inline-block; margin-top: 16px; padding: 10px 16px; background: #059669; color: white; border-radius: 6px; text-decoration: none; font-weight: 600;">
        Accept invitation
      </a>
      <p style="margin-top: 24px; font-size: 12px; color: #64748b;">This invitation link expires in 7 days.</p>
    `,
  );
}

export function passwordResetEmail(params: { resetUrl: string }) {
  return WRAPPER(
    'Reset your QuickTable password',
    `
      <p>We received a request to reset your password. If this was you, click below to choose a new one.</p>
      <a href="${params.resetUrl}" style="display: inline-block; margin-top: 16px; padding: 10px 16px; background: #059669; color: white; border-radius: 6px; text-decoration: none; font-weight: 600;">
        Reset password
      </a>
      <p style="margin-top: 24px; font-size: 12px; color: #64748b;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
  );
}
