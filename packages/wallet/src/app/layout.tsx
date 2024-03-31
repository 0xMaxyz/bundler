import { UserContextProvider } from '@/context/userContext'
import './globals.css'
import { SnackbarProvider } from 'notistack'
import { Exo } from 'next/font/google'
import backgroundImage from '@/public/Frame.svg'
import './globals.css'
import ClientRootLayout from './layoutClient'

const exo_font = Exo({ weight: ['400'], subsets: ['latin'] })
export const metadata = {
  title: 'Anansi Wallet',
  description: 'AA wallet secured with passkey'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <script src="https://accounts.google.com/gsi/client" async></script>
      <ClientRootLayout>{children}</ClientRootLayout>
    </html>
  )
}
