"use client";

import { useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

/** Gives client components the language the server chose. One instance per render tree, so
 * concurrent requests in different languages never share one. */
export function I18nProvider({ lng, children }: { lng: string; children: ReactNode }) {
  const [instance] = useState(() => i18n.cloneInstance({ lng, initAsync: false }));
  if (instance.language !== lng) instance.changeLanguage(lng);
  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
