import { useState, useContext, useEffect } from 'react'
import { Send, User, Bot, Settings } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { LLMModal } from './LLMModal'
import { callLLM } from '../aiService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [showLLMModal, setShowLLMModal] = useState(false)
  const { selectedLLMProvider } = useContext(AppContext)
  const [modelName, setModelName] = useState<string>('')

  const handleSend = async () => {
    if (!input) return

    const newMessage: Message = {
      id: String(messages.length + 1),
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    setMessages([...messages, newMessage])
    setInput('')

    if (selectedLLMProvider) {
      try {
        const response = await callLLM(input, selectedLLMProvider, modelName)

        const assistantMessage: Message = {
          id: String(messages.length + 2),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }
        setMessages([...messages, assistantMessage])
      } catch (error: any) {
        console.error("Error calling LLM:", error)
        const errorAssistantMessage: Message = {
          id: String(messages.length + 2),
          role: 'assistant',
          content: `Error calling LLM. Please check the console for details: ${error.message}`,
          timestamp: new Date()
        }
        setMessages([...messages, errorAssistantMessage])
      }
    } else {
      const noProviderMessage: Message = {
        id: String(messages.length + 2),
        role: 'assistant',
        content: 'Please select an LLM provider.',
        timestamp: new Date()
      }
      setMessages([...messages, noProviderMessage])
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 ${message.role === 'user' ? 'bg-gray-100' : 'bg-white'}`}
          >
            <div className="flex items-center gap-2">
              {message.role === 'user' ? (
                <User size={20} className="text-blue-500" />
              ) : (
                <Bot size={20} className="text-green-500" />
              )}
              <p className="text-gray-700">{message.content}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => setShowLLMModal(true)}
            className="p-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={handleSend}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {showLLMModal && (
        <LLMModal
          onClose={() => setShowLLMModal(false)}
          onSelect={(provider) => {
            // When a provider is selected in the modal, update the selected LLM provider and model name in the ChatArea
            // You might want to store the model name in the AppContext as well, depending on your needs
            const { id, name, models, baseUrl, apiKey } = provider
            const selectedModel = models[0] // Select the first model by default or let the user choose in LLMModal
            setModelName(selectedModel)
          }}
        />
      )}
    </div>
  )
}
