import { NextRequest, NextResponse } from 'next/server';
import { detectLanguageFromIP } from '@/utils/language-detection';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : realIP || 'unknown';
    
    console.log('Test API IP Detection:', {
      forwarded,
      realIP,
      ip,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    // 检测语言
    const detectedLanguage = await detectLanguageFromIP(ip);
    
    return NextResponse.json({
      clientIP: ip,
      detectedLanguage,
      timestamp: new Date().toISOString(),
      headers: {
        'x-forwarded-for': forwarded,
        'x-real-ip': realIP,
        'user-agent': request.headers.get('user-agent'),
      }
    });
  } catch (error) {
    console.error('Test redirect API error:', error);
    return NextResponse.json(
      { error: 'Test failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
