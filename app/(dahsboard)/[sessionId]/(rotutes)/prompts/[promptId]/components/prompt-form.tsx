"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Response, Prompt } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
  userMessage: z.string().min(1),
  systemMessage: z.string(),
});

type PromptFormValues = z.infer<typeof formSchema>

interface PromptFormProps {
  initialData: Prompt | null;
};

export const PromptForm: React.FC<PromptFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const title = initialData ? 'Edit prompt' : 'Create prompt';
  const description = initialData ? 'Edit a prompt.' : 'Add a new prompt';
  const toastMessage = initialData ? 'Prompt updated.' : 'Prompt created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData
  } : {
    userMessage: 'Find a restaurant for me',
    systemMessage: ''
  }

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: PromptFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.sessionId}/prompts/${params.promptId}`, data);
      } else {
        await axios.post(`/api/${params.sessionId}/prompts`, data);
      }
      router.refresh();
      router.push(`/${params.sessionId}/prompts`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.sessionId}/prompts/${params.promptId}`);
      router.refresh();
      router.push(`/${params.sessionId}/prompts`);
      toast.success('Prompt deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            Delete
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="userMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Message</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Enter user message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="systemMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Message</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Enter system message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
