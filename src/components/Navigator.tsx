import { useState, useContext } from 'react'
import { ChevronLeft, ChevronRight, History, Grid, Edit, Play } from 'lucide-react'
import { AppContext } from '../context/AppContext'

interface LeftPanelProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

interface App {
  name: string
  description: string
  expanded: boolean
  workflows: Workflow[]
}

interface Workflow {
  name: string
  lastRun: string
  code: string
  preview: string
  workflowDesign: string
  workflowExecution: string
}

export function Navigator({ collapsed, onToggleCollapse }: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'apps'>('history')
  const { apps, setApps, setSelectedWorkflow, setRightPanelView } = useContext(AppContext)

  const toggleApp = (index: number) => {
    setApps(prev => prev.map((app, i) => 
      i === index ? { ...app, expanded: !app.expanded } : app
    ))
  }

  const handleWorkflowEdit = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    setRightPanelView('workflow')
  }

  const handleWorkflowRun = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    setRightPanelView('execution')
  }

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 border-r border-gray-200 bg-white`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <button
          className="p-2 rounded-lg hover:bg-gray-100"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-lg ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={20} />
          </button>
          <button
            className={`p-2 rounded-lg ${activeTab === 'apps' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveTab('apps')}
          >
            <Grid size={20} />
          </button>
        </div>
      </div>
      <div className="p-4">
        {!collapsed && (
          <div className="space-y-2">
            {activeTab === 'apps' && (
              apps.map((app, index) => (
                <div key={app.name} className="bg-gray-100 rounded-lg">
                  <div 
                    className="p-3 cursor-pointer"
                    onClick={() => toggleApp(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.description}</p>
                      </div>
                      {app.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                  {app.expanded && (
                    <div className="pl-4 pr-2 pb-2 space-y-2">
                      {app.workflows.map(workflow => (
                        <div key={workflow.name} className="p-2 bg-white rounded-md flex items-center justify-between">
                          <div>
                            <p className="text-sm">{workflow.name}</p>
                            <p className="text-xs text-gray-500">Last run: {workflow.lastRun}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() => handleWorkflowEdit(workflow)}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="p-1 hover:bg-gray-100 rounded" 
                              onClick={() => handleWorkflowRun(workflow)}
                            >
                              <Play size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
