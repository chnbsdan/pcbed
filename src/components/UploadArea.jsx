import React, { useRef, useState } from 'react'

export default function UploadArea({ onUpload, isLoading, convertFormat, onFormatChange }) {
  const [dragOver, setDragOver] = useState(false)
  const [folder, setFolder] = useState('wallpaper')
  const [bgRefresh, setBgRefresh] = useState(false)  // 换背景按钮状态
  const fileInputRef = useRef(null)

  // 换背景：只从横屏图片中获取
  const refreshBackground = () => {
    // 添加点击动画效果
    setBgRefresh(true)
    setTimeout(() => setBgRefresh(false), 200)
    
    const img = new Image()
    // 时间戳 + 随机数，双重防缓存
    const url = '/api/wallpaper?t=' + Date.now() + '&r=' + Math.random()
    img.onload = () => {
      document.body.style.backgroundImage = `url(${url})`
    }
    img.src = url
  }

  const handleFileSelect = (files) => {
    if (files.length > 0) {
      onUpload(files, folder)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onUpload(files, folder)
    }
  }

  // 获取格式显示的文本
  const getFormatLabel = () => {
    switch (convertFormat) {
      case 'webp': return 'WebP'
      case 'avif': return 'AVIF'
      default: return null
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="font-semibold text-green-500 text-sm flex items-center gap-1">
          <i className="fas fa-upload text-orange-600 text-sm"></i>
          上传图片
        </h3>
        <div className="flex items-center gap-2">
          {/* 换背景按钮 - 有点击状态变化 */}
          <button
            onClick={refreshBackground}
            className={`text-xs transition flex items-center gap-1 px-2 py-1 rounded-lg ${
              bgRefresh
                ? 'bg-green-700 text-white shadow-md'
                : 'bg-green-500 text-white hover:bg-green-400'
            }`}
            title="换一张背景"
          >
            <i className="fas fa-sync-alt text-xs"></i>
            换背景
          </button>
          {/* 横屏按钮 */}
          <button
            onClick={() => setFolder('wallpaper')}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
              folder === 'wallpaper'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <i className="fas fa-arrows-alt text-xs"></i>
            横屏
          </button>
          {/* 竖屏按钮 */}
          <button
            onClick={() => setFolder('cover')}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
              folder === 'cover'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <i className="fas fa-mobile-alt text-xs"></i>
            竖屏
          </button>
        </div>
      </div>

      {/* 格式选择下拉菜单 */}
      <div className="flex justify-center items-center mb-4">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
          <span className="text-white/70 text-sm">
            <i className="fas fa-exchange-alt mr-1"></i>
            图片格式：
          </span>
          <select
            value={convertFormat || 'original'}
            onChange={(e) => onFormatChange?.(e.target.value)}
            className="bg-white/20 text-white text-sm rounded-lg px-3 py-1.5 border border-white/30 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer
                       hover:bg-white/30 transition"
          >
            <option value="original" className="text-gray-800">📷 保持原格式</option>
            <option value="webp" className="text-gray-800">🖼️ 转换为 WebP (推荐)</option>
            <option value="avif" className="text-gray-800">⚡ 转换为 AVIF (体积更小)</option>
          </select>
        </div>
      </div>

      {/* 上传区域 */}
      <div
        className={`upload-area rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer ${
          dragOver
            ? 'border-blue-500 bg-sky-100'
            : 'border-gray-300 bg-gray-50 hover:bg-sky-100 hover:border-sky-400'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3 block"></i>
        <p className="text-gray-600 text-base mb-2">点击或拖拽图片到此处上传</p>
        <p className="text-xs text-gray-400">支持 JPG、PNG、WebP、GIF、AVIF | 大图自动压缩</p>
        
        {/* 显示当前转换状态 */}
        {convertFormat !== 'original' && (
          <p className="text-xs text-green-600 mt-2">
            <i className="fas fa-magic mr-1"></i>
            已开启 {getFormatLabel()} 转换，上传后将自动转换格式
          </p>
        )}
        
        <p className="text-xs text-blue-500 mt-3">
          当前上传到: {folder === 'wallpaper' ? '📁 横屏 (wallpaper)' : '📁 竖屏 (cover)'}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {isLoading && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-orange-600">
            <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
            上传中，请稍候...
          </div>
        </div>
      )}
    </div>
  )
}
