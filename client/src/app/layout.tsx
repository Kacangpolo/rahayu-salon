import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
})

export const metadata: Metadata = {
    title: 'Rahayu Salon - Reservasi Online',
    description: 'Book your luxury treatment today.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id">
            <body className={outfit.className}>{children}</body>
        </html>
    )
}
