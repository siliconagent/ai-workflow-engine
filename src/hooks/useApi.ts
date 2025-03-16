import { useState, useCallback } from 'react'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface ApiConfig {
  url: string
  method?: HttpMethod
  body?: any
}

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendRequest = useCallback(async (config: ApiConfig) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await mockFetch(config.url, {
        method: config.method || 'GET',
        body: config.body
      })
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { sendRequest, loading, error }
}

async function mockFetch(url: string, options?: { method?: string; body?: any }) {
  // Implementation matches the one in AppContext.tsx
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const mockData: Record<string, any> = {
    '/api/apps': [
      {
        id: '1',
        name: 'Customer Support',
        description: 'Automated support workflows',
        expanded: false,
        workflows: [
          {
            id: 'w1',
            name: 'Ticket Classification',
            lastRun: '2024-01-15',
            code: '// Classification logic',
            preview: 'Preview content',
            workflowDesign: 'Design data',
            workflowExecution: 'Execution data'
          }
        ]
      }
    ],
    '/api/llm-providers': [
      {
        id: 'openai',
        name: 'OpenAI',
        models: ['gpt-4', 'gpt-3.5'],
        baseUrl: 'https://api.openai.com/v1',
        apiKey: ''
      }
    ]
  }

  if (options?.method === 'PUT' && url === '/api/workflows') {
    return options.body
  }

  return mockData[url] || []
}
