import { AppProvider } from './context/AppContext'
import { Navigator } from './components/Navigator'
import { ChatArea } from './components/ChatArea'
import { ContextPanel } from './components/ContextPanel'
import { useState } from 'react'

function App() {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [rightFullScreen, setRightFullScreen] = useState(false)

  return (
    <AppProvider>
      <div className="flex h-screen">
        <Navigator collapsed={leftCollapsed} onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)} />
        <ChatArea />
        <ContextPanel
          collapsed={rightCollapsed}
          fullScreen={rightFullScreen}
          onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
          onToggleFullScreen={() => setRightFullScreen(!rightFullScreen)}
        />
      </div>
    </AppProvider>
  )
}

export default App
