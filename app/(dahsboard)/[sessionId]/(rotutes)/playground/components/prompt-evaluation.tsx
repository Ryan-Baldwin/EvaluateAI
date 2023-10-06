"use client"

import { CounterClockwiseClockIcon } from "@radix-ui/react-icons"
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import  ChatCompletionRequestMessage  from "openai";

import { formSchema } from "../constraints/user";

import { ChatWindow } from "@/components/ChatWindow";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import React, { useState } from 'react';

const SimplePromptResponseTab: React.FC = () => {
    const router = useRouter();
    const [promptValue, setPromptValue] = useState<string>('');
    const [response, setResponse] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>(
        {
          resolver: zodResolver(formSchema),
          defaultValues: {
            prompt: '',
          }
        });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
            const newMessages = [...messages, userMessage];
            
            const response = await axios.post('/api/conversation', { messages: newMessages });
            setMessages((current) => [...current, userMessage, response.data]);
            
            form.reset();
        } 
        catch (error: any) {console.log(error)} 
        finally {router.refresh}
            
    };        

    return (
        <TabsContent value="insert" className="mt-0 border-0 p-0">
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                >

                                        
                    <div className="flex flex-col space-y-4">
                    <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                            <FormField
                            name="prompt"
                            render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-10">
                                <FormControl className="m-0 p-0">
                                <Input
                                    className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                    disabled={isLoading} 
                                    placeholder="How do I calculate the radius of a circle?" 
                                    {...field}
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                        <div className="rounded-md border bg-muted">div</div>
                        div2
                    </div>
                    div 3
                    <div className="flex items-center space-x-2">
                        <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                            Generate
                        </Button>
                        <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <CounterClockwiseClockIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    </div>
                </form>
            </Form>
      </TabsContent>
        );
}
export default SimplePromptResponseTab;
