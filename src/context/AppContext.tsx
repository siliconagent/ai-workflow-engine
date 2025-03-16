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
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }

const initialState: AppState = {
  rightPanelView: 'code',
  collapsed: false,
  fullScreen: false,
  apps: [],
  selectedWorkflow: null,
  llmProviders: [],
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
}

export const AppContext = createContext<AppContextValue>({
  ...initialState,
  setRightPanelView: () => {},
  toggleCollapse: () => {},
  toggleFullScreen: () => {},
  fetchApps: async () => {},
  fetchLLMProviders: async () => {},
  updateWorkflow: async () => {},
  setSelectedWorkflow: () => {}
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
        setSelectedWorkflow
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
