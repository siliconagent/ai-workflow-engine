import { useContext } from 'react'
import { ChevronLeft, ChevronRight, Maximize, Minimize, Code, Eye, Workflow, Play } from 'lucide-react'
import { AppContext } from '../context/AppContext'

interface RightPanelProps {
  collapsed: boolean
  fullScreen: boolean
  onToggleCollapse: () => void
  onToggleFullScreen: () => void
}

export function ContextPanel({ collapsed, fullScreen, onToggleCollapse, onToggleFullScreen }: RightPanelProps) {
  const { rightPanelView, setRightPanelView, selectedWorkflow } = useContext(AppContext)

  const handleRightPanelViewChange = (view: 'code' | 'preview' | 'workflow' | 'execution') => {
    setRightPanelView(view)
  }

  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-50' : ''} ${collapsed ? 'w-16' : 'w-96'} transition-all duration-300 border-l border-gray-200 bg-white`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
					<button onClick={onToggleCollapse}>
						{collapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
					</button>
					<button onClick={onToggleFullScreen}>
						{fullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
					</button>
			</div>
			<div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <button
              className={`p-2 rounded-md ${rightPanelView === 'code' ? 'bg-gray-200' : ''}`}
              onClick={() => handleRightPanelViewChange('code')}
            >
              <Code className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-md ${rightPanelView === 'preview' ? 'bg-gray-200' : ''}`}
              onClick={() => handleRightPanelViewChange('preview')}
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-md ${rightPanelView === 'workflow' ? 'bg-gray-200' : ''}`}
              onClick={() => handleRightPanelViewChange('workflow')}
            >
              <Workflow className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-md ${rightPanelView === 'execution' ? 'bg-gray-200' : ''}`}
              onClick={() => handleRightPanelViewChange('execution')}
            >
              <Play className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 h-[calc(100%-4rem)]">
        {!collapsed && (
          <div className="h-full">
            {/* ... other panel views */}
          </div>
        )}
      </div>
    </div>
  )
}
