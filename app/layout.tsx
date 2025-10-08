import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/hooks/use-language'
import { TranslationProvider } from '@/components/translation-provider'
import { SUPPORTED_LANGUAGES } from '@/middleware'
import { Suspense } from 'react'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: 'Codexia Blockchain CMS',
  description: 'Blockchain traceability, anti-counterfeit and enterprise branding CMS',
}

// 优化后的翻译组件包装器
function OptimizedTranslationProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>{children}</div>}>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </Suspense>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <OptimizedTranslationProvider>
            <LanguageProvider
              isAdmin={false}
              initialLanguage="zh"
            >
              {children}
            </LanguageProvider>
          </OptimizedTranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
