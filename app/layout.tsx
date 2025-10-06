import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/hooks/use-language'
import { TranslationProvider } from '@/components/translation-provider'
import { SUPPORTED_LANGUAGES } from '@/middleware'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Codexia Blockchain CMS',
  description: 'Blockchain traceability, anti-counterfeit and enterprise branding CMS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider>
            <LanguageProvider
              isAdmin={false}
              initialLanguage="zh"
            >
              {children}
            </LanguageProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
