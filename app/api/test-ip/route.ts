import { NextRequest, NextResponse } from 'next/server';
import { detectLanguageFromIP } from '@/utils/language-detection';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 获取客户端IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : realIP || 'unknown';
    
    // 检测语言
    const detectedLanguage = await detectLanguageFromIP(ip);
    
    // 获取查询参数中的测试IP
    const { searchParams } = new URL(request.url);
    const testIP = searchParams.get('ip');
    
    let result: any = {
      clientIP: ip,
      detectedLanguage,
      timestamp: new Date().toISOString(),
    };
    
    // 如果提供了测试IP，也测试它
    if (testIP) {
      const testLanguage = await detectLanguageFromIP(testIP);
      result = {
        ...result,
        testIP,
        testLanguage,
      };
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('IP detection test error:', error);
    return NextResponse.json(
      { error: 'IP detection failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
