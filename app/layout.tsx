import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ModalProvider } from '@/providers/modal-provider'
import { ToastProvider } from '@/providers/toast-provider'
//import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Evaluate.ai',
  description: 'Automated Model Evaluation',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
            <ToastProvider />
            <ModalProvider />
            {children}

        </body>
      </html>
    </ClerkProvider>
  )
}