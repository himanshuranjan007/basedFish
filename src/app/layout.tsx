import './globals.css';
import WagmiProviderWrapper from './components/WagmiProvider';
import ProfileIcon from './components/ProfileIcon';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'BasedFish',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProviderWrapper>
          <div className="relative min-h-screen">
            <ProfileIcon />
            {children}
          </div>
          <Toaster position="top-right" />
        </WagmiProviderWrapper>
      </body>
    </html>
  )
}
