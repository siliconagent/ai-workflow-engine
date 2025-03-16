import { createContext, useState, useEffect, useReducer, useCallback } from 'react'

interface Workflow {
  id: string
  name: string
  lastRun: string
  code: string
  preview: string
  workflowDesign: string
  workflowExecution: string
}

interface App {
  id: string
  name: string
  description: string
  expanded: boolean
  workflows: Workflow[]
}

interface LLMProvider {
  id: string
  name: string
  models: string[]
  baseUrl: string
  apiKey: string
}

interface AppState {
  rightPanelView: 'code' | 'preview' | 'workflow' | 'execution'
  collapsed: boolean
  fullScreen: boolean
  apps: App[]
  selectedWorkflow: Workflow | null
  llmProviders: LLMProvider[]
  selectedLLMProvider: LLMProvider | null
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'SET_VIEW'; view: AppState['rightPanelView'] }
  | { type: 'TOGGLE_COLLAPSE' }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_APPS'; apps: App[] }
  | { type: 'SET_SELECTED_WORKFLOW'; workflow: Workflow | null }
  | { type: 'SET_LLM_PROVIDERS'; providers: LLMProvider[] }
  | { type: 'SET_SELECTED_LLM_PROVIDER'; provider: LLMProvider | null }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }

const initialState: AppState = {
  rightPanelView: 'code',
  collapsed: false,
  fullScreen: false,
  apps: [],
  selectedWorkflow: null,
  llmProviders: [],
  selectedLLMProvider: null,
  loading: false,
  error: null
}

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, rightPanelView: action.view }
    case 'TOGGLE_COLLAPSE':
      return { ...state, collapsed: !state.collapsed }
    case 'TOGGLE_FULLSCREEN':
      return { ...state, fullScreen: !state.fullScreen }
    case 'SET_APPS':
      return { ...state, apps: action.apps }
    case 'SET_SELECTED_WORKFLOW':
      return { ...state, selectedWorkflow: action.workflow }
    case 'SET_LLM_PROVIDERS':
      return { ...state, llmProviders: action.providers }
    case 'SET_SELECTED_LLM_PROVIDER':
      return { ...state, selectedLLMProvider: action.provider }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    default:
      return state
  }
}

interface AppContextValue extends AppState {
  setRightPanelView: (view: AppState['rightPanelView']) => void
  toggleCollapse: () => void
  toggleFullScreen: () => void
  fetchApps: () => Promise<void>
  fetchLLMProviders: () => Promise<void>
  updateWorkflow: (workflow: Workflow) => Promise<void>
  setSelectedWorkflow: (workflow: Workflow | null) => void
  setSelectedLLMProvider: (provider: LLMProvider | null) => void
}

export const AppContext = createContext<AppContextValue>({
  ...initialState,
  setRightPanelView: () => {},
  toggleCollapse: () => {},
  toggleFullScreen: () => {},
  fetchApps: async () => {},
  fetchLLMProviders: async () => {},
  updateWorkflow: async () => {},
  setSelectedWorkflow: () => {},
  setSelectedLLMProvider: () => {}
})

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchApps = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', loading: true })
      const response = await mockFetch('/api/apps')
      dispatch({ type: 'SET_APPS', apps: response })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to load apps' })
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false })
    }
  }, [])

  const fetchLLMProviders = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', loading: true })
      const response = await mockFetch('/api/llm-providers')
      dispatch({ type: 'SET_LLM_PROVIDERS', providers: response })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to load LLM providers' })
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false })
    }
  }, [])

  const updateWorkflow = useCallback(async (workflow: Workflow) => {
    try {
      dispatch({ type: 'SET_LOADING', loading: true })
      await mockFetch('/api/workflows', {
        method: 'PUT',
        body: workflow
      })
      dispatch({ type: 'SET_SELECTED_WORKFLOW', workflow })
      await fetchApps()
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to update workflow' })
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false })
    }
  }, [fetchApps])

  const setSelectedWorkflow = (workflow: Workflow | null) => {
    dispatch({ type: 'SET_SELECTED_WORKFLOW', workflow })
  }

  const setSelectedLLMProvider = (provider: LLMProvider | null) => {
    dispatch({ type: 'SET_SELECTED_LLM_PROVIDER', provider })
  }

  useEffect(() => {
    fetchApps()
    fetchLLMProviders()
  }, [fetchApps, fetchLLMProviders])

  return (
    <AppContext.Provider
      value={{
        ...state,
        setRightPanelView: (view) => dispatch({ type: 'SET_VIEW', view }),
        toggleCollapse: () => dispatch({ type: 'TOGGLE_COLLAPSE' }),
        toggleFullScreen: () => dispatch({ type: 'TOGGLE_FULLSCREEN' }),
        fetchApps,
        fetchLLMProviders,
        updateWorkflow,
        setSelectedWorkflow,
        setSelectedLLMProvider
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Mock API implementation
async function mockFetch(url: string, options?: { method?: string; body?: any }) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const mockData: Record<string, any> = {
    '/api/apps': [
      {
        id: '1',
        name: 'HRMS',
        description: 'HRMS workflows',
        expanded: false,
        workflows: [
          {
            id: 'w1',
            name: 'Onboarding',
            lastRun: '2024-01-15',
            code: '// Onboarding logic',
            preview: 'Preview content',
            workflowDesign: 'Design data',
            workflowExecution: 'Execution data'
          },
          {
            id: 'w2',
            name: 'Promotion',
            lastRun: '2024-01-20',
            code: '// Promotion logic',
            preview: 'Preview content',
            workflowDesign: 'Design data',
            workflowExecution: 'Execution data'
          }
        ]
      },
      {
        id: '2',
        name: 'Finance',
        description: 'Finance workflows',
        expanded: false,
        workflows: [
          {
            id: 'w3',
            name: 'Salary Processing',
            lastRun: '2024-01-22',
            code: '// Salary Hikes logic',
            preview: 'Preview content',
            workflowDesign: 'Design data',
            workflowExecution: 'Execution data'
          },
          {
            id: 'w4',
            name: 'Hikes',
            lastRun: '2024-01-25',
            code: '// Hikes logic',
            preview: 'Preview content',
            workflowDesign: 'Execution data'
          }
        ]
      }
    ],
    '/api/llm-providers': [
  {
    "id": "openai",
    "name": "OpenAI",
    "models": [
      "gpt-4-turbo", 
      "gpt-4-turbo-preview", 
      "gpt-4-0125-preview",
      "gpt-4-1106-preview",
      "gpt-4", 
      "gpt-4-32k",
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-vision-preview",
      "gpt-3.5-turbo", 
      "gpt-3.5-turbo-1106",
      "gpt-3.5-turbo-16k",
      "text-embedding-3-small",
      "text-embedding-3-large",
      "text-embedding-ada-002",
      "tts-1",
      "tts-1-hd",
      "whisper-1",
      "dall-e-3",
      "dall-e-2"
    ],
    "baseUrl": "https://api.openai.com/v1",
    "apiKey": ""
  },
  {
    "id": "deepseek",
    "name": "Deepseek",
    "models": [
      "deepseek-chat", 
      "deepseek-coder", 
      "deepseek-llm-67b-chat",
      "deepseek-ai/deepseek-math-7b-instruct",
      "deepseek-ai/deepseek-coder-6.7b-instruct",
      "deepseek-ai/deepseek-coder-33b-instruct",
      "deepseek-llm-7b-chat",
      "deepseek-coder-6.7b-base",
      "deepseek-coder-6.7b-instruct",
      "deepseek-coder-33b-instruct",
      "deepseek-llm-67b-base",
      "deepseek-vl-7b-chat"
    ],
    "baseUrl": "https://api.deepseek.com/v1",
    "apiKey": ""
  },
  {
    "id": "google",
    "name": "Google",
    "models": [
      "gemini-pro", 
      "gemini-pro-vision", 
      "gemini-flash", 
      "gemini-ultra",
      "gemini-1.0-pro",
      "gemini-1.0-pro-vision",
      "gemini-1.0-ultra",
      "gemini-1.0-ultra-vision",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.5-pro-vision",
      "gemini-1.5-ultra",
      "text-embedding-004",
      "text-embedding-gecko",
      "text-bison",
      "chat-bison",
      "code-bison",
      "palm-2"
    ],
    "baseUrl": "https://generativelanguage.googleapis.com",
    "apiKey": ""
  },
  {
    "id": "groq",
    "name": "Groq",
    "models": [
      "llama3-8b-8192", 
      "llama3-70b-8192", 
      "llama3-70b-4096",
      "mixtral-8x7b-32768", 
      "mixtral-8x7b-instruct-v0.1",
      "gemma-7b-it",
      "gemma-2b-it",
      "claude-3-haiku-20240307",
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "falcon-40b-instruct",
      "codellama-34b-instruct",
      "llama2-70b-4096"
    ],
    "baseUrl": "https://api.groq.com/openai/v1",
    "apiKey": ""
  },
  {
    "id": "huggingface",
    "name": "HuggingFace",
    "models": [
      "tiiuae/falcon-40b", 
      "tiiuae/falcon-7b", 
      "meta-llama/Llama-2-70b-chat-hf", 
      "meta-llama/Llama-2-13b-chat-hf",
      "meta-llama/Llama-2-7b-chat-hf",
      "meta-llama/Meta-Llama-3-8B",
      "meta-llama/Meta-Llama-3-70B",
      "mistralai/Mixtral-8x7B-v0.1",
      "mistralai/Mistral-7B-Instruct-v0.2",
      "mistralai/Mistral-7B-v0.1",
      "stabilityai/stablelm-3b-4e1t",
      "stabilityai/stablelm-tuned-alpha-7b",
      "google/gemma-7b",
      "google/gemma-2b",
      "microsoft/phi-2",
      "bigcode/starcoder2-15b",
      "bigcode/starcoder2-3b",
      "codellama/CodeLlama-34b-Instruct-hf",
      "togethercomputer/RedPajama-INCITE-7B-Chat"
    ],
    "baseUrl": "https://api-inference.huggingface.co/models",
    "apiKey": ""
  },
  {
    "id": "ollama",
    "name": "Ollama",
    "models": [
      "llama3", 
      "llama3:8b", 
      "llama3:70b",
      "llama2", 
      "llama2:7b", 
      "llama2:13b", 
      "llama2:70b",
      "mixtral", 
      "mixtral:8x7b", 
      "mixtral:8x22b",
      "mistral", 
      "mistral:7b", 
      "mistral:openorca",
      "phi3", 
      "phi3:mini", 
      "phi3:medium", 
      "phi3:small",
      "gemma", 
      "gemma:2b", 
      "gemma:7b",
      "llava", 
      "llava:13b", 
      "llava:34b",
      "codegemma", 
      "codellama", 
      "codellama:7b", 
      "codellama:13b", 
      "codellama:34b",
      "neural-chat", 
      "wizard-math", 
      "falcon", 
      "nous-hermes", 
      "vicuna", 
      "orca-mini", 
      "stablelm", 
      "qwen"
    ],
    "baseUrl": "http://localhost:11434/api",
    "apiKey": ""
  },
  {
    "id": "openrouter",
    "name": "OpenRouter",
    "models": [
      "anthropic/claude-3-opus", 
      "anthropic/claude-3-sonnet", 
      "anthropic/claude-3-haiku",
      "anthropic/claude-3.5-sonnet",
      "meta-llama/llama-3-70b-instruct",
      "meta-llama/llama-3-8b-instruct",
      "mistralai/mistral-large-latest",
      "mistralai/mixtral-8x7b-instruct",
      "google/gemini-pro",
      "google/gemini-1.5-pro",
      "deepseek/deepseek-coder",
      "cohere/command-r-plus"
    ],
    "baseUrl": "https://openrouter.ai/api/v1",
    "apiKey": ""
  },
  {
    "id": "openaiilike",
    "name": "OpenAILike",
    "models": [
      "custom-model-1", 
      "custom-model-2", 
      "local-model", 
      "self-hosted-llm",
      "vllm-served-model",
      "llama.cpp-server",
      "text-generation-webui",
      "koboldcpp-model",
      "openai-compatible-endpoint"
    ],
    "baseUrl": "https://your-custom-endpoint.com/v1",
    "apiKey": ""
  },
  {
    "id": "perplexity",
    "name": "Perplexity",
    "models": [
      "sonar-small-online", 
      "sonar-medium-online", 
      "sonar-large-online",
      "sonar-small-chat", 
      "sonar-medium-chat", 
      "sonar-large-chat",
      "pplx-7b-online",
      "pplx-7b-chat",
      "pplx-70b-online",
      "pplx-70b-chat",
      "mixtral-8x7b-instruct",
      "llama-3-8b-instruct",
      "llama-3-70b-instruct",
      "codellama-34b-instruct"
    ],
    "baseUrl": "https://api.perplexity.ai",
    "apiKey": ""
  },
  {
    "id": "lmstudio",
    "name": "LMStudio",
    "models": [
      "local-model",
      "downloaded-model",
      "quantized-model",
      "llama2-7b-chat-q4",
      "llama2-13b-chat-q4",
      "llama2-70b-chat-q4",
      "mistral-7b-instruct-q4",
      "mixtral-8x7b-instruct-q4",
      "llama3-8b-q4",
      "llama3-70b-q4",
      "phi3-mini-4k-instruct-q4",
      "gemma-7b-instruct-q4",
      "custom-gguf-model"
    ],
    "baseUrl": "http://localhost:1234/v1",
    "apiKey": ""
  },
  {
    "id": "anthropic",
    "name": "Anthropic",
    "models": [
      "claude-3-opus-20240229", 
      "claude-3-sonnet-20240229", 
      "claude-3-haiku-20240307", 
      "claude-3.5-sonnet-20240620",
      "claude-3.7-sonnet-20250219",
      "claude-3-haiku",
      "claude-3-sonnet",
      "claude-3-opus",
      "claude-3.5-sonnet",
      "claude-3.7-sonnet",
      "claude-2.0",
      "claude-2.1",
      "claude-instant-1.2"
    ],
    "baseUrl": "https://api.anthropic.com/v1",
    "apiKey": ""
  },
  {
    "id": "mistral",
    "name": "Mistral AI",
    "models": [
      "mistral-small", 
      "mistral-medium", 
      "mistral-large",
      "mistral-tiny",
      "mistral-embed",
      "mistral-small-latest",
      "mistral-medium-latest",
      "mistral-large-latest",
      "open-mistral-7b",
      "open-mixtral-8x7b",
      "mistral-7b-instruct-v0.1",
      "mistral-7b-instruct-v0.2",
      "mixtral-8x7b-instruct-v0.1"
    ],
    "baseUrl": "https://api.mistral.ai/v1",
    "apiKey": ""
  },
  {
    "id": "cohere",
    "name": "Cohere",
    "models": [
      "command", 
      "command-light", 
      "command-r", 
      "command-r-plus",
      "command-nightly",
      "command-light-nightly",
      "embed-english-v3.0",
      "embed-multilingual-v3.0",
      "embed-english-light-v3.0",
      "embed-multilingual-light-v3.0",
      "rerank-english-v3.0",
      "rerank-multilingual-v3.0",
      "summarize-medium",
      "summarize-xlarge",
      "generate-medium",
      "generate-xlarge"
    ],
    "baseUrl": "https://api.cohere.ai/v1",
    "apiKey": ""
  },
  {
    "id": "together",
    "name": "TogetherAI",
    "models": [
      "togethercomputer/llama-3-70b-instruct",
      "togethercomputer/llama-3-8b-instruct",
      "togethercomputer/llama-2-70b-chat",
      "togethercomputer/RedPajama-INCITE-7B-Chat",
      "mistralai/Mixtral-8x7B-Instruct-v0.1",
      "mistralai/Mistral-7B-Instruct-v0.2",
      "meta-llama/Llama-2-7b-chat-hf",
      "meta-llama/Llama-2-13b-chat-hf",
      "01-ai/Yi-34B-Chat",
      "Qwen/Qwen1.5-72B-Chat",
      "google/gemma-7b-it",
      "NousResearch/Nous-Hermes-2-Yi-34B",
      "upstage/SOLAR-10.7B-Instruct-v1.0"
    ],
    "baseUrl": "https://api.together.xyz/v1",
    "apiKey": ""
  },
  {
    "id": "replicate",
    "name": "Replicate",
    "models": [
      "meta/llama-3-70b-instruct",
      "meta/llama-3-8b-instruct",
      "meta/llama-2-70b-chat",
      "stability-ai/stable-diffusion-xl",
      "stability-ai/sdxl-turbo",
      "stability-ai/stable-video-diffusion",
      "midjourney/midjourney",
      "cogvlm/cogvlm-chat",
      "mistralai/mistral-7b-instruct-v0.2",
      "mistralai/mixtral-8x7b-instruct-v0.1",
      "anthropic/claude-3-opus",
      "anthropic/claude-3-sonnet",
      "anthropic/claude-3-haiku"
    ],
    "baseUrl": "https://api.replicate.com/v1",
    "apiKey": ""
  }
]
  }

  if (options?.method === 'PUT' && url === '/api/workflows') {
    return options.body
  }

  return mockData[url] || []
}
