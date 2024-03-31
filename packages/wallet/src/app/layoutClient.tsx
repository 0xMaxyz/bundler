'use client'
import { UserContextProvider } from '@/context/userContext'
import { SnackbarProvider } from 'notistack'
import { Exo } from 'next/font/google'

const exo_font = Exo({ weight: ['400'], subsets: ['latin'] })

export default function ClientRootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <UserContextProvider>
      <SnackbarProvider>
        <body className={exo_font.className}>{children}</body>
      </SnackbarProvider>
    </UserContextProvider>
  )
}
