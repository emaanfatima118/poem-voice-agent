import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stackwise - The Marketing Stack That Works For You",
  description: "Stackwise integrates with your tools to track performance, guide strategy, and streamline execution.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/logo192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
