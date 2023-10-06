import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface PromptTabProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

export function PromptTab({ prompt, setPrompt }: PromptTabProps): React.ReactElement {
  return (
    <div className="h-full w-full border border-gray-300 p-2 rounded-md">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mt-1 mb-1 min-h-[170px] p-1 w-full h-full border border-gray-400 rounded text-left align-text-top"
        placeholder="Hello {name}, welcome to {event}! Hope you enjoy your time here."
      />
    </div>
  );
}
