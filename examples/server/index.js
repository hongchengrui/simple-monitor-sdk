/**
 * Mock 上报服务端 + 测试端点（M1/M2 验收用）
 *
 * 零依赖（原生 http）：
 *  - POST /report     接收 SDK 上报，结构化打印 TransportDataType
 *  - GET  /api/ok     返回 200，供 demo 触发「正常请求」（只进面包屑）
 *  - GET  /api/error  返回 500，供 demo 触发「失败请求」（上报 FETCH_ERROR）
 *
 * 运行：pnpm demo:server（或 node examples/server/index.js）
 */

const http = require('http')

const PORT = 3000

const server = http.createServer((req, res) => {
  // CORS：SDK 上报开启 withCredentials=true，规范要求此时
  // Access-Control-Allow-Origin 不能为通配符 *，必须回显具体来源并显式允许 credentials。
  const origin = req.headers.origin || '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  // 测试端点：供 demo 触发「被采集」的请求（非上报地址，会被 SDK 采集）
  if (req.method === 'GET' && req.url.startsWith('/api/ok')) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
    return
  }
  if (req.method === 'GET' && req.url.startsWith('/api/error')) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: true }))
    return
  }

  if (req.method === 'POST' && req.url.startsWith('/report')) {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      let payload
      try {
        payload = JSON.parse(body)
      } catch {
        payload = body
      }
      const time = new Date().toISOString()
      const type = payload?.data?.type || payload?.data?.name || 'UNKNOWN'
      console.log(`\n[${time}] 收到上报 (${type})`)
      console.log(JSON.stringify(payload, null, 2))
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true }))
    })
    return
  }

  res.writeHead(404)
  res.end('Not Found')
})

server.listen(PORT, () => {
  console.log(`Mock 监控服务端已启动: http://localhost:${PORT}`)
  console.log('上报: POST /report ｜ 测试: GET /api/ok (200) /api/error (500)\n')
})
