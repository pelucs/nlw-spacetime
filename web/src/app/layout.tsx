import './globals.css'
import { cookies } from 'next/headers'
import { ReactNode } from 'react'
import { 
  Roboto_Flex as Roboto , 
  Bai_Jamjuree as BaiJamjuree  
} from 'next/font/google'
import Profile from '@/components/Profile'
import Signin from '@/components/Signin'
import Hero from '@/components/Hero'
import Copyright from '@/components/Copyright'

const roboto = Roboto({ subsets: ['latin'], variable: "--font-roboto" })
const baiJamjuree = BaiJamjuree({ subsets: ['latin'], weight: "700", variable: "--font-bai-jamjuree" })

export const metadata = {
  title: 'NLW - Spacetime',
  description: 'Cápsula do tempo',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {

  const isAuthenticated = cookies().has('token');

  return (
    <html lang="en">
      <body className={`${roboto.variable} ${baiJamjuree.variable} font-sans text-gray-100 bg-gray-900`}>       
        <main className="grid grid-cols-2 min-h-screen">
          {/* LEFT */}
          <div className="flex flex-col items-start justify-between px-28 py-16 relative overflow-hidden
          border-r border-white/10 bg-[url(../assets/stars.svg)]">
            
            {/* BLUR */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-[288px] w-[526px] 
            bg-purple-700 blur-[194px] rounded-full"/>

            {/* STRIPES */}
            <div className="absolute right-2 top-0 bottom-0 w-2 bg-stripes"/>

            {/* SIGN IN */} 
            {isAuthenticated ? <Profile/> : <Signin/>}

            {/* HERO */}
            <Hero/>

            {/* FOOTER */}
            <Copyright/>
            
          </div>

          {/* RIGHT */}
          <div className="flex flex-col overflow-y-scroll max-h-screen bg-[url(../assets/stars.svg)] bg-cover">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
