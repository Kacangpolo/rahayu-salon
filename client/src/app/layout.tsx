import { Outfit } from 'next/font/google';
import './globals.css';
import GoogleTranslate from '@/components/GoogleTranslate';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
});

export const metadata = {
    title: 'Rahayu Salon & Nails Art - Premium Beauty in Bali',
    description: 'Experience luxury hair, spa, nails, and eyelashes treatments in Denpasar, Bali.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className={`${outfit.className} bg-cream text-secondary`}>
                {children}
                <GoogleTranslate />
            </body>
        </html>
    );
}
