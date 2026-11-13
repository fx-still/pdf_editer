import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/src/components/toast/ToastProvider";
import { I18nProvider } from "@/src/components/i18n/I18nProvider";

export const metadata: Metadata = {
  title: "PDF Toolkit",
  description: "Merge and split PDFs locally in your browser — nothing is uploaded.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PDF Tools",
  },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <ToastProvider>{children}</ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
