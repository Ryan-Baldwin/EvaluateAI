import React, { ChangeEvent } from 'react';

interface ParametersTabProps {
  temperature: number;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  maxTokens: number;
  setMaxTokens: React.Dispatch<React.SetStateAction<number>>;
  topP: number;
  setTopP: React.Dispatch<React.SetStateAction<number>>;
  frequencyPenalty: number;
  setFrequencyPenalty: React.Dispatch<React.SetStateAction<number>>;
  numRuns: number;
  setNumRuns: React.Dispatch<React.SetStateAction<number>>;
}

export function ParametersTab({
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  topP,
  setTopP,
  frequencyPenalty,
  setFrequencyPenalty,
  numRuns,
  setNumRuns,
}: ParametersTabProps): React.ReactElement {




  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setStateFunction: React.Dispatch<React.SetStateAction<number>>) => {
    setStateFunction(parseFloat(e.target.value));
  };

  return (
    <div className="row-span-2 border border-gray-300 p-2">
      <h2 className="text-xl">Test Parameters</h2>
      <div className="flex justify-between items-center mb-4">
        <span>Temperature</span>
        <input type="number" step="0.1" value={temperature} onChange={(e) => handleInputChange(e, setTemperature)} className="w-20 text-right" />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span>Max Tokens</span>
        <input type="number" step="1" value={maxTokens} onChange={(e) => handleInputChange(e, setMaxTokens)} className="w-20 text-right"/>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span>Top P</span>
        <input type="number" step="0.1" value={topP} onChange={(e) => handleInputChange(e, setTopP)} className="w-20 text-right"/>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span>Frequency Penalty</span>
        <input type="number" step="0.1" value={frequencyPenalty} onChange={(e) => handleInputChange(e, setFrequencyPenalty)} className="w-20 text-right"/>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span>Batch size</span>
        <input type="number" step="1" value={numRuns} onChange={(e) => handleInputChange(e, setNumRuns)} className="w-20 text-right"/>
      </div>
    </div>
  );
}


