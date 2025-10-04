import { notFound } from 'next/navigation'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/middleware'
import { LanguageProvider } from '@/hooks/use-language'

interface LangLayoutProps {
  children: React.ReactNode
  params: {
    lang: string
    path: string[]
  }
}

export default function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = params

  // 验证语言参数
  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound()
  }

  // 注意：不要在子布局中重复渲染 <html>/<body>，避免与根布局重复导致水合告警
  return (
    <LanguageProvider initialLanguage={lang as any} isAdmin={false}>
      {children}
    </LanguageProvider>
  )
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
}
