// src/components/ThemeToggle.jsx - 修改为无固定定位
import React, { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition p-2 rounded-lg text-white text-sm flex items-center gap-2"
      title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {isDark ? (
        <>
          <i className="fas fa-sun text-yellow-400"></i>
          <span className="hidden sm:inline">亮色</span>
        </>
      ) : (
        <>
          <i className="fas fa-moon"></i>
          <span className="hidden sm:inline">暗色</span>
        </>
      )}
    </button>
  )
}
