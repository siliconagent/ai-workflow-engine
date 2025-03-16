import { useState, useContext } from 'react'
import { ChevronLeft, ChevronRight, History, Grid, Edit, Play } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { useApi } from '../hooks/useApi'

interface LeftPanelProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Navigator({ collapsed, onToggleCollapse }: LeftPanelProps) {
  const { 
    apps,
    loading,
    error,
    selectedWorkflow,
    setSelectedWorkflow,
    setRightPanelView,
    updateWorkflow
  } = useContext(AppContext)
  const { sendRequest } = useApi()
  const [activeTab, setActiveTab] = useState<'apps' | 'history'>('apps')

  // const toggleApp = async (index: number) => {
  //   const updatedApps = apps.map((app, i) => 
  //     i === index ? { ...app, expanded: !app.expanded } : app
  //   );
  //   try {
  //     await sendRequest({
  //       url: '/api/apps',
  //       method: 'PUT',
  //       body: updatedApps
  //     })
  //   } catch (err) {
  //     console.error('Failed to update apps:', err)
  //   }
  // }

  const handleWorkflowEdit = (workflow: any) => {
    if (!workflow) return
    setSelectedWorkflow(workflow)
    setRightPanelView('workflow')
  }

  const handleWorkflowRun = async (workflow: typeof selectedWorkflow) => {
    if (!workflow) return
    try {
      await updateWorkflow(workflow)
      setRightPanelView('execution')
    } catch (err) {
      console.error('Failed to run workflow:', err)
    }
  }

  if (loading) return <div className="p-4">Loading apps...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 border-r border-gray-200 bg-white`}>
      <button 
        className="p-2 hover:bg-gray-100"
        onClick={onToggleCollapse}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      <div className="flex border-b border-gray-200">
        <button
          className={`${
            activeTab === 'apps' ? 'bg-gray-100' : 'hover:bg-gray-100'
          } py-2 px-4`}
          onClick={() => setActiveTab('apps')}
        >
          Apps
        </button>
        <button
          className={`${
            activeTab === 'history' ? 'bg-gray-100' : 'hover:bg-gray-100'
          } py-2 px-4`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {activeTab === 'apps' && (
        <div className="p-4">
          <h5 className="text-sm font-bold text-gray-500 uppercase mb-2">Applications</h5>
          {apps && apps.map((app, index) => (
            <div key={app.id} className="mb-2">
              {/* <button
                className="flex items-center justify-between w-full py-2 px-3 hover:bg-gray-100"
                onClick={() => {
                  toggleApp(index);
                }}
              >
                <span>{app.name}</span>
                {app.expanded ? <ChevronUp /> : <ChevronDown />}
              </button> */}
              {/* {app.expanded && app.workflows && ( */}
                <div className="ml-4">
                  {app.workflows.map(workflow => (
                    <div key={workflow.id} className="flex items-center justify-between py-2 px-3 hover:bg-gray-100">
                      <span className="text-sm">{workflow.name}</span>
                      <div>
                        <button onClick={() => handleWorkflowEdit(workflow)} className="mr-2">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleWorkflowRun(workflow)}>
                          <Play size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              {/* )} */}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-4">
          <h5 className="text-sm font-bold text-gray-500 uppercase mb-2">History</h5>
          <button className="flex items-center py-2 px-3 hover:bg-gray-100">
            <History size={16} className="mr-2" />
            <span>View History</span>
          </button>
        </div>
      )}

      <div className="p-4">
        <h5 className="text-sm font-bold text-gray-500 uppercase mb-2">Grid</h5>
        <button className="flex items-center py-2 px-3 hover:bg-gray-100">
          <Grid size={16} className="mr-2" />
          <span>View Grid</span>
        </button>
      </div>
    </div>
  )
}
