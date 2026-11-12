"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

export function AdminButton() {
  const { t } = useTranslation();
  const { user } = useUser();

  if (!user?.isAdmin) return null;

  return (
    <Button asChild variant="ghost" size="icon-sm" className="rounded-full">
      <Link href="/admin" aria-label={t('admin.aria_label_panel')}>
        <Settings className="size-4" />
      </Link>
    </Button>
  );
}
