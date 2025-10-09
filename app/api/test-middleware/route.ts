import { NextRequest, NextResponse } from 'next/server';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testIP = body.ip;
    
    if (!testIP) {
      return NextResponse.json({ error: 'IP address required' }, { status: 400 });
    }

    // 创建一个新的请求对象，模拟不同的IP头
    const url = new URL(request.url);
    const newRequest = new NextRequest(url, {
      method: 'GET',
      headers: {
        'x-forwarded-for': testIP,
        'user-agent': 'Test-Agent/1.0',
      },
    });

    // 导入并测试IP检测逻辑
    const { detectLanguageFromIP } = await import('@/utils/language-detection');
    const detectedLanguage = await detectLanguageFromIP(testIP);

    return NextResponse.json({
      testIP,
      detectedLanguage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test middleware API error:', error);
    return NextResponse.json(
      { error: 'Test failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
