import React, { useState } from 'react'
import { copyToClipboard } from '../lib/api'

const apis = [
  { id: 'random', label: '随机图片接口', icon: 'fa-dice-d6', path: '/api/random' },
  { id: 'wallpaper', label: '横屏图片接口', icon: 'fa-arrows-alt', path: '/api/wallpaper' },
  { id: 'cover', label: '竖屏图片接口', icon: 'fa-mobile-alt', path: '/api/cover' },
  { id: 'json', label: 'JSON 接口', icon: 'fa-code', path: '/api/json' },
]

export default function ApiSection() {
  const [copied, setCopied] = useState(null)

  const handleCopy = (text, id) => {
    copyToClipboard(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="card p-5 mb-6 animate-slide-up bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl border border-white/20">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <i className="fas fa-plug text-blue-500"></i>
        API 接口
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {apis.map((api) => {
          const url = `${baseUrl}${api.path}`
          return (
            <div key={api.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <i className={`fas ${api.icon} text-gray-500 dark:text-gray-400`}></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{api.label}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded flex-1 truncate text-gray-700 dark:text-gray-300">{url}</code>
                <button
                  onClick={() => handleCopy(url, api.id)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {copied === api.id ? (
                    <i className="fas fa-check text-green-500"></i>
                  ) : (
                    <i className="fas fa-copy text-gray-400 dark:text-gray-500"></i>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
