//The Layout for the dashboard that we create base don the ID of the user 

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import Navbar from '@/components/navbar'
import { Metadata } from "next"


export const metadata: Metadata = {
    title: "Evaluate",
    description: "Test and Evalaute LLM Performance.",
  }

export default async function PlaygroundLayout({ 
    children, 

    }: {
        children: React.ReactNode;
    }) {
        

    return (
        <>
        {children}
        </>
    );
};

