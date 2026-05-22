import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeGuard Proxy | GDPR-Compliant LLM Security Proxy Gateway",
  description: "Enterprise-grade reverse proxy gateway that automatically detects, masks, and vaults PII data streams to LLMs, ensuring strict GDPR & HIPAA compliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
