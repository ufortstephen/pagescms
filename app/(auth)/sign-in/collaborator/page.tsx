import { InviteSignIn } from "@/components/invite-sign-in";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { getTranslation } from '../../../../i18n.server';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { t } = await getTranslation();
  const { token } = await searchParams;

  if (!token?.trim()) {
    return (
      <Empty className="absolute inset-0 border-0 rounded-none">
        <EmptyHeader>
          <EmptyTitle>{t('auth.collaborator.invite_unavailable')}</EmptyTitle>
          <EmptyDescription>{t('auth.collaborator.invalid_invite_link')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <InviteSignIn token={token.trim()} />;
}
