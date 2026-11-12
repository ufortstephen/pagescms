"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { useTranslation } from 'react-i18next';

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  const { t } = useTranslation();
  return (
    <nav
      role="navigation"
      aria-label={t('pagination.aria_label')}
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />
  );
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Partial<Pick<VariantProps<typeof buttonVariants>, "size">> &
  React.ComponentProps<typeof Link>;

function PaginationLink({
  className,
  isActive,
  size = "icon-sm",
  ...props
}: PaginationLinkProps) {
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  iconOnly = false,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { iconOnly?: boolean }) {
  const { t } = useTranslation();
  return (
    <PaginationLink
      aria-label={t('pagination.previous_page_label')}
      size={iconOnly ? "icon-sm" : "default"}
      className={cn(iconOnly ? "size-8" : "gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      {iconOnly ? <span className="sr-only">{t('pagination.previous_button')}</span> : <span className="hidden sm:block">{t('pagination.previous_button')}</span>}
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  iconOnly = false,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { iconOnly?: boolean }) {
  const { t } = useTranslation();
  return (
    <PaginationLink
      aria-label={t('pagination.next_page_label')}
      size={iconOnly ? "icon-sm" : "default"}
      className={cn(iconOnly ? "size-8" : "gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      {iconOnly ? <span className="sr-only">{t('pagination.next_button')}</span> : <span className="hidden sm:block">{t('pagination.next_button')}</span>}
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { t } = useTranslation();
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">{t('pagination.ellipsis_label')}</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
