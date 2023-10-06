// Response.tsx
import React from 'react';

interface ResponseProps {
  modelResponse: string;
}

const Response: React.FC<ResponseProps> = ({ modelResponse }) => {
  return (
    <div>
      <strong>Model Response:</strong>
      <p>{modelResponse}</p>
    </div>
  );
}

export default Response;
