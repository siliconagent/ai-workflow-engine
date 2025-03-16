import { createContext, useState } from 'react'

interface AppContextValue {
  rightPanelView: 'code' | 'preview' | 'workflow' | 'execution'
  setRightPanelView: (view: 'code' | 'preview' | 'workflow' | 'execution') => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  fullScreen: boolean
  setFullScreen: (fullScreen: boolean) => void
  // ... other context values
}

export const AppContext = createContext<AppContextValue>({
  rightPanelView: 'code',
  setRightPanelView: () => {},
  collapsed: false,
  setCollapsed: () => {},
  fullScreen: false,
  setFullScreen: () => {},
  // ... other context values
})

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [rightPanelView, setRightPanelView] = useState<'code' | 'preview' | 'workflow' | 'execution'>('code')
  const [collapsed, setCollapsed] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)

  // ... other context state

  return (
    <AppContext.Provider value={{ rightPanelView, setRightPanelView, collapsed, setCollapsed, fullScreen, setFullScreen, /* ... other context values */ }}>
      {children}
    </AppContext.Provider>
  )
}
