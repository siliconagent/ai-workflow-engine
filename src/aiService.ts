import { OpenAI } from "langchain/llms/openai"
import { DeepLake } from "langchain/document_loaders/web/deeplake"
import { HuggingFaceInference } from "langchain/llms/hf"
import { Cohere } from "langchain/llms/cohere"
import { BaseLLM } from "langchain/llms/base"

interface LLMProvider {
  id: string
  name: string
  models: string[]
  baseUrl: string
  apiKey: string
}

const createLLMInstance = (
  selectedLLMProvider: LLMProvider,
  modelName: string
): BaseLLM => {
  switch (selectedLLMProvider.id) {
    case "openai":
      return new OpenAI({
        openAIApiKey: selectedLLMProvider.apiKey,
        modelName: modelName || "gpt-3.5-turbo"
      })
    case "cohere":
      return new Cohere({
        apiKey: selectedLLMProvider.apiKey,
        model: modelName || "command"
      })
    case "huggingface":
      return new HuggingFaceInference({
        apiKey: selectedLLMProvider.apiKey,
        model: modelName || "google/flan-t5-xxl"
      })
    default:
      console.warn(`Provider ${selectedLLMProvider.id} not fully supported, using OpenAI.`)
      return new OpenAI({
        openAIApiKey: selectedLLMProvider.apiKey,
        modelName: modelName || "gpt-3.5-turbo"
      })
  }
}

export const callLLM = async (
  input: string,
  selectedLLMProvider: LLMProvider | null,
  modelName: string
): Promise<string> => {
  if (!selectedLLMProvider) {
    throw new Error("Please select an LLM provider.")
  }

  try {
    const llm = createLLMInstance(selectedLLMProvider, modelName)
    const response = await llm.call(input)
    return response
  } catch (error: any) {
    console.error("Error calling LLM:", error)
    throw new Error(`Error calling LLM: ${error.message}`)
  }
}
