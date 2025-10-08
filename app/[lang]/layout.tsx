import { notFound } from 'next/navigation'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/middleware'
import { LanguageUpdater } from '@/components/language-updater'

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

  // 使用轻量级的语言更新器，而不是重复的Provider
  return (
    <LanguageUpdater language={lang as any}>
      {children}
    </LanguageUpdater>
  )
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
}
