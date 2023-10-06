import React, { ChangeEvent } from 'react';
import { ChatMessage } from '@/lib/types';

interface CriteriaTabProps {

}

const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setStateFunction: React.Dispatch<React.SetStateAction<number>>) => {
  setStateFunction(parseFloat(e.target.value));
};

interface CriteriaTabProps {
  category: string;
  text: string;
}

const systemMessage: ChatMessage = {
  role: 'system',
  content: 'Please review the following text and identify all the specified categories:',
};

export const CriteriaTab: React.FC<CriteriaTabProps> = ({ category, text }) => {
  const extractTask: ChatMessage = {
    role: 'user',
    content: `Review the following text. Identify all the ${category} in the text below \n\n Text: ${text}`,
  };

  const messages = [systemMessage, extractTask];

  return (
    <div className="row-span-2 border border-gray-300 p-2">
      <h2 className="text-xl">Evaluation Criteria</h2>
      <div className="flex justify-between items-center mb-4"></div>
    </div>
  );
};
