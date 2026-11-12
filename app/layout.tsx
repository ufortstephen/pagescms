import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getBaseUrl } from "@/lib/base-url";
import { cn } from "@/lib/utils";
import "./globals.css";
import { getTranslation } from '../i18n.server';
import { I18nProvider } from "../i18n-provider";
import { getDirection, getLanguage } from "../i18n.server";
import { LanguageAlternates } from "../i18n-alternates";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});
const appUrl = getBaseUrl();
const socialImage = "/images/social-card.png";
const description = "The No-Hassle CMS for GitHub";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return {
  metadataBase: new URL(appUrl),
  title: {
    template: t('layout.page_title', { page: '%s' }),
    default: t('layout.cms_title'),
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: appUrl,
    siteName: "Pages CMS",
    title: t('layout.cms_title'),
    description,
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: t('layout.social_card_title'),
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: t('layout.cms_title'),
    description,
    images: [socialImage],
  },
};
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
	const lng = await getLanguage();
	return (
    <html lang={lng} dir={getDirection(lng)} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          jetbrainsMono.variable,
        )}
      >
        <Providers user={null}>
          <I18nProvider lng={lng}><LanguageAlternates />{children}</I18nProvider>
        </Providers>
        <Toaster/>
      </body>
    </html>
  );
}
