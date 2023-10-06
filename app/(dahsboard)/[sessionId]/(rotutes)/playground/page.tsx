"use client"


import { CounterClockwiseClockIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Menu } from "@/components/menu"
import { Sidebar } from "@/components/sidebar"


import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import OpenAI from "openai";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
//import { cn } from "@/lib/utils";

import { Textarea } from "@/components/ui/textarea"

import { MaxLengthSelector } from "./components/maxlength-selector"
import { ModelSelector } from "./components/model-selector"
import { PresetActions } from "./components/preset-actions"
import { PresetSave } from "./components/preset-save"
import { PresetSelector } from "./components/preset-selector"
import { TemperatureSelector } from "./components/temperature-selector"
import { TopPSelector } from "./components/top-p-selector"
import { models, types } from "./data/models"
import { presets } from "./data/presets"

import { formSchema } from "./constraints/user";


const PlaygroundPage =() => {
  const router = useRouter();
  const [systemMessage, setSystemMessage] = useState('You are a sassy assistant.');
  const [responseMessage, setResponseMessage] = useState("");
  const [temp, setTemperature] = useState<number[]>([0.5]);
  const [maxLength, setMaxLength] = useState<number[]>([100]);
  const [topP, setTopP] = useState<number[]>([0.5]);

  const [messages, setMessages] = useState<OpenAI.Chat.CreateChatCompletionRequestMessage[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = { role: "user", content: values.prompt };
      
      //annoying but necessary. The sliders are an array and the model requires an Int. There is probably a better way.
      const max_tokens = maxLength[0];
      const top_p = topP[0];
      const temperature = temp[0];

      // Send system message along with user message to the API
      const response = await axios.post('/api/ai/playground', { messages: [userMessage], systemMessageContent: systemMessage, temperature, max_tokens, top_p});
      const outputMessage = response.data; // assuming this is your output message
      setResponseMessage(outputMessage);
      console.log(response);
      setMessages(() => [response.data]);
      
      //form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
      } else {
        toast.error("Something went wrong.");
      }
    } 
  }

  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between sm:flex-row sm:items-center sm:space-y-0 md:h-10">
          <h2 className="text-lg font-semibold">Playground</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <PresetSelector presets={presets} />
            <PresetSave />
            <div className="hidden space-x-2 md:flex">
            </div>
            <PresetActions />
          </div>
        </div>
        <Separator />
        <div className="grid lg:grid-cols-5">
              <Sidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
        
        <Tabs defaultValue="edit" className="flex-1">
          <div className="container h-full py-6">
            <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
              <div className="hidden flex-col space-y-4 sm:flex md:order-2">
                <div className="grid gap-2">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Mode
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[320px] text-sm" side="left">
                      Choose the interface that best suits your task. You can
                      provide: a simple prompt to complete, starting and ending
                      text to insert a completion within, or some text with
                      instructions to edit it.
                    </HoverCardContent>
                  </HoverCard>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="edit">
                      <span className="sr-only">Edit</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-5 w-5"
                      >
                        <rect
                          x="4"
                          y="3"
                          width="12"
                          height="2"
                          rx="1"
                          fill="currentColor"
                        ></rect>
                        <rect
                          x="4"
                          y="7"
                          width="12"
                          height="2"
                          rx="1"
                          fill="currentColor"
                        ></rect>
                        <rect
                          x="4"
                          y="11"
                          width="3"
                          height="2"
                          rx="1"
                          fill="currentColor"
                        ></rect>
                        <rect
                          x="4"
                          y="15"
                          width="4"
                          height="2"
                          rx="1"
                          fill="currentColor"
                        ></rect>
                        <rect
                          x="8.5"
                          y="11"
                          width="3"
                          height="2"
                          rx="1"
                          fill="currentColor"
                        ></rect>
                        <path
                          d="M17.154 11.346a1.182 1.182 0 0 0-1.671 0L11 15.829V17.5h1.671l4.483-4.483a1.182 1.182 0 0 0 0-1.671Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </TabsTrigger>
                  </TabsList>
                </div>
                <ModelSelector types={types} models={models} />
                <TemperatureSelector value={temp} onValueChange={(newValue: number[]) => setTemperature(newValue)}/>
                <MaxLengthSelector value={maxLength} onValueChange={(newValue: number[]) => setMaxLength(newValue)} />
                <TopPSelector value={topP} onValueChange={(newValue: number[]) => setTopP(newValue)}/>
              </div>
              <div className="md:order-1">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} >
                      <TabsContent value="edit" className="mt-0 border-0 p-0">
                        <div className="flex flex-col space-y-4">
                          <div className="grid h-full gap-6 lg:grid-cols-2">
                            <div className="flex flex-col space-y-4">
                              <div className="flex flex-1 flex-col space-y-2">
                              <Label htmlFor="Prompt">Prompt</Label>
                              <FormField
                                name="prompt"
                                render={({ field }) => (
                                  <FormItem> 
                                    <FormControl>
                                      <Textarea
                                        id="input"
                                        disabled={isLoading} 
                                        placeholder="We is going to the market."
                                        className="flex-1 lg:min-h-[580px]"
                                        {...field}
                                      />
                                    </FormControl>
                                </FormItem>
                                )}
                              />  
                              </div>
                              <div className="flex flex-col space-y-2">
                                <Label htmlFor="instructions">Instructions</Label>
                                <Textarea
                                  value={systemMessage} 
                                  onChange={e => setSystemMessage(e.target.value)}
                                  id="System Message"
                                  placeholder="You are a sassy assistant."
                                  className="mt-1 p-2 w-full border rounded-md"
                                />
                              </div>
                            </div>
                              <div >
                              <Label htmlFor="Response">Response</Label>
                                <div
                                  id="Output"
                                  placeholder={isLoading ? 'Loading...' : 'Is that so? What is we getting there?'}
                                  className="min-h-[580px] rounded-md border bg-muted lg:min-h-[700px]"
                                >
                                  {messages.map((message) => (
                                    <p key={message.content} className="text-sm">
                                      {message.content}
                                    </p>
                                  ))}
                                </div>
                              </div>  
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button type="submit" disabled={isLoading}>
                            Submit
                            </Button>
                            <Button variant="secondary">
                              <span className="sr-only">Show history</span>
                              <CounterClockwiseClockIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                  </form>      
                </Form>      
              </div>
            </div>
          </div>
        </Tabs>
        </div>
        </div>
      </div>
    </>
  )

}

export default PlaygroundPage;