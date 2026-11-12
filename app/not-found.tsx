import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getTranslation } from '../i18n.server';

export default async function NotFound() {
  const { t } = await getTranslation();
  return (
    <Empty className="absolute inset-0 border-0 rounded-none">
      <EmptyHeader>
        <EmptyTitle>{t('not_found.page_title')}</EmptyTitle>
        <EmptyDescription>{t('not_found.page_description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link className={buttonVariants({ variant: "default" })} href="/">
          {t('admin.go_home_link')}
        </Link>
      </EmptyContent>
    </Empty>
  )
}
