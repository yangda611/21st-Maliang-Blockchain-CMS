/**
 * 移动端测试页面
 * 用于验证顶部栏在不同屏幕尺寸下的适配效果
 */

import Navbar from '@/components/public/navbar';

export default function TestMobilePage() {
  return (
    <div className="min-h-screen bg-black mobile-overflow-hidden">
      <Navbar lang="zh" />
      
      <main className="pt-14 sm:pt-16 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 测试标题 */}
          <section className="text-center py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              移动端适配测试页面
            </h1>
            <p className="text-white/60 text-sm sm:text-base">
              请调整浏览器窗口大小或使用移动设备查看顶部栏的响应式效果
            </p>
          </section>

          {/* 断点测试信息 */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-4">响应式断点测试</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded p-3">
                <h3 className="text-sm font-medium text-white mb-2">超小屏幕 <375px</h3>
                <p className="text-xs text-white/60">Logo缩小，按钮紧凑，语言切换简化</p>
              </div>
              <div className="bg-white/5 rounded p-3">
                <h3 className="text-sm font-medium text-white mb-2">小屏幕 375px-640px</h3>
                <p className="text-xs text-white/60">汉堡菜单，简化的语言选择器</p>
              </div>
              <div className="bg-white/5 rounded p-3">
                <h3 className="text-sm font-medium text-white mb-2">中等屏幕 640px-1024px</h3>
                <p className="text-xs text-white/60">显示完整语言选择器，隐藏汉堡菜单</p>
              </div>
              <div className="bg-white/5 rounded p-3">
                <h3 className="text-sm font-medium text-white mb-2">大屏幕 1024px-1280px</h3>
                <p className="text-xs text-white/60">显示更多导航项，优化间距</p>
              </div>
              <div className="bg-white/5 rounded p-3">
                <h3 className="text-sm font-medium text-white mb-2">超大屏幕 >1280px</h3>
                <p className="text-xs text-white/60">完整导航菜单，最大间距</p>
              </div>
            </div>
          </section>

          {/* 功能测试清单 */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-4">功能测试清单</h2>
            <div className="space-y-3">
              {[
                '✓ 导航栏固定在顶部',
                '✓ Logo 在不同屏幕尺寸下正确显示',
                '✓ 汉堡菜单在小屏幕下出现',
                '✓ 移动端菜单展开/收起动画流畅',
                '✓ 语言选择器在不同屏幕下适配',
                '✓ 移动端语言切换功能正常',
                '✓ 导航链接点击正确跳转',
                '✓ 触摸目标大小符合移动端标准',
                '✓ 横向滚动问题已解决',
                '✓ 动画效果在不同设备上流畅'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                  <span className="text-green-400">{item.split(' ')[0]}</span>
                  <span>{item.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 视觉效果测试 */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-4">视觉效果测试</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-2">暗黑主题</h3>
                <div className="bg-black border border-white/20 rounded p-3">
                  <p className="text-xs text-white/60">黑色背景配合半透明毛玻璃效果</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white mb-2">渐变效果</h3>
                <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded p-3">
                  <p className="text-xs text-white">渐变边框和背景效果</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white mb-2">悬停状态</h3>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded p-3 transition-all">
                  <p className="text-xs text-white">悬停查看效果</p>
                </button>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white mb-2">动画效果</h3>
                <div className="animate-pulse bg-white/5 border border-white/10 rounded p-3">
                  <p className="text-xs text-white">脉冲动画测试</p>
                </div>
              </div>
            </div>
          </section>

          {/* 设备测试指南 */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-4">设备测试指南</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-2">📱 手机设备测试</h3>
                <ul className="text-xs text-white/60 space-y-1">
                  <li>• iPhone SE (375px) - 测试超小屏幕适配</li>
                  <li>• iPhone 12/13 (390px) - 测试小屏幕适配</li>
                  <li>• iPhone 14 Pro Max (430px) - 测试大手机屏幕</li>
                  <li>• Android 设备 - 测试不同分辨率</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white mb-2">📱 平板设备测试</h3>
                <ul className="text-xs text-white/60 space-y-1">
                  <li>• iPad Mini (768px) - 测试平板竖屏</li>
                  <li>• iPad (1024px) - 测试平板横屏</li>
                  <li>• Android 平板 - 测试不同尺寸</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white mb-2">💻 桌面设备测试</h3>
                <ul className="text-xs text-white/60 space-y-1">
                  <li>• 小型笔记本 (1280px) - 测试小桌面</li>
                  <li>• 标准桌面 (1920px) - 测试标准分辨率</li>
                  <li>• 大屏显示器 (2560px+) - 测试高分辨率</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
