// api/list.js - 返回所有图片列表（按文件夹分组）
const GITHUB_USER = process.env.GITHUB_USER || 'chnbsdan'
const GITHUB_REPO = process.env.GITHUB_REPO || 'imgbed-storage'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const FOLDERS = ['wallpaper', 'cover']

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  try {
    const result = {}
    let totalCount = 0
    
    for (const folder of FOLDERS) {
      const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${folder}`
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'User-Agent': 'Vercel-Serverless'
        }
      })
      
      if (response.ok) {
        const files = await response.json()
        if (Array.isArray(files)) {
          const images = files
            .filter(f => f.name && f.name.match(/\.(jpg|jpeg|png|webp|gif)$/i))
            .map(f => ({
              name: f.name,
              url: f.download_url,
              size: f.size,
              path: f.path
            }))
          result[folder] = images
          totalCount += images.length
        } else {
          result[folder] = []
        }
      } else {
        result[folder] = []
      }
    }
    
    res.status(200).json({
      total: totalCount,
      folders: result
    })
  } catch (error) {
    console.error('Error in list.js:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
