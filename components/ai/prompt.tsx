// Prompt.tsx
import React, { useState } from 'react';

interface PromptProps {
  onSubmission: (systemMessage: string, userMessage: string) => void;
}

const Prompt: React.FC<PromptProps> = ({ onSubmission }) => {
  const [systemMessage, setSystemMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmission(systemMessage, userMessage);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>System Message:</label>
        <input 
          value={systemMessage} 
          onChange={e => setSystemMessage(e.target.value)} 
        />
      </div>
      <div>
        <label>User Message:</label>
        <input 
          value={userMessage} 
          onChange={e => setUserMessage(e.target.value)} 
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Prompt;
