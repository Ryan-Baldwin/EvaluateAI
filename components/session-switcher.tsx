"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSessionModal } from "@/hooks/use-session-modal"
import { useParams, useRouter } from "next/navigation"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface SessionSwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[];
}

export default function SessionSwitcher({ className, items = [] }: SessionSwitcherProps) {
  const sessionModal = useSessionModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const currentSession = formattedItems.find((item) => item.value === params.sessionId);

  const [open, setOpen] = React.useState(false)

  const onSessionSelect = (session: { value: string, label: string }) => {
    setOpen(false);
    router.push(`/${session.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a session"
          className={cn("w-[200px] justify-between", className)}
        >
          <Store className="mr-2 h-4 w-4" />
          {currentSession?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search session..." />
            <CommandEmpty>No session found.</CommandEmpty>
            <CommandGroup heading="Store">
              {formattedItems.map((session) => (
                <CommandItem
                  key={session.value}
                  onSelect={() => onSessionSelect(session)}
                  className="text-sm"
                >
                  <Store className="mr-2 h-4 w-4" />
                  {session.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentSession?.value === session.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  sessionModal.onOpen()
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Session
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};