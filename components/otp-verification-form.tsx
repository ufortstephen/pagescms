"use client";

import type { FormEvent } from "react";
import { Loader } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTranslation } from 'react-i18next';

type OtpVerificationFormProps = {
  busy: boolean;
  emailLabel: string;
  otp: string;
  pending: boolean;
  resendDisabled?: boolean;
  resendPending?: boolean;
  submitLabel?: string;
  onChange: (value: string) => void;
  onResend: () => void;
  onSignInAnotherWay?: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function OtpVerificationForm({
  busy,
  emailLabel,
  otp,
  pending,
  resendDisabled,
  resendPending,
  submitLabel = "Verify code",
  onChange,
  onResend,
  onSignInAnotherWay,
  onSubmit,
}: OtpVerificationFormProps) {
  const { t } = useTranslation();
  return (
    <form className="flex w-full flex-col items-center gap-6" onSubmit={onSubmit}>
      <div className="space-y-2 text-center">
        <h1 className="text-lg font-medium tracking-tight">
          {t('otp_verification.verify_login_heading')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('otp_verification.enter_code_description', { emailLabel })}
        </p>
      </div>

      <InputOTP
        autoFocus
        disabled={pending}
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={otp}
        onChange={onChange}
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, index) => (
            <InputOTPSlot
              className="size-10 font-mono text-lg"
              index={index}
              key={index}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div className="w-full space-y-2">
        <Button className="w-full" disabled={busy || otp.length !== 6} type="submit">
          {submitLabel}
          {pending && <Loader className="size-4 animate-spin" />}
        </Button>
        <Button
          className="w-full"
          disabled={busy || resendDisabled}
          onClick={onResend}
          type="button"
          variant="ghost"
        >
          {t('otp_verification.resend_code_button')}
          {resendPending && <Loader className="size-4 animate-spin" />}
        </Button>
        {onSignInAnotherWay && (
          <Button
            className="w-full"
            disabled={busy}
            onClick={onSignInAnotherWay}
            type="button"
            variant="ghost"
          >
            {t('github_auth.sign_in_another_way_button')}
          </Button>
        )}
      </div>
    </form>
  );
}
