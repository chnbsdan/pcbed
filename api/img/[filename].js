// api/img/[filename].js - 图片代理服务（直接访问图片）
const GITHUB_USER = process.env.GITHUB_USER || 'chnbsdan'
const GITHUB_REPO = process.env.GITHUB_REPO || 'imgbed-storage'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export default async function handler(req, res) {
  const { filename } = req.query
  
  if (!filename) {
    return res.status(400).send('Filename required')
  }
  
  // 尝试从 wallpaper 和 cover 文件夹中查找图片
  const folders = ['wallpaper', 'cover']
  
  // 设置响应头
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  try {
    for (const folder of folders) {
      const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${folder}/${filename}`
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'Vercel-Serverless'
        }
      })
      
      if (response.ok) {
        const contentType = response.headers.get('Content-Type') || 'image/jpeg'
        const body = await response.arrayBuffer()
        
        res.setHeader('Content-Type', contentType)
        res.setHeader('Content-Disposition', 'inline')
        return res.send(Buffer.from(body))
      }
    }
    
    // 两个文件夹都没找到
    return res.status(404).send('Image not found')
  } catch (error) {
    console.error('Image proxy error:', error)
    res.status(500).send('Internal error')
  }
}
