import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import '../globals.css'
import type { Metadata } from "next"

export const metadata: Metadata= {
    title: 'Ripples',
    description: 'A Next.js 13 social media application'
}

const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <ClerkProvider>
            <html lang='en'>
                <body className={`${inter.className} bg-dark-1`}>
                   <div className="w-full flex items-center justify-center min-h-screen"> {children}</div>
                </body>
            </html>
        </ClerkProvider>
    )
}