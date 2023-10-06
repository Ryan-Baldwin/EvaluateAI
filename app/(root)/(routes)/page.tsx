"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useSessionModal } from "@/hooks/use-session-modal";

const SetupPage = () => {
  const onOpen = useSessionModal((state) => state.onOpen);
  const isOpen = useSessionModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};
 
export default SetupPage;