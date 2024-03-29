import { UserContextProvider } from '@/context/userContext'

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
      <UserContextProvider>
        <body>{children}</body>
      </UserContextProvider>
    </html>
  )
}
