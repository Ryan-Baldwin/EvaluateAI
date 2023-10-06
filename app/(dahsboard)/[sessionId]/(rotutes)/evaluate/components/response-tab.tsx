import React from 'react';
import { ChatMessage } from '@/lib/types';


interface ResponsesTabProps {
  messages: ChatMessage[];
}

export function ResponsesTab({ messages }: ResponsesTabProps): React.ReactElement {
  return (
    <div className="response-tab">
      {messages.length === 0 ? (
        <p>No messages to display.</p>
      ) : (
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>{message.role}: </strong> {message.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}