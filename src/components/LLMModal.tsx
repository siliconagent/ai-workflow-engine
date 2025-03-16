import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface LLMProvider {
  id: string
  name: string
  models: string[]
  baseUrl: string
  apiKey: string
}

interface LLMModalProps {
  providers: LLMProvider[]
  onClose: () => void
  onSelect: (provider: LLMProvider) => void
}

const defaultProviders: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      'gpt-4-turbo',
      'gpt-4-turbo-preview',
      'gpt-4-0125-preview',
      'gpt-4-1106-preview',
      'gpt-4',
      'gpt-4-32k',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-vision-preview',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-1106',
      'gpt-3.5-turbo-16k',
      'text-embedding-3-small',
      'text-embedding-3-large',
      'text-embedding-ada-002',
      'tts-1',
      'tts-1-hd',
      'whisper-1',
      'dall-e-3',
      'dall-e-2'
    ],
    baseUrl: 'https://api.openai.com/v1',
    apiKey: ''
  },
  {
    id: 'deepseek',
    name: 'Deepseek',
    models: [
      'deepseek-chat',
      'deepseek-coder',
      'deepseek-llm-67b-chat',
      'deepseek-ai/deepseek-math-7b-instruct',
      'deepseek-ai/deepseek-coder-6.7b-instruct',
      'deepseek-ai/deepseek-coder-33b-instruct',
      'deepseek-llm-7b-chat',
      'deepseek-coder-6.7b-base',
      'deepseek-coder-6.7b-instruct',
      'deepseek-coder-33b-instruct',
      'deepseek-llm-67b-base',
      'deepseek-vl-7b-chat'
    ],
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: ''
  },
  {
    id: 'google',
    name: 'Google',
    models: [
      'gemini-pro',
      'gemini-pro-vision',
      'gemini-flash',
      'gemini-ultra',
      'gemini-1.0-pro',
      'gemini-1.0-pro-vision',
      'gemini-1.0-ultra',
      'gemini-1.0-ultra-vision',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-pro-vision',
      'gemini-1.5-ultra',
      'text-embedding-004',
      'text-embedding-gecko',
      'text-bison',
      'chat-bison',
      'code-bison',
      'palm-2'
    ],
    baseUrl: 'https://generativelanguage.googleapis.com',
    apiKey: ''
  },
  {
    id: 'groq',
    name: 'Groq',
    models: [
      'llama3-8b-8192',
      'llama3-70b-8192',
      'llama3-70b-4096',
      'mixtral-8x7b-32768',
      'mixtral-8x7b-instruct-v0.1',
      'gemma-7b-it',
      'gemma-2b-it',
      'claude-3-haiku-20240307',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'falcon-40b-instruct',
      'codellama-34b-instruct',
      'llama2-70b-4096'
    ],
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKey: ''
  },
  {
    id: 'huggingface',
    name: 'HuggingFace',
    models: [
      'tiiuae/falcon-40b',
      'tiiuae/falcon-7b',
      'meta-llama/Llama-2-70b-chat-hf',
      'meta-llama/Llama-2-13b-chat-hf',
      'meta-llama/Llama-2-7b-chat-hf',
      'meta-llama/Meta-Llama-3-8B',
      'meta-llama/Meta-Llama-3-70B',
      'mistralai/Mixtral-8x7B-v0.1',
      'mistralai/Mistral-7B-Instruct-v0.2',
      'mistralai/Mistral-7B-v0.1',
      'stabilityai/stablelm-3b-4e1t',
      'stabilityai/stablelm-tuned-alpha-7b',
      'google/gemma-7b',
      'google/gemma-2b',
      'microsoft/phi-2',
      'bigcode/starcoder2-15b',
      'bigcode/starcoder2-3b',
      'codellama/CodeLlama-34b-Instruct-hf',
      'togethercomputer/RedPajama-INCITE-7B-Chat'
    ],
    baseUrl: 'https://api-inference.huggingface.co/models',
    apiKey: ''
  },
  {
    id: 'ollama',
    name: 'Ollama',
    models: [
      'llama3',
      'llama3:8b',
      'llama3:70b',
      'llama2',
      'llama2:7b',
      'llama2:13b',
      'llama2:70b',
      'mixtral',
      'mixtral:8x7b',
      'mixtral:8x22b',
      'mistral',
      'mistral:7b',
      'mistral:openorca',
      'phi3',
      'phi3:mini',
      'phi3:medium',
      'phi3:small',
      'gemma',
      'gemma:2b',
      'gemma:7b',
      'llava',
      'llava:13b',
      'llava:34b',
      'codegemma',
      'codellama',
      'codellama:7b',
      'codellama:13b',
      'codellama:34b',
      'neural-chat',
      'wizard-math',
      'falcon',
      'nous-hermes',
      'vicuna',
      'orca-mini',
      'stablelm',
      'qwen'
    ],
    baseUrl: 'http://localhost:11434/api',
    apiKey: ''
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    models: [
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-haiku',
      'anthropic/claude-3.5-sonnet',
      'meta-llama/llama-3-70b-instruct',
      'meta-llama/llama-3-8b-instruct',
      'mistralai/mistral-large-latest',
      'mistralai/mixtral-8x7b-instruct',
      'google/gemini-pro',
      'google/gemini-1.5-pro',
      'deepseek/deepseek-coder',
      'cohere/command-r-plus'
    ],
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: ''
  },
  {
    id: 'openaiilike',
    name: 'OpenAILike',
    models: [
      'custom-model-1',
      'custom-model-2',
      'local-model',
      'self-hosted-llm',
      'vllm-served-model',
      'llama.cpp-server',
      'text-generation-webui',
      'koboldcpp-model',
      'openai-compatible-endpoint'
    ],
    baseUrl: 'https://your-custom-endpoint.com/v1',
    apiKey: ''
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    models: [
      'sonar-small-online',
      'sonar-medium-online',
      'sonar-large-online',
      'sonar-small-chat',
      'sonar-medium-chat',
      'sonar-large-chat',
      'pplx-7b-online',
      'pplx-7b-chat',
      'pplx-70b-online',
      'pplx-70b-chat',
      'mixtral-8x7b-instruct',
      'llama-3-8b-instruct',
      'llama-3-70b-instruct',
      'codellama-34b-instruct'
    ],
    baseUrl: 'https://api.perplexity.ai',
    apiKey: ''
  },
  {
    id: 'lmstudio',
    name: 'LMStudio',
    models: [
      'local-model',
      'downloaded-model',
      'quantized-model',
      'llama2-7b-chat-q4',
      'llama2-13b-chat-q4',
      'llama2-70b-chat-q4',
      'mistral-7b-instruct-q4',
      'mixtral-8x7b-instruct-q4',
      'llama3-8b-q4',
      'llama3-70b-q4',
      'phi3-mini-4k-instruct-q4',
      'gemma-7b-instruct-q4',
      'custom-gguf-model'
    ],
    baseUrl: 'http://localhost:1234/v1',
    apiKey: ''
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
      'claude-3.5-sonnet-20240620',
      'claude-3.7-sonnet-20250219',
      'claude-3-haiku',
      'claude-3-sonnet',
      'claude-3-opus',
      'claude-3.5-sonnet',
      'claude-3.7-sonnet',
      'claude-2.0',
      'claude-2.1',
      'claude-instant-1.2'
    ],
    baseUrl: 'https://api.anthropic.com/v1',
    apiKey: ''
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    models: [
      'mistral-small',
      'mistral-medium',
      'mistral-large',
      'mistral-tiny',
      'mistral-embed',
      'mistral-small-latest',
      'mistral-medium-latest',
      'mistral-large-latest',
      'open-mistral-7b',
      'open-mixtral-8x7b',
      'mistral-7b-instruct-v0.1',
      'mistral-7b-instruct-v0.2',
      'mixtral-8x7b-instruct-v0.1'
    ],
    baseUrl: 'https://api.mistral.ai/v1',
    apiKey: ''
  },
  {
    id: 'cohere',
    name: 'Cohere',
    models: [
      'command',
      'command-light',
      'command-r',
      'command-r-plus',
      'command-nightly',
      'command-light-nightly',
      'embed-english-v3.0',
      'embed-multilingual-v3.0',
      'embed-english-light-v3.0',
      'embed-multilingual-light-v3.0',
      'rerank-english-v3.0',
      'rerank-multilingual-v3.0',
      'summarize-medium',
      'summarize-xlarge',
      'generate-medium',
      'generate-xlarge'
    ],
    baseUrl: 'https://api.cohere.ai/v1',
    apiKey: ''
  },
  {
    id: 'together',
    name: 'TogetherAI',
    models: [
      'togethercomputer/llama-3-70b-instruct',
      'togethercomputer/llama-3-8b-instruct',
      'togethercomputer/llama-2-70b-chat',
      'togethercomputer/RedPajama-INCITE-7B-Chat',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'mistralai/Mistral-7B-Instruct-v0.2',
      'meta-llama/Llama-2-7b-chat-hf',
      'meta-llama/Llama-2-13b-chat-hf',
      '01-ai/Yi-34B-Chat',
      'Qwen/Qwen1.5-72B-Chat',
      'google/gemma-7b-it',
      'NousResearch/Nous-Hermes-2-Yi-34B',
      'upstage/SOLAR-10.7B-Instruct-v1.0'
    ],
    baseUrl: 'https://api.together.xyz/v1',
    apiKey: ''
  },
  {
    id: 'replicate',
    name: 'Replicate',
    models: [
      'meta/llama-3-70b-instruct',
      'meta/llama-3-8b-instruct',
      'meta/llama-2-70b-chat',
      'stability-ai/stable-diffusion-xl',
      'stability-ai/sdxl-turbo',
      'stability-ai/stable-video-diffusion',
      'midjourney/midjourney',
      'cogvlm/cogvlm-chat',
      'mistralai/mistral-7b-instruct-v0.2',
      'mistralai/mixtral-8x7b-instruct-v0.1',
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-haiku'
    ],
    baseUrl: 'https://api.replicate.com/v1',
    apiKey: ''
  }
]

export function LLMModal({ providers = defaultProviders, onClose, onSelect }: LLMModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider | null>(null)
  const [modelName, setModelName] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    if (selectedProvider) {
      setBaseUrl(selectedProvider.baseUrl)
      setApiKey(selectedProvider.apiKey)
    } else {
      setBaseUrl('')
      setApiKey('')
    }
  }, [selectedProvider])

  const handleProviderSelect = (provider: LLMProvider) => {
    setSelectedProvider(provider)
  }

  const handleConfirm = () => {
    if (selectedProvider) {
      const selectedModel = selectedProvider.models.find(model => model === modelName)
      if (selectedModel) {
        onSelect({ ...selectedProvider, baseUrl, apiKey })
        onClose()
      } else {
        alert('Please select a valid model name for the selected provider.')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Select LLM Provider</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label htmlFor="providerName" className="block text-sm font-medium text-gray-700">
              Provider Name:
            </label>
            <select
              id="providerName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={selectedProvider ? selectedProvider.id : ''}
              onChange={e => {
                const provider = providers.find(p => p.id === e.target.value)
                if (provider) {
                  handleProviderSelect(provider)
                } else {
                  setSelectedProvider(null)
                }
                setModelName('')
              }}
            >
              <option value="">Select Provider</option>
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProvider && (
          <div className="mt-4 space-y-2">
            <div>
              <label htmlFor="modelName" className="block text-sm font-medium text-gray-700">
                Model Name:
              </label>
              <select
                id="modelName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={modelName}
                onChange={e => setModelName(e.target.value)}
              >
                <option value="">Select Model</option>
                {selectedProvider.models.map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700">
                Base URL:
              </label>
              <input
                type="text"
                id="baseUrl"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                API Key:
              </label>
              <input
                type="text"
                id="apiKey"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
