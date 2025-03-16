import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

interface CodeEditorProps {
  code: string
}

export function CodeEditor({ code }: CodeEditorProps) {
  return (
    <div className="h-full">
      <pre className="bg-gray-100 p-4 rounded-lg h-full overflow-auto">
        {code}
      </pre>
    </div>
  )
}
