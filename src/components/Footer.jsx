import React, { useState, useEffect } from 'react'

export default function Footer() {
  // 设置固定的起始日期（你的实际上线日期，例如 2026年3月5日）
  // 注意：月份从0开始，所以 2 代表 3 月
  const startDate = new Date(2026, 2, 5, 0, 0, 0)  // 2026年3月5日
  
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = now - startDate // 时间差（毫秒）

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (86400000)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (3600000)) / (1000 * 60))
      const seconds = Math.floor((diff % (60000)) / 1000)

      setTimeElapsed({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [startDate])

  return (
    <footer className="text-center mt-8 pt-4 border-t border-white/20 text-white/40 text-xs">
      {/* 技术栈徽章 */}
      <div className="flex justify-center items-center gap-2 mb-4 flex-wrap">
        <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" className="h-5" />
        </a>
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black" alt="Vercel" className="h-5" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/React-18-blue" alt="React 18" className="h-5" />
        </a>
        <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC" alt="Tailwind CSS" className="h-5" />
        </a>
      </div>

      {/* Powered by 行 */}
      <p>
        <span className="text-white/60">Powered by</span>
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition mx-1">Vercel</a>
        <span className="text-white/60">+</span>
        <a href="https://github.com/chnbsdan" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition ml-1">GitHub</a>
      </p>
      
      {/* 管理入口 */}
      <p className="mt-2">
        <a href="/manage" className="text-white/60 hover:text-white transition text-xs flex items-center justify-center gap-1">
          <i className="fas fa-cog"></i>
          管理登录
        </a>
      </p>
      
      {/* 稳定运行时间 */}
      <p className="mt-2 text-white/60 text-xs flex items-center justify-center gap-1 flex-wrap">
        本站已稳定运行
        <span className="text-white/80 font-mono mx-1">{timeElapsed.days}</span>天
        <span className="text-white/80 font-mono mx-1">{timeElapsed.hours}</span>小时
        <span className="text-white/80 font-mono mx-1">{timeElapsed.minutes}</span>分钟
        <span className="text-white/80 font-mono mx-1">{timeElapsed.seconds}</span>秒
        <span className="ml-1">| 服务器运行正常</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </p>

      <p className="mt-2 text-white/80 text-xs">
        未来可期，不负韶华
      </p>
    </footer>
  )
}
