import { useState } from 'react'
import { X } from 'lucide-react'

interface LLMProvider {
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

export function LLMModal({ providers, onClose, onSelect }: LLMModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider | null>(null)

  const handleProviderSelect = (provider: LLMProvider) => {
    setSelectedProvider(provider)
  }

  const handleConfirm = () => {
    if (selectedProvider) {
      onSelect(selectedProvider)
      onClose()
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
          {providers && providers.length > 0 ? (
            providers.map(provider => (
              <div
                key={provider.name}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedProvider?.name === provider.name ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleProviderSelect(provider)}
              >
                <p className="font-medium">{provider.name}</p>
                <p className="text-sm text-gray-500">{provider.models.join(', ')}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No providers available</p>
          )}
        </div>
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
