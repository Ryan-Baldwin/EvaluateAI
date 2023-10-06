//The Layout for the dashboard that we create base don the ID of the user 

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import Navbar from '@/components/navbar'
import { Sidebar } from "@/components/sidebar"

export default async function DashboardLayout({ 
    children, 
    params 
    }: {
        children: React.ReactNode;
        params: {sessionId: string};
    }) {
        const { userId } = auth();
        
        if (!userId) {
            redirect('/sign-in')
        }

        const session = await prismadb.session.findFirst({
            where: {
                id: params.sessionId,
                userId,
            },
        });
    
    if (!session) {
        redirect('/');
    };

    return (
        <>
        <Navbar />
        {children}
        </>
    );
};

