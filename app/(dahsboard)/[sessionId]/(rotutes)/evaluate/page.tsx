"use client"
import React, { useState, ChangeEvent } from 'react';
import { ChatMessage } from '@/lib/types';

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Menu } from "@/components/menu"
import { Sidebar } from "@/components/sidebar"

import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // import Zod if you are using it for form validation
import { toast } from "react-hot-toast";

import {PromptTab} from './components/prompt-tab';  // Generic prompt tab
import {InjectionTab} from './components/injection-tab';  // Generic injection tab
import {ResponsesTab} from './components/response-tab';  // Generic response tab
import {ParametersTab} from './components/test-parameters-tab';  // Generic parameters tab
import {CriteriaTab} from './components/criteria-tab';  // Generic criteria tab
import { SystemMsgtTab } from './components/systemMsg-tab';
import { ResultsTab } from './components/results-tab';

import { ModelSelector } from "./components/parameters/model-selector"
import { types, models, Model } from "./components/parameters/models"


const formSchema = z.object({
  prompt: z.string(),
  // add other form fields here
});


interface workspacePageProps {
  params: {
    sessionId: string;
  };
};

const workspacePage: React.FC<workspacePageProps> = ({params} ) => {
  const [prompt, setPrompt] = useState<string>('');
  const [systemMessage, setSystemMessage] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responses, setResponses] = useState<ChatMessage[]>([]);

  const [selectedModel, setSelectedModel] = useState<Model<string>>(models[0]);
  const [temperature, setTemperature] = useState<number>(1.0);
  const [maxTokens, setMaxTokens] = useState<number>(100);
  const [topP, setTopP] = useState<number>(0.9);
  const [frequencyPenalty, setFrequencyPenalty] = useState<number>(0);
  const [numRuns, setNumRuns] = useState<number>(1);

  const setPromptWrapper: React.Dispatch<React.SetStateAction<string>> = (newValue) => {
    if (typeof newValue === 'function') {
      form.setValue('prompt', newValue(form.watch('prompt')));
    } else {
      form.setValue('prompt', newValue);
    }
  };
  
  const [inputs, setInputs] = useState<{ key: string, value: string }[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      // add other default values here
    },
  });

  const onSubmit = async () => {
    // Get the prompt from the form
    const formData = form.getValues();
    let finalPrompt = formData.prompt;
  
    // Prepare the prompt by substituting keys with values
    inputs.forEach((input) => {
      const placeholder = `{${input.key}}`;
      const value = input.value;
      finalPrompt = finalPrompt.replace(new RegExp(placeholder, 'g'), value);
    });
    const userMessage: ChatMessage = { role: 'user', content: finalPrompt };
  
    try {

      const savedPrompt = await axios.post(`/api/${params.sessionId}/prompts`, { 
        userMessage: finalPrompt, 
        systemMessage: systemMessage, 
        sessionId: params.sessionId,
      });

      const promptId = savedPrompt.data.id; 

      // Loop based on the number of runs to make multiple AI API calls
      for (let i = 0; i < numRuns; i++) {
        // Send the message to the model and get a response
        const response = await axios.post('/api/ai/chat', {
          messages: [userMessage],
          systemMessageContent: systemMessage,
          temperature,
          max_tokens: maxTokens,
          top_p: topP,
          model: selectedModel.name
        });
        
        const newResponse: ChatMessage = response.data;
        setResponses(prevResponses => [...prevResponses, newResponse]);
        console.log(response);

        // Save the model's response to the database
        await axios.post(`/api/${params.sessionId}/responses`,{
          content: newResponse.content,
          promptId: promptId,
          sessionId: params.sessionId,
          temperature: temperature,
          top_p: topP,
          max_tokens: maxTokens,
          model: selectedModel.name
        });
      }


    } catch (error: any) {
      if (error?.response?.status === 403) {
        // Handle specific 403 error
      } else {
        toast.error("Something went wrong.");
      }
    } 
  };
  

  
  return (
    <>
      <div className="hidden md:block">
        <Menu />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="Prompts" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="Prompts" className="relative"> Prompts </TabsTrigger>
                        <TabsTrigger value="Responses" className="relative"> Responses </TabsTrigger>
                        <TabsTrigger value="Parameters"> Parameters</TabsTrigger>
                        <TabsTrigger value="Criteria"> Criteria</TabsTrigger>
                        <TabsTrigger value="Results"> Results</TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <Button type="submit" onClick={onSubmit}>Run</Button>
                      </div>
                    </div>
                    <TabsContent
                      value="Prompts"
                      className="border-none p-0 outline-none"
                    >
                      <div className="items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Prompts
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Enter your propmts and keyed inputs
                          </p>
                          <PromptTab prompt={form.watch('prompt')} setPrompt={setPromptWrapper} />
                          <SystemMsgtTab systemMessage={systemMessage} setSystemMessage={setSystemMessage} />
                          <InjectionTab inputs={inputs} setInputs={setInputs} />
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Responses
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          AI generated responses
                        </p>
                        <ResponsesTab messages={responses} />
                      </div>
                      <Separator className="my-4" />

                    </TabsContent>
                    <TabsContent
                      value="Responses"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                           Responses
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Completions from the AI
                          </p>
                        </div>
                        
                      </div>
                      <Separator className="my-4" />
                      <ResponsesTab messages={responses} />
                    </TabsContent>
                    <TabsContent
                      value="Parameters"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                           Parameters
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Parameters for the AI
                          </p>
                        </div>
                        
                      </div>
                      <Separator className="my-4" />

                      <ModelSelector types={types} models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
                      <ParametersTab 
                        temperature={temperature}
                        setTemperature={setTemperature}
                        maxTokens={maxTokens}
                        setMaxTokens={setMaxTokens}
                        topP={topP}
                        setTopP={setTopP}
                        frequencyPenalty={frequencyPenalty}
                        setFrequencyPenalty={setFrequencyPenalty}
                        numRuns={numRuns}
                        setNumRuns={setNumRuns}
                      />
                    </TabsContent>
                    <TabsContent
                      value="Criteria"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                           Criteria
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Evaluation criteria
                          </p>
                        </div>
                        
                      </div>
                      <Separator className="my-4" />
                      <CriteriaTab 

                      />
                    </TabsContent>
                    <TabsContent
                      value="Results"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                           Results
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            
                          </p>
                        </div>
                        
                      </div>
                      <Separator className="my-4" />
                      <ResultsTab />
                      </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default workspacePage;