// api/img/[filename].js
const GITHUB_USER = process.env.GITHUB_USER || 'chnbsdan'
const GITHUB_REPO = process.env.GITHUB_REPO || 'imgbed-storage'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export default async function handler(req, res) {
  const { filename } = req.query
  
  if (!filename) {
    return res.status(400).send('Filename required')
  }
  
  // 设置响应头 - 关键：禁止缓存，强制内联显示
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  // 关键：强制浏览器显示而不是下载
  res.setHeader('Content-Disposition', 'inline')
  
  const folders = ['wallpaper', 'cover']
  
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
        return res.send(Buffer.from(body))
      }
    }
    
    return res.status(404).send('Image not found')
  } catch (error) {
    console.error('Image proxy error:', error)
    res.status(500).send('Internal error')
  }
}
