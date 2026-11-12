import { createInstance } from "i18next";
import { cookies, headers } from "next/headers";
import { fallbackLng, resources, supported } from "./i18n.resources";

/**
 * The language for this request: the URL"s (/es/about, set by the generated proxy), then the
 * "lang" cookie, then Accept-Language, then the source language.
 */
export async function getLanguage(): Promise<string> {
  const fromUrl = (await headers()).get("x-localize-lang");
  if (fromUrl && supported.includes(fromUrl)) return fromUrl;
  const saved = (await cookies()).get("lang")?.value;
  if (saved && supported.includes(saved)) return saved;
  for (const part of ((await headers()).get("accept-language") ?? "").split(",")) {
    const code = part.split(";")[0].trim();
    const lower = code.toLowerCase();
    const base = lower.split("-")[0];
    // Exactly (pt-BR), by language (pt-BR → pt), or a regional variant the app has (pt → pt-BR).
    const match = supported.find((l) => l.toLowerCase() === lower) ?? supported.find((l) => l.toLowerCase() === base) ?? supported.find((l) => l.toLowerCase().split("-")[0] === base);
    if (match) return match;
  }
  return fallbackLng;
}

/** Translations for server components: `const { t } = await getTranslation();` */
export async function getTranslation() {
  const lng = await getLanguage();
  const i18n = createInstance();
  await i18n.init({ resources, lng, fallbackLng, interpolation: { escapeValue: false } });
  return { t: i18n.getFixedT(lng), i18n, lng };
}

/** The language's writing direction, for <html dir>: right to left for Arabic, Hebrew, Persian, Urdu… */
export function getDirection(lng: string): "ltr" | "rtl" {
  return ["ae", "aeb", "ar", "arc", "arq", "ars", "ary", "arz", "bal", "bej", "bgn", "bqi", "brh", "chg", "ckb", "dv", "fa", "gbz", "glk", "he", "jpr", "jrb", "khw", "ks", "lad", "lah", "lrc", "mde", "mzn", "nqo", "ota", "pal", "phn", "ps", "rhg", "sam", "sd", "sdh", "shu", "sog", "swb", "syc", "syr", "trw", "ug", "ur", "yi"].includes(lng.split("-")[0]) ? "rtl" : "ltr";
}
