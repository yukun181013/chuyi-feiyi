import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function unityGzipPlugin() {
  return {
    name: 'unity-gzip-plugin',
    configureServer(server) {
      server.middlewares.use('/game', (req, res, next) => {
        if (req.url.endsWith('.js.gz')) {
          res.setHeader('Content-Encoding', 'gzip')
          res.setHeader('Content-Type', 'application/javascript')
        } else if (req.url.endsWith('.wasm.gz')) {
          res.setHeader('Content-Encoding', 'gzip')
          res.setHeader('Content-Type', 'application/wasm')
        } else if (req.url.endsWith('.data.gz')) {
          res.setHeader('Content-Encoding', 'gzip')
          res.setHeader('Content-Type', 'application/octet-stream')
        }
        next()
      })
    },
  }
}

function qaProxyPlugin() {
  return {
    name: 'qa-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/qa', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let rawBody = ''

        req.on('data', (chunk) => {
          rawBody += chunk
        })

        req.on('end', async () => {
          try {
            const { question } = JSON.parse(rawBody || '{}')

            const upstream = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer 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`,
              },
              body: JSON.stringify({
                model: 'nvidia/nemotron-3-super-120b-a12b',
                messages: [
                  {
                    role: 'system',
                    content: '你是梆鼓咚非遗课程网站的 AI 助手。请用简洁、自然、面向学生和公众的中文回答，优先回答课程学习、非遗背景、传播方式、文创体验等问题。',
                  },
                  { role: 'user', content: question },
                ],
                temperature: 0.7,
                top_p: 0.95,
                max_tokens: 1024,
                stream: false,
              }),
            })

            const data = await upstream.json()

            if (!upstream.ok) {
              res.statusCode = upstream.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: data.detail || data.error?.message || '上游模型接口请求失败。' }))
              return
            }

            const answer = data.choices?.[0]?.message?.content || '接口已连通，但本次没有返回可显示的文本内容。'

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ answer }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: '问答服务处理失败：' + err.message }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  return {
    plugins: [react(), unityGzipPlugin(), qaProxyPlugin()],
  }
})
