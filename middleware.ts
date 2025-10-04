/**
 * Multi-language Routing Middleware
 * Handles language detection and routing for Maliang CMS
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supported languages
export const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja', 'ko', 'ar', 'es'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh'

// Language detection helpers
function getLanguageFromPathname(pathname: string): SupportedLanguage | null {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    return firstSegment as SupportedLanguage
  }

  return null
}

function getLanguageFromAcceptLanguage(acceptLanguage: string | null): SupportedLanguage | null {
  if (!acceptLanguage) return null

  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.trim().split(';')[0].toLowerCase())

  for (const lang of languages) {
    if (SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
      return lang as SupportedLanguage
    }

    // Handle language variants (e.g., 'zh-CN' -> 'zh')
    const baseLang = lang.split('-')[0]
    if (SUPPORTED_LANGUAGES.includes(baseLang as SupportedLanguage)) {
      return baseLang as SupportedLanguage
    }
  }

  return null
}

function getLanguageFromCookie(request: NextRequest): SupportedLanguage | null {
  const cookieLang = request.cookies.get('maliang-language')?.value
  if (cookieLang && SUPPORTED_LANGUAGES.includes(cookieLang as SupportedLanguage)) {
    return cookieLang as SupportedLanguage
  }
  return null
}

function getPreferredLanguage(request: NextRequest): SupportedLanguage {
  // Priority: cookie > accept-language > default
  return (
    getLanguageFromCookie(request) ||
    getLanguageFromAcceptLanguage(request.headers.get('accept-language')) ||
    DEFAULT_LANGUAGE
  )
}

function shouldRedirectToLanguage(pathname: string): boolean {
  // Don't redirect if already has language prefix
  if (getLanguageFromPathname(pathname)) {
    return false
  }

  // Don't redirect API routes
  if (pathname.startsWith('/api/')) {
    return false
  }

  // Don't redirect admin routes (including language-prefixed admin routes)
  if (pathname.startsWith('/maliang-admin') || pathname.includes('/maliang-admin')) {
    return false
  }

  // Don't redirect static files
  if (pathname.includes('.')) {
    return false
  }

  // Don't redirect root path (handled separately)
  if (pathname === '/') {
    return false
  }

  return true
}

function createLanguageRedirect(language: SupportedLanguage, pathname: string): NextResponse {
  const newPathname = `/${language}${pathname}`
  const response = NextResponse.redirect(new URL(newPathname, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))

  // Set language cookie
  response.cookies.set('maliang-language', language, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
    httpOnly: false, // Allow JavaScript access for language switching
  })

  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle root path - redirect to preferred language
  if (pathname === '/') {
    const preferredLanguage = getPreferredLanguage(request)
    return createLanguageRedirect(preferredLanguage, '/')
  }

  // Handle other paths that need language prefix
  if (shouldRedirectToLanguage(pathname)) {
    const preferredLanguage = getPreferredLanguage(request)
    return createLanguageRedirect(preferredLanguage, pathname)
  }

  // Handle language-prefixed routes
  const currentLanguage = getLanguageFromPathname(pathname)
  if (currentLanguage) {
    // Don't process language-prefixed admin routes
    if (pathname.includes('/maliang-admin')) {
      return NextResponse.next()
    }

    // Update language cookie if different from current
    const cookieLanguage = getLanguageFromCookie(request)
    if (cookieLanguage !== currentLanguage) {
      const response = NextResponse.next()
      response.cookies.set('maliang-language', currentLanguage, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        httpOnly: false,
      })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
