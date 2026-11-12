"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useUser } from "@/contexts/user-context";
import { getGithubInstallationUrl } from "@/lib/github-app";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronsUpDown, LockKeyhole, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasGithubIdentity } from "@/lib/authz-shared";
import { requireApiSuccess } from "@/lib/api-client";
import { useTranslation } from 'react-i18next';

export function RepoSelect({
  onAccountSelect
}: {
  onAccountSelect?: (account: any) => void
}) {
  const { t } = useTranslation();
  const { user } = useUser();
  const isGithubUser = hasGithubIdentity(user);

  const accounts = useMemo(() => {
    if (!user) return [];
    return user.accounts || [];
  }, [user]);

  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword] = useDebounce(
    selectedAccount?.repositorySelection === "all" ? keyword : "",
    500
  );
  const [results, setResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const searchResults = useMemo(() => {
    if (!results) return [];
    if (selectedAccount?.repositorySelection !== "all") {
      return results.filter((result: any) => result.repo.toLowerCase().includes(keyword.toLowerCase()));
    }
    return results;
  }, [results, keyword, selectedAccount]);

  const selectedAccountInstallationUrl = useMemo(() => {
    if (!selectedAccount) return null;
    return getGithubInstallationUrl(selectedAccount);
  }, [selectedAccount]);

  const displayedKeyword = useMemo(() => {
    if (selectedAccount?.repositorySelection === "all") return debouncedKeyword.trim();
    return keyword.trim();
  }, [debouncedKeyword, keyword, selectedAccount]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!selectedAccount) return;
  
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
  
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          type: selectedAccount.type,
          keyword: debouncedKeyword,
          repository_selection: selectedAccount.repositorySelection
        });
  
        const response = await fetch(
          `/api/repos/${selectedAccount.login}?${params.toString()}`,
          { signal: abortControllerRef.current.signal }
        );
        const data = await requireApiSuccess<{ status: string; data: any[]; message?: string }>(
          response,
          "Failed to fetch repos",
        );
  
        setResults(data.data);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error(error);
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [debouncedKeyword, selectedAccount]);

  const resultsLoadingSkeleton = useMemo(() => (
    <ul>
      {[...Array(5)].map((_, index) => (
        <li key={index} className="flex gap-x-2 items-center border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md px-3 py-2 text-sm">
          <Skeleton className="h-5 w-24 text-left rounded" />
          <Skeleton className="h-5 w-24 text-left rounded" />
          <Button variant="outline" size="xs" className="ml-auto" disabled>
            {t('repo.latest.open_link')}
          </Button>
        </li>
      ))}
    </ul>
  ), []);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex w-full max-w items-center gap-x-2">
        <ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <img className="size-6 rounded" src={`https://github.com/${selectedAccount?.login}.png`} alt={t('repo_select.login_avatar_alt', { login: selectedAccount?.login })}/>
                <span className="mr-2">{selectedAccount?.login}</span>
                <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {accounts.map((account: any) => (
                <DropdownMenuItem
                  key={`${account.login}-${account.installationId}`}
                  onSelect={() => {
                    setSelectedAccount(account);
                    if (onAccountSelect) onAccountSelect(account);
                  }}
                >
                  <img className="size-6 rounded" src={`https://github.com/${account.login}.png`} alt={t('repo_select.login_avatar_alt', { login: account.login })}/>
                  <span className="truncate">{account.login}</span>
                </DropdownMenuItem>
              ))}
              {isGithubUser &&
                <>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem asChild>
                    <Link href="/api/github-app/install">{t('repo_select.manage_github_accounts_link')}</Link>
                  </DropdownMenuItem>
                </>
              }
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedAccountInstallationUrl && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" })
                  )}
                  href={selectedAccountInstallationUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t('repo_select.manage_login_installation_settings_aria_label', { login: selectedAccount.login })}
                >
                  <Settings />
                </a>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>{t('repo_select.manage_github_app_tooltip')}</TooltipContent>
            </Tooltip>
          )}
        </ButtonGroup>
        <div className="relative flex-1"> 
          <Input
            placeholder={t('repo_select.search_repositories_input_placeholder')}
            className="pl-9"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"/>
        </div>
      </div>
      {isLoading || results === null
        ? resultsLoadingSkeleton
        : searchResults.length > 0
          ? <ul>
              {searchResults.map((result: any) => (
                <li key={`${result.owner}/${result.repo}`} className="flex gap-x-2 items-center border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md px-3 py-2 text-sm">
                  <Link
                    className="truncate font-medium hover:underline"
                    href={`/${result.owner}/${result.repo}/${result.defaultBranch ? encodeURIComponent(result.defaultBranch) : ""}`}
                  >{result.repo}</Link>
                  {result.private && <LockKeyhole className="h-3 w-3 opacity-50"/>}
                  {result.updatedAt &&
                    <div className="text-muted-foreground truncate">{formatDistanceToNow(new Date(result.updatedAt))} {t('repo.latest.ago')}</div>
                  }
                  <Link
                    className={cn("ml-auto", buttonVariants({ variant: "outline", size: "xs"}))}
                    href={`/${result.owner}/${result.repo}/${result.defaultBranch ? encodeURIComponent(result.defaultBranch) : ""}`}
                  >
                    {t('repo.latest.open_link')}
                  </Link>
                </li>
              ))}
            </ul>
          : <Empty className="h-[206px] flex-none bg-accent p-4 md:p-6">
              <EmptyHeader>
                <EmptyTitle>{t('repo_select.no_projects_title')}</EmptyTitle>
                <EmptyDescription>
                  {t('repo_select.no_projects_description')}
                </EmptyDescription>
              </EmptyHeader>
              {selectedAccountInstallationUrl && (
                <EmptyContent>
                  <a
                    href={selectedAccountInstallationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    {t('repo_select.manage_github_app_tooltip')}
                  </a>
                </EmptyContent>
              )}
            </Empty>
      }
    </div>
  );
}
