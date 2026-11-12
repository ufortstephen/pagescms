import { Loader } from "@/components/loader";
import { getTranslation } from '../../i18n.server';

export default async function Loading() {
  const { t } = await getTranslation();
  return <Loader className="absolute inset-0 text-muted-foreground text-sm bg-background rounded-md">{t('loading.page_indicator')}</Loader>;
}
