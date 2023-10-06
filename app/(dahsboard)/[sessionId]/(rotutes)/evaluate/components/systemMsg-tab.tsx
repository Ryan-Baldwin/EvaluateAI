import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface systemMsgtTabProps {
  systemMessage: string;
  setSystemMessage: React.Dispatch<React.SetStateAction<string>>;
}

export function SystemMsgtTab({ systemMessage, setSystemMessage }: systemMsgtTabProps): React.ReactElement {
  return (
    <div className="h-full w-full border border-gray-300 p-2 rounded-md">
      <Textarea
        value={systemMessage}
        onChange={(e) => setSystemMessage(e.target.value)}
        className="mt-1 mb-1 min-h-[20px] p-1 w-full h-full border border-gray-400 rounded text-left align-text-top"
        placeholder="You are one sassy assistant."
      />
    </div>
  );
}
