import React, { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'

interface InjectionTabProps {
  inputs: { key: string, value: string }[];
  setInputs: React.Dispatch<React.SetStateAction<{ key: string, value: string }[]>>;
}

export function InjectionTab({ inputs, setInputs }: InjectionTabProps): React.ReactElement {
  const handleAddInput = () => {
    setInputs([...inputs, { key: '', value: '' }]);
  };

  const handleDeleteInput = (index: number) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  return (
    <div className="w-full border border-gray-300 p-2">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl">Inputs</h2>
        <Button onClick={handleAddInput}>+</Button>
      </div>
      {inputs.map((input, index) => (
        <div className="flex justify-between items-center mb-4" key={index}>
          <Input 
            type="text" 
            placeholder="name" 
            value={input.key} 
            onChange={(e) => {
              const newInputs = [...inputs];
              newInputs[index].key = e.target.value;
              setInputs(newInputs);
            }}
          />
          <Input 
            type="text" 
            placeholder="Johny" 
            value={input.value} 
            onChange={(e) => {
              const newInputs = [...inputs];
              newInputs[index].value = e.target.value;
              setInputs(newInputs);
            }}
          />
          <Button onClick={() => handleDeleteInput(index)}>-</Button>
        </div>
      ))}
    </div>
  );
}
