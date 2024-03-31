import { UserContextProvider } from '@/context/userContext'
import './globals.css'

import { Exo } from 'next/font/google'
import backgroundImage from '@/public/Frame.svg'
import './globals.css'

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
      <UserContextProvider>
        <body className={exo_font.className}>{children}</body>
      </UserContextProvider>
    </html>
  )
}
