"use client";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

const ViewComponent = ({ value }: { value: boolean}) => {
  const { t } = useTranslation();
  if (value == null) return null;
  
  const firstValue = Array.isArray(value) ? value[0] : value;
  if (firstValue == null) return null;
  const extraValuesCount = Array.isArray(value) ? value.length - 1 : 0;

  return (
    <span className="flex items-center gap-x-1.5">
      {firstValue
        ? <Badge variant="secondary">{t('core.boolean.true_badge')}</Badge>
        : <Badge variant="secondary" className="text-muted-foreground">{t('core.boolean.false_badge')}</Badge>
      }
      {extraValuesCount > 0 && (
        <span className="text-muted-foreground text-xs">
          +{extraValuesCount}
        </span>
      )}
    </span>
  );
};

export { ViewComponent };
