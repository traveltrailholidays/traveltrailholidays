import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import { Montserrat } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from '@/components/common/theme-provider';
import ContinueHandler from "@/components/v1/continue-handler";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'TTH Account',
    template: '%s - TTH Account',
  },
  description:
    'Centralized authentication system for Tourillo. Securely sign in and access all your TTH services with a single account.',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased text-theme-text`}>
        <NextTopLoader color="#98FF98" height={1} showSpinner={false} />
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleOAuthProvider clientId={`${process.env.GOOGLE_CLIENT_ID}`}>
            <ContinueHandler />
            {children}
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
