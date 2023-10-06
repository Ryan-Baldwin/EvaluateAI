import { useState } from "react";
import axios from "axios";

// Define a type for additional parameters like temperature, max tokens, etc.
interface AdditionalParams {
  temperature: number;
  top_p: number;
  max_tokens: number;
  // Add any other parameters here
}

// Define the return type of the hook
interface HookReturnType {
  savePrompt: (
    sessionId: string,
    finalPrompt: string,
    systemMessage: string,
    additionalParams?: AdditionalParams
  ) => Promise<string | null>;
  saveResponse: (
    sessionId: string,  // <-- Add sessionId here
    promptId: string,
    modelResponse: string,
    additionalParams?: AdditionalParams
  ) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const useSavePromptAndResponse = (): HookReturnType => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to save the prompt
  const savePrompt = async (
    sessionId: string,
    finalPrompt: string,
    systemMessage: string,
    additionalParams?: AdditionalParams
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
  
    try {
      const payload = {
        userMessage: finalPrompt,
        systemMessage,
        ...additionalParams,
      };
      const response = await axios.post(`/api/${sessionId}/prompts`, payload);
      return response.data.id;
    } catch (e) {
      setError(e as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to save the response
  const saveResponse = async (
    sessionId: string,  // <-- Add sessionId as a parameter
    promptId: string,
    modelResponse: string,
    additionalParams?: AdditionalParams
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
  
    try {
      const payload = {
        promptId,
        contenet: modelResponse,

        ...additionalParams,
      };
      await axios.post(`/api/${sessionId}/responses`, payload);  // <-- Update the API route
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    savePrompt,
    saveResponse,
    isLoading,
    error,
  };
};

export default useSavePromptAndResponse;
