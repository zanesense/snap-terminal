import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Snap Terminal — Terminal Screenshot Generator",
  description: "Generate beautiful, realistic terminal screenshots from text. Perfect for READMEs, docs, and social sharing.",
  icons: {
    icon: [
      { url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="%23171717"/><rect x="5" y="7" width="22" height="17" rx="1.5" fill="none" stroke="white" stroke-width="1.5"/><path d="M9 11l4 4-4 4" stroke="%2350e3c2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 22h6" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.4"/></svg>', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "Snap Terminal",
    description: "Generate beautiful, realistic terminal screenshots.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html:
'@font-face{font-family:"Fira Code";font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bh3dSD.woff2) format("woff2")}'+
'@font-face{font-family:"Fira Code";font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bh3dSD.woff2) format("woff2")}'+
'@font-face{font-family:"Fira Code";font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bh3dSD.woff2) format("woff2")}'+
'@font-face{font-family:"Ubuntu Mono";font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/ubuntumono/v19/KFOjCneDtsqEr0keqCMhbCc6CsQ.woff2) format("woff2")}'+
'@font-face{font-family:"Ubuntu Mono";font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/ubuntumono/v19/KFO-CneDtsqEr0keqCMhbC-BL9H1tY0.woff2) format("woff2")}'+
'@font-face{font-family:"Cascadia Code";font-style:normal;font-weight:400;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@5.2.3/files/cascadia-code-latin-400-normal.woff2) format("woff2")}'+
'@font-face{font-family:"Cascadia Code";font-style:normal;font-weight:700;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@5.2.3/files/cascadia-code-latin-700-normal.woff2) format("woff2")}'+
'@font-face{font-family:"Space Mono";font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/spacemono/v17/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2) format("woff2")}'+
'@font-face{font-family:"Space Mono";font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/spacemono/v17/i7dMIFZifjKcF5UAWdDRaPpZUFWaHg.woff2) format("woff2")}'
        }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
