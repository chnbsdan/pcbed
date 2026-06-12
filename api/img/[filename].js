// api/img/[filename].js - 完整版
const GITHUB_USER = process.env.GITHUB_USER || 'chnbsdan'
const GITHUB_REPO = process.env.GITHUB_REPO || 'pcbed'  // ⚠️ 改成你的存储仓库名
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

// 根据文件扩展名获取正确的 Content-Type
function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  const types = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'avif': 'image/avif',
    'svg': 'image/svg+xml'
  }
  return types[ext] || 'image/jpeg'
}

export default async function handler(req, res) {
  // 获取完整的路径参数，例如 "wallpaper/20260612_202.webp"
  const fullPath = req.query.filename
  
  if (!fullPath) {
    return res.status(400).send('Filename required')
  }
  
  // 分割路径，获取文件夹和文件名
  const parts = fullPath.split('/')
  const folder = parts[0]  // wallpaper 或 cover
  const filename = parts.slice(1).join('/')  // 实际文件名
  
  // 验证文件夹是否合法
  if (!['wallpaper', 'cover'].includes(folder)) {
    return res.status(403).send('Invalid folder')
  }
  
  // 构建 GitHub 原始文件 URL
  const rawUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${folder}/${filename}`
  
  // 设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.setHeader('Content-Disposition', 'inline')
  
  try {
    const response = await fetch(rawUrl, {
      headers: GITHUB_TOKEN ? {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'Vercel-Serverless'
      } : {}
    })
    
    if (!response.ok) {
      console.error(`GitHub fetch failed: ${response.status}`)
      return res.status(404).send('Image not found')
    }
    
    const body = await response.arrayBuffer()
    const contentType = getContentType(filename)
    res.setHeader('Content-Type', contentType)
    res.send(Buffer.from(body))
  } catch (error) {
    console.error('Image proxy error:', error)
    res.status(500).send('Internal error')
  }
}
